<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Patient;
use App\Models\Doctor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class DebugController extends Controller
{
    public function testAppointmentBooking(Request $request)
    {
        try {
            $user = $request->user();
            
            $debugInfo = [
                'authenticated' => $user ? true : false,
                'user_type' => $user ? get_class($user) : null,
                'user_id' => $user ? ($user->patient_id ?? $user->doctor_id ?? $user->id) : null,
                'user_data' => $user ? [
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone ?? null,
                    'gender' => $user->gender ?? null
                ] : null,
                'recent_appointments' => Appointment::latest()->take(5)->get(),
                'total_appointments' => Appointment::count(),
                'doctors_count' => Doctor::count(),
                'patients_count' => Patient::count()
            ];
            
            return response()->json([
                'success' => true,
                'debug_info' => $debugInfo
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
                'line' => $e->getLine(),
                'file' => $e->getFile()
            ]);
        }
    }
}