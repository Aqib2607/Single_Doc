<?php

namespace App\Http\Controllers;

use App\Models\Consultation;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class ConsultationController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    public function index(): JsonResponse
    {
        $user = auth()->user();
        
        // If user is a doctor, show only their consultations
        if ($user && isset($user->doctor_id)) {
            $consultations = Consultation::with(['patient', 'doctor'])
                ->where('doctor_id', $user->doctor_id)
                ->orderBy('consultation_date', 'desc')
                ->get();
        } else {
            // For admin or other roles, show all consultations
            $consultations = Consultation::with(['patient', 'doctor'])
                ->orderBy('consultation_date', 'desc')
                ->get();
        }

        return response()->json($consultations);
    }

    public function store(Request $request): JsonResponse
    {
        $user = auth()->user();
        
        if (!$user || !isset($user->doctor_id)) {
            return response()->json([
                'message' => 'Unauthorized. Doctor authentication required.'
            ], 401);
        }

        $validated = $request->validate([
            'patient_id' => 'required|exists:patients,patient_id',
            'consultation_date' => 'required|date',
            'diagnosis' => 'required|string|max:255',
            'treatment' => 'nullable|string',
            'notes' => 'nullable|string',
            'follow_up_date' => 'nullable|date',
        ]);

        // Set doctor_id from authenticated user
        $validated['doctor_id'] = $user->doctor_id;

        Log::info('Creating consultation', $validated);

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
        $user = auth()->user();
        
        // Check if user owns this consultation
        if ($user && isset($user->doctor_id) && $consultation->doctor_id !== $user->doctor_id) {
            return response()->json([
                'message' => 'Unauthorized. You can only update your own consultations.'
            ], 403);
        }

        $validated = $request->validate([
            'patient_id' => 'required|exists:patients,patient_id',
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
        $user = auth()->user();
        
        // Check if user owns this consultation
        if ($user && isset($user->doctor_id) && $consultation->doctor_id !== $user->doctor_id) {
            return response()->json([
                'message' => 'Unauthorized. You can only delete your own consultations.'
            ], 403);
        }

        $consultation->delete();
        return response()->json(['message' => 'Consultation deleted successfully']);
    }
}