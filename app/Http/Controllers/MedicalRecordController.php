<?php

namespace App\Http\Controllers;

use App\Models\MedicalRecord;
use App\Models\Schedule;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

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
                'patient_id' => 'required|exists:patients,id',
                'record_type' => 'required|string|max:255',
                'title' => 'required|string|max:255',
                'description' => 'nullable|string',
                'status' => 'required|in:pending,complete,reviewed',
                'record_date' => 'required|date',
            ]);

            $record = MedicalRecord::create([
                ...$validated,
                'doctor_id' => 1,
            ]);

            return response()->json($record->load(['patient', 'doctor']), 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['message' => 'Validation failed', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            \Log::error('Medical record creation failed: ' . $e->getMessage());
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
                'patient_id' => 'required|exists:patients,id',
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
            \Log::error('Medical record update failed: ' . $e->getMessage());
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
        $email = $request->user()->email ?? $request->input('email');
        
        $records = MedicalRecord::where('patient_email', $email)
            ->orderBy('record_date', 'desc')
            ->get();
        
        return response()->json($records);
    }

    public function getDoctorSchedules(Request $request): JsonResponse
    {
        $user = $request->user();
        
        $schedules = Schedule::where('doctor_email', $user->email)
            ->orderBy('day_of_week')
            ->orderBy('start_time')
            ->get();
        
        return response()->json($schedules);
    }

    public function storeSchedule(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'day_of_week' => 'required|in:monday,tuesday,wednesday,thursday,friday,saturday,sunday',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'is_available' => 'boolean',
        ]);

        $user = $request->user();
        
        $schedule = Schedule::create([
            ...$validated,
            'doctor_id' => $user->id,
            'doctor_email' => $user->email,
        ]);

        return response()->json($schedule, 201);
    }
}