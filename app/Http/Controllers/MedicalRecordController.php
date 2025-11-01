<?php

namespace App\Http\Controllers;

use App\Models\MedicalRecord;
use App\Models\Schedule;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class MedicalRecordController extends Controller
{
    public function index(): JsonResponse
    {
        $records = MedicalRecord::with(['patient', 'doctor'])
            ->orderBy('record_date', 'desc')
            ->get();

        return response()->json($records);
    }

    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'patient_id' => 'required|exists:patients,patient_id',
                'record_type' => 'required|string|max:255',
                'title' => 'required|string|max:255',
                'description' => 'nullable|string',
                'status' => 'required|in:pending,complete,reviewed',
                'record_date' => 'required|date',
            ]);

            $record = MedicalRecord::create([
                ...$validated,
                'doctor_id' => auth()->user()->doctor_id ?? 1,
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
        try {
            $validated = $request->validate([
                'patient_id' => 'required|exists:patients,patient_id',
                'record_type' => 'required|string|max:255',
                'title' => 'required|string|max:255',
                'description' => 'nullable|string',
                'status' => 'required|in:pending,complete,reviewed',
                'record_date' => 'required|date',
            ]);

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
        $medicalRecord->delete();
        return response()->json(['message' => 'Medical record deleted successfully']);
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