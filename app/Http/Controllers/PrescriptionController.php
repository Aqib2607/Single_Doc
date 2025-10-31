<?php

namespace App\Http\Controllers;

use App\Models\Prescription;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class PrescriptionController extends Controller
{
    public function index(): JsonResponse
    {
        $prescriptions = Prescription::with(['patient', 'doctor'])
            ->orderBy('start_date', 'desc')
            ->get();

        return response()->json($prescriptions);
    }

    public function store(Request $request): JsonResponse
    {
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
                'doctor_id' => 1,
                'patient_email' => $patient->email,
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
        return response()->json($prescription->load(['patient', 'doctor']));
    }

    public function update(Request $request, Prescription $prescription): JsonResponse
    {
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

            $prescription->update($validated);

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
        $prescription->delete();
        return response()->json(['message' => 'Prescription deleted successfully']);
    }

    public function getPatientPrescriptions(Request $request): JsonResponse
    {
        $email = $request->user()->email ?? $request->input('email');
        
        $prescriptions = Prescription::where('patient_email', $email)
            ->where('is_active', true)
            ->orderBy('start_date', 'desc')
            ->get();
        
        return response()->json($prescriptions);
    }
}