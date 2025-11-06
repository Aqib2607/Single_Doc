<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use App\Models\Guest;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class PatientController extends Controller
{
    public function index(): JsonResponse
    {
        $patients = Patient::all();
        return response()->json($patients);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:patients,email',
            'phone' => 'nullable|string|max:20',
            'age' => 'nullable|integer|min:0',
            'address' => 'nullable|string',
            'medical_history' => 'nullable|string',
        ]);

        $patient = Patient::create($validated);
        return response()->json($patient, 201);
    }

    public function show(Patient $patient): JsonResponse
    {
        return response()->json($patient);
    }

    public function update(Request $request, Patient $patient): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:patients,email,' . $patient->patient_id,
            'phone' => 'nullable|string|max:20',
            'age' => 'nullable|integer|min:0',
            'address' => 'nullable|string',
            'medical_history' => 'nullable|string',
        ]);

        $patient->update($validated);
        return response()->json($patient);
    }

    public function destroy(Patient $patient): JsonResponse
    {
        $patient->delete();
        return response()->json(['message' => 'Patient deleted successfully']);
    }

    public function getPatientsAndGuests(): JsonResponse
    {
        try {
            $user = auth()->user();
            
            if (!$user || !($user instanceof \App\Models\Doctor)) {
                return response()->json(['message' => 'Unauthorized'], 401);
            }

            // Get patients
            $patients = Patient::select('patient_id as id', 'name', 'email', 'phone')
                ->get()
                ->map(function ($patient) {
                    return [
                        'id' => $patient->id,
                        'name' => $patient->name,
                        'email' => $patient->email,
                        'phone' => $patient->phone,
                        'type' => 'patient',
                        'display_name' => $patient->name . ' (Patient)'
                    ];
                });

            // Get guests for this doctor
            $guests = Guest::select('id', 'full_name as name', 'email', 'phone_number as phone')
                ->where('doctor_id', $user->doctor_id)
                ->get()
                ->map(function ($guest) {
                    return [
                        'id' => 'guest_' . $guest->id,
                        'name' => $guest->name,
                        'email' => $guest->email,
                        'phone' => $guest->phone,
                        'type' => 'guest',
                        'display_name' => $guest->name . ' (Guest)'
                    ];
                });

            // Combine and sort by name
            $combined = $patients->concat($guests)->sortBy('name')->values();

            return response()->json($combined);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to fetch patients and guests'], 500);
        }
    }
}
