<?php

namespace App\Http\Controllers;

use App\Models\MedicalRecord;
use App\Models\Schedule;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class MedicalRecordController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    public function index(): JsonResponse
    {
        $user = auth()->user();
        
        // If user is a doctor, show only their records
        if ($user && isset($user->doctor_id)) {
            $records = MedicalRecord::with(['patient', 'doctor'])
                ->where('doctor_id', $user->doctor_id)
                ->orderBy('record_date', 'desc')
                ->get();
        } else {
            // For admin or other roles, show all records
            $records = MedicalRecord::with(['patient', 'doctor'])
                ->orderBy('record_date', 'desc')
                ->get();
        }

        return response()->json($records);
    }

    public function store(Request $request): JsonResponse
    {
        $user = auth()->user();
        
        if (!$user || !isset($user->doctor_id)) {
            return response()->json([
                'message' => 'Unauthorized. Doctor authentication required.'
            ], 401);
        }

        try {
            $validated = $request->validate([
                'patient_id' => 'required|exists:patients,patient_id',
                'patient_email' => 'nullable|email|max:255',
                'record_type' => 'required|string|max:255',
                'title' => 'required|string|max:255',
                'description' => 'nullable|string',
                'status' => 'required|in:pending,complete,reviewed',
                'record_date' => 'required|date',
                'medical_file' => 'nullable|file|mimes:pdf,doc,docx,jpg,jpeg,png|max:10240', // 10MB max
            ]);

            Log::info('Creating medical record', ['doctor_id' => $user->doctor_id, 'patient_id' => $validated['patient_id']]);

            // Handle file upload
            $filePath = null;
            if ($request->hasFile('medical_file')) {
                try {
                    $file = $request->file('medical_file');
                    $fileName = time() . '_' . $file->getClientOriginalName();
                    $filePath = $file->storeAs('medical_records', $fileName);
                    Log::info('File uploaded successfully', ['path' => $filePath, 'size' => $file->getSize()]);
                } catch (\Exception $e) {
                    Log::error('File upload failed', ['error' => $e->getMessage()]);
                    throw new \Exception('File upload failed: ' . $e->getMessage());
                }
            }

            $record = MedicalRecord::create([
                ...$validated,
                'doctor_id' => $user->doctor_id,
                'file_path' => $filePath,
            ]);

            Log::info('Medical record created successfully', [
                'record_id' => $record->id,
                'doctor_id' => $user->doctor_id,
                'patient_id' => $validated['patient_id'],
                'record_type' => $validated['record_type'],
                'has_file' => !is_null($filePath)
            ]);

            return response()->json($record->load(['patient', 'doctor']), 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['message' => 'Validation failed', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error('Medical record creation failed: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to create medical record: ' . $e->getMessage()], 500);
        }
    }

    public function show(MedicalRecord $medicalRecord): JsonResponse
    {
        return response()->json($medicalRecord->load(['patient', 'doctor']));
    }

    public function update(Request $request, MedicalRecord $medicalRecord): JsonResponse
    {
        $user = auth()->user();
        
        // Check if user owns this record
        if ($user && isset($user->doctor_id) && $medicalRecord->doctor_id !== $user->doctor_id) {
            return response()->json([
                'message' => 'Unauthorized. You can only update your own records.'
            ], 403);
        }

        try {
            $validated = $request->validate([
                'patient_id' => 'required|exists:patients,patient_id',
                'patient_email' => 'nullable|email|max:255',
                'record_type' => 'required|string|max:255',
                'title' => 'required|string|max:255',
                'description' => 'nullable|string',
                'status' => 'required|in:pending,complete,reviewed',
                'record_date' => 'required|date',
                'medical_file' => 'nullable|file|mimes:pdf,doc,docx,jpg,jpeg,png|max:10240', // 10MB max
            ]);

            // Handle file upload for updates
            if ($request->hasFile('medical_file')) {
                try {
                    // Delete old file if exists
                    if ($medicalRecord->file_path && Storage::exists($medicalRecord->file_path)) {
                        Storage::delete($medicalRecord->file_path);
                        Log::info('Old file deleted', ['path' => $medicalRecord->file_path]);
                    }
                    
                    $file = $request->file('medical_file');
                    $fileName = time() . '_' . $file->getClientOriginalName();
                    $validated['file_path'] = $file->storeAs('medical_records', $fileName);
                    Log::info('File updated successfully', ['path' => $validated['file_path'], 'size' => $file->getSize()]);
                } catch (\Exception $e) {
                    Log::error('File update failed', ['error' => $e->getMessage()]);
                    throw new \Exception('File update failed: ' . $e->getMessage());
                }
            }

            $medicalRecord->update($validated);

            return response()->json($medicalRecord->load(['patient', 'doctor']));
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['message' => 'Validation failed', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error('Medical record update failed: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to update medical record: ' . $e->getMessage()], 500);
        }
    }

    public function destroy(MedicalRecord $medicalRecord): JsonResponse
    {
        $user = auth()->user();
        
        // Check if user owns this record
        if ($user && isset($user->doctor_id) && $medicalRecord->doctor_id !== $user->doctor_id) {
            return response()->json([
                'message' => 'Unauthorized. You can only delete your own records.'
            ], 403);
        }

        try {
            // Delete associated file if exists
            if ($medicalRecord->file_path && Storage::exists($medicalRecord->file_path)) {
                try {
                    Storage::delete($medicalRecord->file_path);
                    Log::info('File deleted successfully', ['path' => $medicalRecord->file_path]);
                } catch (\Exception $e) {
                    Log::error('File deletion failed', ['path' => $medicalRecord->file_path, 'error' => $e->getMessage()]);
                    // Continue with record deletion even if file deletion fails
                }
            }

            $medicalRecord->delete();
            Log::info('Medical record deleted successfully', ['record_id' => $medicalRecord->id]);
            return response()->json(['message' => 'Medical record deleted successfully']);
        } catch (\Exception $e) {
            Log::error('Medical record deletion failed', ['record_id' => $medicalRecord->id, 'error' => $e->getMessage()]);
            return response()->json(['message' => 'Failed to delete medical record'], 500);
        }
    }

    public function downloadFile(MedicalRecord $medicalRecord)
    {
        $user = auth()->user();
        
        // Check if user owns this record or is the patient
        $canAccess = false;
        if ($user && isset($user->doctor_id) && $medicalRecord->doctor_id === $user->doctor_id) {
            $canAccess = true;
        } elseif ($user && isset($user->patient_id) && $medicalRecord->patient_id === $user->patient_id) {
            $canAccess = true;
        }
        
        if (!$canAccess) {
            return response()->json([
                'message' => 'Unauthorized. You can only access your own records.'
            ], 403);
        }

        try {
            if (!$medicalRecord->file_path || !Storage::exists($medicalRecord->file_path)) {
                Log::warning('File download attempted but file not found', ['record_id' => $medicalRecord->id, 'file_path' => $medicalRecord->file_path]);
                return response()->json(['message' => 'File not found'], 404);
            }

            Log::info('File download initiated', ['record_id' => $medicalRecord->id, 'file_path' => $medicalRecord->file_path]);
            return response()->download(storage_path('app/' . $medicalRecord->file_path));
        } catch (\Exception $e) {
            Log::error('File download failed', ['record_id' => $medicalRecord->id, 'error' => $e->getMessage()]);
            return response()->json(['message' => 'File download failed'], 500);
        }
    }

    public function getPatientMedicalRecords(Request $request): JsonResponse
    {
        $user = $request->user();
        
        if (!$user) {
            return response()->json(['error' => 'Authentication required'], 401);
        }
        
        if (!isset($user->patient_id)) {
            return response()->json(['error' => 'Patient profile not found'], 403);
        }
        
        try {
            $records = MedicalRecord::where('patient_id', $user->patient_id)
                ->orderBy('record_date', 'desc')
                ->get([
                    'id',
                    'record_type',
                    'title', 
                    'description',
                    'status',
                    'record_date',
                    'file_path',
                    'created_at'
                ]);
            
            return response()->json($records);
        } catch (\Exception $e) {
            Log::error('Failed to retrieve medical records for patient ' . $user->patient_id, [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'error' => 'Failed to retrieve medical records',
                'message' => 'Please try again later or contact support if the issue persists'
            ], 500);
        }
    }

    public function getDoctorSchedules(Request $request): JsonResponse
    {
        $user = $request->user();
        
        $schedules = Schedule::where('doctor_id', $user->doctor_id)
            ->orderBy('day_of_week')
            ->orderBy('start_time')
            ->get();
        
        return response()->json($schedules);
    }

    public function storeSchedule(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'day_of_week' => 'required|in:monday,tuesday,wednesday,thursday,friday,saturday,sunday',
            'start_time' => 'required',
            'end_time' => 'required',
            'is_available' => 'boolean',
        ]);

        // Normalize time format
        if (strlen($validated['start_time']) === 5) {
            $validated['start_time'] .= ':00';
        }
        if (strlen($validated['end_time']) === 5) {
            $validated['end_time'] .= ':00';
        }

        $user = $request->user();
        
        $schedule = Schedule::create([
            ...$validated,
            'doctor_id' => $user->doctor_id,
        ]);

        return response()->json($schedule, 201);
    }

    public function updateSchedule(Request $request, $id): JsonResponse
    {
        $validated = $request->validate([
            'day_of_week' => 'required|in:monday,tuesday,wednesday,thursday,friday,saturday,sunday',
            'start_time' => 'required',
            'end_time' => 'required',
            'is_available' => 'boolean',
        ]);

        // Normalize time format
        if (strlen($validated['start_time']) === 5) {
            $validated['start_time'] .= ':00';
        }
        if (strlen($validated['end_time']) === 5) {
            $validated['end_time'] .= ':00';
        }

        $user = $request->user();
        
        $schedule = Schedule::where('id', $id)
            ->where('doctor_id', $user->doctor_id)
            ->firstOrFail();
        
        $schedule->update($validated);

        return response()->json($schedule);
    }

    public function deleteSchedule(Request $request, $id): JsonResponse
    {
        $user = $request->user();
        
        $schedule = Schedule::where('id', $id)
            ->where('doctor_id', $user->doctor_id)
            ->firstOrFail();
        
        $schedule->delete();

        return response()->json(['message' => 'Schedule deleted successfully']);
    }
}