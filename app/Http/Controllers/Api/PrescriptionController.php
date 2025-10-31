<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Prescription;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PrescriptionController extends Controller
{
    public function getPatientPrescriptions(Request $request)
    {
        $user = $request->user();
        
        if (!$user) {
            return response()->json(['error' => 'Authentication required'], 401);
        }
        
        if (!isset($user->patient_id)) {
            return response()->json(['error' => 'Patient profile not found'], 403);
        }
        
        try {
            $prescriptions = Prescription::where('patient_id', $user->patient_id)
                                       ->orderBy('created_at', 'desc')
                                       ->get([
                                           'id',
                                           'medication_name',
                                           'dosage',
                                           'frequency',
                                           'instructions',
                                           'start_date',
                                           'end_date',
                                           'is_active',
                                           'refills_remaining',
                                           'created_at'
                                       ]);
            
            // Add computed fields for frontend
            $prescriptions = $prescriptions->map(function ($prescription) {
                $prescription->is_expired = $prescription->end_date && 
                                          now()->gt($prescription->end_date);
                $prescription->is_currently_active = $prescription->is_active && 
                                                   !$prescription->is_expired;
                return $prescription;
            });
            
            return response()->json($prescriptions);
        } catch (\Exception $e) {
            Log::error('Failed to retrieve prescriptions for patient ' . $user->patient_id, [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'error' => 'Failed to retrieve prescriptions',
                'message' => 'Please try again later or contact support if the issue persists'
            ], 500);
        }
    }
}