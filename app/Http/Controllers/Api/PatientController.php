<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PatientController extends Controller
{
    public function profile(Request $request)
    {
        $user = $request->user();
        
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        
        Log::info('Patient profile request', [
            'user_type' => get_class($user),
            'user_data' => $user->toArray(),
            'patient_id' => $user->patient_id ?? 'NULL',
            'primary_key' => $user->getKey()
        ]);
        
        // Check if user is a doctor or patient
        if ($user instanceof \App\Models\Doctor) {
            return response()->json([
                'doctor_id' => $user->doctor_id,
                'name' => $user->name ?? '',
                'email' => $user->email ?? '',
                'phone' => $user->phone ?? '',
                'gender' => $user->gender ?? 'prefer-not-to-say',
                'date_of_birth' => null // Doctors don't have date_of_birth
            ]);
        } else {
            return response()->json([
                'patient_id' => $user->patient_id ?? $user->getKey(),
                'name' => $user->name ?? '',
                'email' => $user->email ?? '',
                'phone' => $user->phone ?? '',
                'gender' => $user->gender ?? 'prefer-not-to-say',
                'date_of_birth' => $user->date_of_birth ?? null
            ]);
        }
    }
}