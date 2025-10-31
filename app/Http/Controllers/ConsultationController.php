<?php

namespace App\Http\Controllers;

use App\Models\Consultation;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ConsultationController extends Controller
{
    public function index(): JsonResponse
    {
        $consultations = Consultation::with(['patient', 'doctor'])
            ->orderBy('consultation_date', 'desc')
            ->get();

        return response()->json($consultations);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'doctor_id' => 'nullable|exists:doctors,id',
            'consultation_date' => 'required|date',
            'diagnosis' => 'required|string|max:255',
            'treatment' => 'nullable|string',
            'notes' => 'nullable|string',
            'follow_up_date' => 'nullable|date',
        ]);

        // If no doctor_id provided, try to get from authenticated user or default
        if (!isset($validated['doctor_id'])) {
            $validated['doctor_id'] = 1; // Default doctor ID for now
        }

        $consultation = Consultation::create($validated);
        $consultation->load(['patient', 'doctor']);

        return response()->json($consultation, 201);
    }

    public function show(Consultation $consultation): JsonResponse
    {
        return response()->json($consultation->load(['patient', 'doctor']));
    }

    public function update(Request $request, Consultation $consultation): JsonResponse
    {
        $validated = $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'doctor_id' => 'nullable|exists:doctors,id',
            'consultation_date' => 'required|date',
            'diagnosis' => 'required|string|max:255',
            'treatment' => 'nullable|string',
            'notes' => 'nullable|string',
            'follow_up_date' => 'nullable|date',
        ]);

        $consultation->update($validated);
        $consultation->load(['patient', 'doctor']);

        return response()->json($consultation);
    }

    public function destroy(Consultation $consultation): JsonResponse
    {
        $consultation->delete();
        return response()->json(['message' => 'Consultation deleted successfully']);
    }
}