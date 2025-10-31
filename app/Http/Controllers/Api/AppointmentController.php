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
            
            // Get authenticated patient
            $user = $request->user();
            if (!$user || !isset($user->patient_id)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Authentication required. Please log in to book an appointment.'
                ], 401);
            }
            
            // Validate input data (only appointment-specific fields)
            $validated = $request->validate([
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
            $existingAppointment = Appointment::where('patient_id', $user->patient_id)
                ->where('appointment_date', $validated['date'])
                ->where('appointment_time', $validated['time'])
                ->where('doctor', $doctor->name)
                ->first();

            if ($existingAppointment) {
                Log::warning('Duplicate appointment attempt', [
                    'patient_id' => $user->patient_id,
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

            Log::info('Patient authentication check', [
                'patient_id' => $user->patient_id,
                'patient_name' => $user->name
            ]);

            // Create appointment with patient data
            $appointment = Appointment::create([
                'patient_id' => $user->patient_id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'gender' => $user->gender,
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

    public function destroy(Request $request, $id)
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
        if (isset($user->patient_id)) {
            $isOwner = $appointment->patient_id == $user->patient_id;
        } else {
            $isOwner = $appointment->email == $user->email;
        }
        
        if (!$isOwner) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
        
        // Only allow deletion of cancelled appointments
        if ($appointment->status !== 'cancelled') {
            return response()->json([
                'error' => 'Only cancelled appointments can be deleted'
            ], 422);
        }
        
        // Audit logging
        Log::info('Appointment deletion', [
            'appointment_id' => $appointment->id,
            'patient_id' => $user->patient_id,
            'patient_name' => $user->name,
            'doctor' => $appointment->doctor,
            'appointment_date' => $appointment->appointment_date,
            'deleted_at' => now(),
            'ip_address' => $request->ip()
        ]);
        
        $appointment->delete();
        
        return response()->json([
            'success' => true,
            'message' => 'Appointment deleted successfully'
        ]);
    }
}