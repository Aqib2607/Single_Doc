<?php

namespace App\Http\Controllers;

use App\Models\Prescription;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

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
            
            $query = Prescription::with(['patient', 'doctor']);
            
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
                'patient_id' => 'required|exists:patients,patient_id',
                'medication_name' => 'required|string|max:255',
                'dosage' => 'required|string|max:255',
                'frequency' => 'required|string|max:255',
                'instructions' => 'nullable|string',
                'start_date' => 'required|date',
                'end_date' => 'nullable|date|after:start_date',
                'is_active' => 'boolean',
            ]);

            // Get patient email
            $patient = \App\Models\Patient::where('patient_id', $validated['patient_id'])->first();
            
            $prescription = Prescription::create([
                ...$validated,
                'doctor_id' => $user->doctor_id,
                'patient_email' => $patient->email ?? null,
            ]);

            Log::info('Prescription created successfully', [
                'prescription_id' => $prescription->id,
                'doctor_id' => $user->doctor_id,
                'patient_id' => $validated['patient_id']
            ]);

            return response()->json($prescription->load(['patient', 'doctor']), 201);
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
            
            return response()->json($prescription->load(['patient', 'doctor']));
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
                'patient_id' => 'required|exists:patients,patient_id',
                'medication_name' => 'required|string|max:255',
                'dosage' => 'required|string|max:255',
                'frequency' => 'required|string|max:255',
                'instructions' => 'nullable|string',
                'start_date' => 'required|date',
                'end_date' => 'nullable|date|after:start_date',
                'is_active' => 'boolean',
                'refills_remaining' => 'nullable|integer|min:0',
            ]);

            $prescription->update($validated);
            
            Log::info('Prescription updated successfully', [
                'prescription_id' => $prescription->id,
                'doctor_id' => $user->doctor_id
            ]);

            return response()->json($prescription->load(['patient', 'doctor']));
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