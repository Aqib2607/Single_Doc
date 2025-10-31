<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Doctor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Exception;

class AppointmentController extends Controller
{
    public function store(Request $request)
    {
        try {
            Log::info('Appointment booking attempt', ['request_data' => $request->all()]);
            
            // Validate input data
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|max:255',
                'phone' => 'required|string|max:20',
                'gender' => 'nullable|in:male,female,other,prefer-not-to-say',
                'date' => 'required|date_format:Y-m-d|after_or_equal:' . now()->format('Y-m-d'),
                'time' => 'required|string',
                'doctor_id' => 'required|integer|exists:doctors,doctor_id',
                'consultationType' => 'nullable|in:in-person,telemedicine,follow-up,consultation',
                'reason' => 'nullable|string|max:1000',
                'termsAccepted' => 'required|accepted'
            ]);

            Log::info('Validation passed', ['validated_data' => $validated]);

            // Find doctor
            $doctor = Doctor::find($validated['doctor_id']);
            if (!$doctor) {
                Log::error('Doctor not found', ['doctor_id' => $validated['doctor_id']]);
                return response()->json([
                    'success' => false,
                    'message' => 'Selected doctor is not available. Please choose another doctor.',
                    'errors' => ['doctor_id' => ['The selected doctor is not available.']]
                ], 422);
            }

            Log::info('Doctor found', ['doctor' => $doctor->name]);

            // Check for duplicate appointments
            $existingAppointment = Appointment::where('email', $validated['email'])
                ->where('appointment_date', $validated['date'])
                ->where('appointment_time', $validated['time'])
                ->where('doctor', $doctor->name)
                ->first();

            if ($existingAppointment) {
                Log::warning('Duplicate appointment attempt', [
                    'email' => $validated['email'],
                    'date' => $validated['date'],
                    'time' => $validated['time'],
                    'doctor' => $doctor->name
                ]);
                return response()->json([
                    'success' => false,
                    'message' => 'You already have an appointment scheduled with this doctor at the same time.',
                    'errors' => ['appointment' => ['Duplicate appointment detected.']]
                ], 422);
            }

            // Get patient ID if authenticated
            $patientId = null;
            if ($request->user() && method_exists($request->user(), 'patient_id')) {
                $patientId = $request->user()->patient_id;
            }

            // Create appointment
            $appointment = Appointment::create([
                'patient_id' => $patientId,
                'name' => $validated['name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'],
                'gender' => $validated['gender'] ?? null,
                'appointment_date' => $validated['date'],
                'appointment_time' => $validated['time'],
                'doctor' => $doctor->name,
                'consultation_type' => $validated['consultationType'] ?? null,
                'reason' => $validated['reason'],
                'terms_accepted' => $validated['termsAccepted'],
                'status' => 'pending'
            ]);

            Log::info('Appointment created successfully', ['appointment_id' => $appointment->id]);

            return response()->json([
                'success' => true,
                'message' => 'Appointment booked successfully! You will receive a confirmation email shortly.',
                'appointment' => $appointment
            ], 201);

        } catch (ValidationException $e) {
            Log::error('Validation failed', [
                'errors' => $e->errors(),
                'request_data' => $request->all()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Please check your input and try again.',
                'errors' => $e->errors()
            ], 422);
            
        } catch (Exception $e) {
            Log::error('Appointment booking failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'request_data' => $request->all()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Unable to book appointment at this time. Please try again later or contact support.',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
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
        $user = $request->user();
        
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        
        // Query by patient_id if available, otherwise fall back to email
        $query = Appointment::query();
        
        if (method_exists($user, 'patient_id') && $user->patient_id) {
            $query->where('patient_id', $user->patient_id);
        } else {
            $query->where('email', $user->email);
        }
        
        $appointments = $query->orderBy('appointment_date', 'desc')
                             ->orderBy('appointment_time', 'desc')
                             ->get();
        
        return response()->json($appointments);
    }

    public function update(Request $request, $id)
    {
        $user = $request->user();
        
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        
        $appointment = Appointment::find($id);
        
        if (!$appointment) {
            return response()->json(['error' => 'Appointment not found'], 404);
        }
        
        // Verify ownership
        $isOwner = false;
        if (method_exists($user, 'patient_id') && $user->patient_id) {
            $isOwner = $appointment->patient_id == $user->patient_id;
        } else {
            $isOwner = $appointment->email == $user->email;
        }
        
        if (!$isOwner) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
        
        $validated = $request->validate([
            'status' => 'required|in:pending,confirmed,cancelled'
        ]);
        
        $appointment->update($validated);
        
        return response()->json([
            'success' => true,
            'message' => 'Appointment updated successfully',
            'appointment' => $appointment
        ]);
    }
}