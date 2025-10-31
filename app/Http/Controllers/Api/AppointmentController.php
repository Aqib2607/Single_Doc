<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use Illuminate\Http\Request;

class AppointmentController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'gender' => 'nullable|in:male,female,other,prefer-not-to-say',
            'date' => 'required|date|after:today',
            'time' => 'required|string',
            'doctor' => 'required|string',
            'consultationType' => 'nullable|in:in-person,telemedicine,follow-up,consultation',
            'reason' => 'nullable|string|max:1000',
            'termsAccepted' => 'required|boolean|accepted'
        ]);

        $appointment = Appointment::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'gender' => $validated['gender'] ?? null,
            'appointment_date' => $validated['date'],
            'appointment_time' => $validated['time'],
            'doctor' => $validated['doctor'],
            'consultation_type' => $validated['consultationType'] ?? null,
            'reason' => $validated['reason'],
            'terms_accepted' => $validated['termsAccepted'],
        ]);

        return response()->json([
            'message' => 'Appointment booked successfully',
            'appointment' => $appointment
        ], 201);
    }

    public function index()
    {
        $appointments = Appointment::orderBy('appointment_date', 'desc')
                                  ->orderBy('appointment_time', 'desc')
                                  ->get();
        
        return response()->json($appointments);
    }

    public function getPatientAppointments(Request $request)
    {
        $email = $request->user()->email ?? $request->input('email');
        
        $appointments = Appointment::where('email', $email)
                                  ->orderBy('appointment_date', 'asc')
                                  ->orderBy('appointment_time', 'asc')
                                  ->get();
        
        return response()->json($appointments);
    }
}