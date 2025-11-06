<?php

namespace App\Http\Controllers;

use App\Models\Prescription;
use App\Models\PrescriptionMedicine;
use App\Models\PrescriptionTest;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class PrescriptionController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    public function index(Request $request): JsonResponse
    {
        try {
            $user = auth()->user();
            $perPage = $request->get('per_page', 15);
            $search = $request->get('search');
            $status = $request->get('status');
            
            $query = Prescription::with(['patient', 'guest', 'doctor', 'medicines', 'tests']);
            
            if ($user && $user instanceof \App\Models\Doctor) {
                $query->where('doctor_id', $user->doctor_id);
            }
            
            if ($search) {
                $query->where(function($q) use ($search) {
                    $q->where('medication_name', 'like', "%{$search}%")
                      ->orWhereHas('patient', function($pq) use ($search) {
                          $pq->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                      });
                });
            }
            
            if ($status && $status !== 'all') {
                $query->where('is_active', $status === 'active');
            }
            
            $prescriptions = $query->orderBy('start_date', 'desc')->paginate($perPage);
            
            return response()->json($prescriptions);
        } catch (\Exception $e) {
            Log::error('Failed to fetch prescriptions: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to fetch prescriptions'], 500);
        }
    }

    public function store(Request $request): JsonResponse
    {
        $user = auth()->user();
        
        if (!$user || !($user instanceof \App\Models\Doctor)) {
            return response()->json([
                'message' => 'Unauthorized. Doctor authentication required.'
            ], 401);
        }

        try {
            $validated = $request->validate([
                'patient_id' => 'required|string',
                'instructions' => 'nullable|string',
                'is_active' => 'boolean',
                'medicines' => 'nullable|array',
                'medicines.*.medicine_name' => 'required|string|max:255',
                'medicines.*.dosage' => 'required|string|max:255',
                'medicines.*.frequency' => 'required|string|max:255',
                'medicines.*.start_date' => 'required|date',
                'medicines.*.end_date' => 'nullable|date|after:medicines.*.start_date',
                'medicines.*.refills_remaining' => 'nullable|integer|min:0',
                'medicines.*.instructions' => 'nullable|string',
                'tests' => 'nullable|array',
                'tests.*.test_name' => 'required|string|max:255',
                'tests.*.description' => 'nullable|string',
                'tests.*.instructions' => 'nullable|string',
            ]);

            $prescription = DB::transaction(function () use ($validated, $user) {
                // Handle patient or guest
                $patientEmail = null;
                $actualPatientId = null;
                $guestId = null;
                
                if (str_starts_with($validated['patient_id'], 'guest_')) {
                    $guestId = str_replace('guest_', '', $validated['patient_id']);
                    $guest = \App\Models\Guest::find($guestId);
                    $patientEmail = $guest->email ?? null;
                } else {
                    $actualPatientId = $validated['patient_id'];
                    $patient = \App\Models\Patient::where('patient_id', $validated['patient_id'])->first();
                    $patientEmail = $patient->email ?? null;
                }
                
                // Create prescription with basic info
                $prescriptionData = [
                    'patient_id' => $actualPatientId,
                    'guest_id' => $guestId,
                    'doctor_id' => $user->doctor_id,
                    'patient_email' => $patientEmail,
                    'is_active' => $validated['is_active'] ?? true,
                    'instructions' => $validated['instructions'] ?? null,
                ];
                
                // Add legacy fields if provided (backward compatibility)
                if (!empty($validated['medication_name'])) {
                    $prescriptionData['medication_name'] = $validated['medication_name'];
                    $prescriptionData['dosage'] = $validated['dosage'];
                    $prescriptionData['frequency'] = $validated['frequency'];
                }
                
                $prescription = Prescription::create($prescriptionData);
                
                // Create medicines
                if (!empty($validated['medicines'])) {
                    foreach ($validated['medicines'] as $medicine) {
                        PrescriptionMedicine::create([
                            'prescription_id' => $prescription->id,
                            ...$medicine
                        ]);
                    }
                }
                
                // Create tests
                if (!empty($validated['tests'])) {
                    foreach ($validated['tests'] as $test) {
                        PrescriptionTest::create([
                            'prescription_id' => $prescription->id,
                            ...$test
                        ]);
                    }
                }
                
                return $prescription->load(['patient', 'guest', 'doctor', 'medicines', 'tests']);
            });

            Log::info('Prescription created successfully', [
                'prescription_id' => $prescription->id,
                'doctor_id' => $user->doctor_id,
                'patient_id' => $validated['patient_id']
            ]);

            return response()->json($prescription, 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['message' => 'Validation failed', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error('Prescription creation failed: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to create prescription: ' . $e->getMessage()], 500);
        }
    }

    public function show(Prescription $prescription): JsonResponse
    {
        try {
            $user = auth()->user();
            
            if ($user && $user instanceof \App\Models\Doctor && $prescription->doctor_id !== $user->doctor_id) {
                return response()->json(['message' => 'Unauthorized access'], 403);
            }
            
            return response()->json($prescription->load(['patient', 'guest', 'doctor', 'medicines', 'tests']));
        } catch (\Exception $e) {
            Log::error('Failed to fetch prescription: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to fetch prescription'], 500);
        }
    }

    public function update(Request $request, Prescription $prescription): JsonResponse
    {
        try {
            $user = auth()->user();
            
            if ($user && $user instanceof \App\Models\Doctor && $prescription->doctor_id !== $user->doctor_id) {
                return response()->json(['message' => 'Unauthorized access'], 403);
            }
            
            $validated = $request->validate([
                'patient_id' => 'required|string',
                'instructions' => 'nullable|string',
                'is_active' => 'boolean',
                'medicines' => 'nullable|array',
                'medicines.*.medicine_name' => 'required|string|max:255',
                'medicines.*.dosage' => 'required|string|max:255',
                'medicines.*.frequency' => 'required|string|max:255',
                'medicines.*.start_date' => 'required|date',
                'medicines.*.end_date' => 'nullable|date|after:medicines.*.start_date',
                'medicines.*.refills_remaining' => 'nullable|integer|min:0',
                'medicines.*.instructions' => 'nullable|string',
                'tests' => 'nullable|array',
                'tests.*.test_name' => 'required|string|max:255',
                'tests.*.description' => 'nullable|string',
                'tests.*.instructions' => 'nullable|string',
            ]);

            $prescription = DB::transaction(function () use ($validated, $prescription) {
                // Update prescription basic info
                $prescriptionData = [
                    'patient_id' => $validated['patient_id'],
                    'is_active' => $validated['is_active'] ?? true,
                    'instructions' => $validated['instructions'] ?? null,
                ];
                
                // Add legacy fields if provided
                if (!empty($validated['medication_name'])) {
                    $prescriptionData['medication_name'] = $validated['medication_name'];
                    $prescriptionData['dosage'] = $validated['dosage'];
                    $prescriptionData['frequency'] = $validated['frequency'];
                }
                
                $prescription->update($prescriptionData);
                
                // Update medicines
                if (isset($validated['medicines'])) {
                    $prescription->medicines()->delete();
                    foreach ($validated['medicines'] as $medicine) {
                        PrescriptionMedicine::create([
                            'prescription_id' => $prescription->id,
                            ...$medicine
                        ]);
                    }
                }
                
                // Update tests
                if (isset($validated['tests'])) {
                    $prescription->tests()->delete();
                    foreach ($validated['tests'] as $test) {
                        PrescriptionTest::create([
                            'prescription_id' => $prescription->id,
                            ...$test
                        ]);
                    }
                }
                
                return $prescription->load(['patient', 'guest', 'doctor', 'medicines', 'tests']);
            });
            
            Log::info('Prescription updated successfully', [
                'prescription_id' => $prescription->id,
                'doctor_id' => $user->doctor_id
            ]);

            return response()->json($prescription);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['message' => 'Validation failed', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error('Prescription update failed: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to update prescription: ' . $e->getMessage()], 500);
        }
    }

    public function destroy(Prescription $prescription): JsonResponse
    {
        try {
            $user = auth()->user();
            
            if ($user && $user instanceof \App\Models\Doctor && $prescription->doctor_id !== $user->doctor_id) {
                return response()->json(['message' => 'Unauthorized access'], 403);
            }
            
            $prescriptionId = $prescription->id;
            $prescription->delete();
            
            Log::info('Prescription deleted successfully', [
                'prescription_id' => $prescriptionId,
                'doctor_id' => $user->doctor_id
            ]);
            
            return response()->json(['message' => 'Prescription deleted successfully']);
        } catch (\Exception $e) {
            Log::error('Prescription deletion failed: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to delete prescription'], 500);
        }
    }

    public function getPatientPrescriptions(Request $request): JsonResponse
    {
        try {
            $email = $request->user()->email ?? $request->input('email');
            $perPage = $request->get('per_page', 10);
            
            $prescriptions = Prescription::with(['doctor'])
                ->where('patient_email', $email)
                ->where('is_active', true)
                ->orderBy('start_date', 'desc')
                ->paginate($perPage);
            
            return response()->json($prescriptions);
        } catch (\Exception $e) {
            Log::error('Failed to fetch patient prescriptions: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to fetch prescriptions'], 500);
        }
    }
    
    public function bulkUpdate(Request $request): JsonResponse
    {
        try {
            $user = auth()->user();
            
            if (!$user || !($user instanceof \App\Models\Doctor)) {
                return response()->json(['message' => 'Unauthorized'], 401);
            }
            
            $validated = $request->validate([
                'prescription_ids' => 'required|array',
                'prescription_ids.*' => 'exists:prescriptions,id',
                'action' => 'required|in:activate,deactivate,delete',
            ]);
            
            $prescriptions = Prescription::whereIn('id', $validated['prescription_ids'])
                ->where('doctor_id', $user->doctor_id)
                ->get();
            
            if ($prescriptions->count() !== count($validated['prescription_ids'])) {
                return response()->json(['message' => 'Some prescriptions not found or unauthorized'], 403);
            }
            
            switch ($validated['action']) {
                case 'activate':
                    $prescriptions->each(fn($p) => $p->update(['is_active' => true]));
                    break;
                case 'deactivate':
                    $prescriptions->each(fn($p) => $p->update(['is_active' => false]));
                    break;
                case 'delete':
                    $prescriptions->each(fn($p) => $p->delete());
                    break;
            }
            
            Log::info('Bulk prescription update completed', [
                'action' => $validated['action'],
                'count' => $prescriptions->count(),
                'doctor_id' => $user->doctor_id
            ]);
            
            return response()->json(['message' => 'Bulk operation completed successfully']);
        } catch (\Exception $e) {
            Log::error('Bulk prescription update failed: ' . $e->getMessage());
            return response()->json(['message' => 'Bulk operation failed'], 500);
        }
    }
}