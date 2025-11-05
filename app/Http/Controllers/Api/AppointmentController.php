<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Doctor;
use App\Http\Requests\StoreAppointmentRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Exception;

class AppointmentController extends Controller
{
    public function store(StoreAppointmentRequest $request)
    {
        try {
            // Get authenticated patient
            $user = $request->user();
            
            Log::info('Appointment booking attempt', [
                'user_exists' => $user ? true : false,
                'user_type' => $user ? get_class($user) : null,
                'patient_id' => $user->patient_id ?? null,
                'user_data' => $user ? $user->toArray() : null,
                'request_data' => $request->except(['password'])
            ]);
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Authentication required. Please log in to book an appointment.'
                ], 401);
            }
            
            $patientId = $user->patient_id ?? $user->getKey();
            if (!$patientId) {
                return response()->json([
                    'success' => false,
                    'message' => 'Patient authentication required. Only patients can book appointments through this endpoint.'
                ], 401);
            }
            
            // Get validated data from form request
            $validated = $request->validated();

            Log::info('Validation passed', [
                'patient_id' => $user->patient_id,
                'validated_data' => $validated
            ]);

            // Find doctor
            $doctor = Doctor::where('doctor_id', $validated['doctor_id'])->first();
            if (!$doctor) {
                Log::error('Doctor not found', ['doctor_id' => $validated['doctor_id']]);
                return response()->json([
                    'success' => false,
                    'message' => 'Selected doctor is not available. Please choose another doctor.',
                    'errors' => ['doctor_id' => ['The selected doctor is not available.']]
                ], 422);
            }

            Log::info('Doctor found', [
                'doctor_id' => $doctor->doctor_id,
                'doctor_name' => $doctor->name,
                'doctor_email' => $doctor->email
            ]);

            // Check for duplicate appointments
            $existingAppointment = Appointment::where('patient_id', $patientId)
                ->where('appointment_date', $validated['date'])
                ->where('appointment_time', $validated['time'])
                ->where('doctor_id', $doctor->doctor_id)
                ->whereIn('status', ['pending', 'confirmed'])
                ->first();

            if ($existingAppointment) {
                Log::warning('Duplicate appointment attempt', [
                    'patient_id' => $user->patient_id,
                    'date' => $validated['date'],
                    'time' => $validated['time'],
                    'doctor' => $doctor->name,
                    'existing_appointment_id' => $existingAppointment->id
                ]);
                return response()->json([
                    'success' => false,
                    'message' => 'You already have an appointment scheduled with this doctor at the same time.',
                    'errors' => ['general' => ['Duplicate appointment detected. Please choose a different time or date.']]
                ], 422);
            }

            Log::info('Patient authentication check', [
                'patient_id' => $patientId,
                'patient_name' => $user->name
            ]);

            // Create appointment with patient data
            $appointment = Appointment::create([
                'patient_id' => $patientId,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone ?? '',
                'gender' => $user->gender ?? 'prefer-not-to-say',
                'date_of_birth' => $user->date_of_birth ?? null,
                'appointment_date' => $validated['date'],
                'appointment_time' => $validated['time'],
                'doctor' => $doctor->name,
                'doctor_id' => $doctor->doctor_id,
                'consultation_type' => $validated['consultationType'] ?? null,
                'reason' => $validated['reason'] ?? '',
                'terms_accepted' => true,
                'status' => 'pending'
            ]);

            Log::info('Appointment created successfully', [
                'appointment_id' => $appointment->id,
                'patient_id' => $patientId,
                'doctor_name' => $doctor->name,
                'appointment_date' => $validated['date'],
                'appointment_time' => $validated['time']
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Appointment booked successfully! You will receive a confirmation email shortly.',
                'appointment' => [
                    'id' => $appointment->id,
                    'patient_name' => $appointment->name,
                    'doctor_name' => $appointment->doctor,
                    'appointment_date' => $appointment->appointment_date,
                    'appointment_time' => $appointment->appointment_time,
                    'status' => $appointment->status
                ]
            ], 201);

        } catch (ValidationException $e) {
            Log::error('Validation failed', [
                'errors' => $e->errors(),
                'patient_id' => $user->patient_id ?? null,
                'request_data' => $request->except(['password'])
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Please check your input and try again.',
                'errors' => $e->errors()
            ], 422);
            
        } catch (Exception $e) {
            Log::error('Appointment booking failed', [
                'error' => $e->getMessage(),
                'line' => $e->getLine(),
                'file' => $e->getFile(),
                'patient_id' => $user->patient_id ?? null,
                'request_data' => $request->except(['password'])
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

    public function getDoctorAppointments(Request $request)
    {
        try {
            $user = $request->user();
            
            if (!$user || !isset($user->doctor_id)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized. Doctor authentication required.'
                ], 401);
            }

            // Get doctor name for filtering
            $doctor = Doctor::find($user->doctor_id);
            if (!$doctor) {
                return response()->json([
                    'success' => false,
                    'message' => 'Doctor profile not found.'
                ], 404);
            }

            $appointments = Appointment::with(['patient', 'guest'])
                ->where(function($query) use ($doctor) {
                    $query->where('doctor_id', $doctor->doctor_id)
                          ->orWhere('doctor', $doctor->name);
                })
                ->orderBy('appointment_date', 'desc')
                ->orderBy('appointment_time', 'desc')
                ->get()
                ->map(function ($appointment) {
                    return [
                        'appointment_id' => $appointment->id,
                        'patient_info' => [
                            'name' => $appointment->name,
                            'email' => $appointment->email,
                            'phone' => $appointment->phone,
                            'gender' => $appointment->gender,
                            'type' => $appointment->patient_id ? 'Patient' : 'Guest'
                        ],
                        'date_time' => [
                            'date' => $appointment->appointment_date,
                            'time' => $appointment->appointment_time,
                            'formatted' => date('M d, Y', strtotime($appointment->appointment_date)) . ' at ' . date('g:i A', strtotime($appointment->appointment_time))
                        ],
                        'status' => $appointment->status,
                        'consultation_type' => $appointment->consultation_type,
                        'reason' => $appointment->reason,
                        'medical_notes' => $appointment->medical_notes ?? null
                    ];
                });

            if ($appointments->isEmpty()) {
                return response()->json([
                    'success' => true,
                    'data' => [],
                    'total' => 0,
                    'message' => 'No appointments found for this doctor.'
                ], 200);
            }

            return response()->json([
                'success' => true,
                'data' => $appointments,
                'total' => $appointments->count()
            ], 200);

        } catch (Exception $e) {
            Log::error('Error fetching doctor appointments', [
                'error' => $e->getMessage(),
                'doctor_id' => $user->doctor_id ?? null
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Unable to fetch appointments. Please try again later.'
            ], 500);
        }
    }

    public function getTodayAppointments(Request $request)
    {
        try {
            $user = $request->user();
            
            if (!$user || !isset($user->doctor_id)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized. Doctor authentication required.'
                ], 401);
            }

            // Get doctor name for filtering
            $doctor = Doctor::find($user->doctor_id);
            if (!$doctor) {
                return response()->json([
                    'success' => false,
                    'message' => 'Doctor profile not found.'
                ], 404);
            }

            $today = now()->format('Y-m-d');
            $appointments = Appointment::with(['patient', 'guest'])
                ->where(function($query) use ($doctor) {
                    $query->where('doctor_id', $doctor->doctor_id)
                          ->orWhere('doctor', $doctor->name);
                })
                ->whereDate('appointment_date', $today)
                ->orderBy('appointment_time', 'asc')
                ->get()
                ->map(function ($appointment) {
                    return [
                        'id' => $appointment->id,
                        'patient_name' => $appointment->name,
                        'patient_phone' => $appointment->phone,
                        'time' => date('H:i', strtotime($appointment->appointment_time)),
                        'formatted_time' => date('g:i A', strtotime($appointment->appointment_time)),
                        'purpose' => $appointment->reason ?: 'General consultation',
                        'status' => $appointment->status,
                        'consultation_type' => $appointment->consultation_type
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $appointments,
                'total' => $appointments->count()
            ], 200);

        } catch (Exception $e) {
            Log::error('Error fetching today appointments', [
                'error' => $e->getMessage(),
                'doctor_id' => $user->doctor_id ?? null
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Unable to fetch today\'s appointments.'
            ], 500);
        }
    }

    public function updateDoctorAppointment(Request $request, $id)
    {
        try {
            $user = $request->user();
            
            if (!$user || !isset($user->doctor_id)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized. Doctor authentication required.'
                ], 401);
            }

            $doctor = Doctor::find($user->doctor_id);
            if (!$doctor) {
                return response()->json([
                    'success' => false,
                    'message' => 'Doctor profile not found.'
                ], 404);
            }

            $appointment = Appointment::where('id', $id)
                ->where(function($query) use ($doctor) {
                    $query->where('doctor_id', $doctor->doctor_id)
                          ->orWhere('doctor', $doctor->name);
                })
                ->first();

            if (!$appointment) {
                return response()->json([
                    'success' => false,
                    'message' => 'Appointment not found.'
                ], 404);
            }

            $validated = $request->validate([
                'status' => 'required|in:pending,confirmed,cancelled',
                'medical_notes' => 'nullable|string'
            ]);

            $appointment->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Appointment updated successfully.'
            ]);

        } catch (Exception $e) {
            Log::error('Error updating appointment', [
                'error' => $e->getMessage(),
                'appointment_id' => $id
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Unable to update appointment.'
            ], 500);
        }
    }

    public function deleteDoctorAppointment(Request $request, $id)
    {
        try {
            $user = $request->user();
            
            if (!$user || !isset($user->doctor_id)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized. Doctor authentication required.'
                ], 401);
            }

            $doctor = Doctor::find($user->doctor_id);
            if (!$doctor) {
                return response()->json([
                    'success' => false,
                    'message' => 'Doctor profile not found.'
                ], 404);
            }

            $appointment = Appointment::where('id', $id)
                ->where(function($query) use ($doctor) {
                    $query->where('doctor_id', $doctor->doctor_id)
                          ->orWhere('doctor', $doctor->name);
                })
                ->first();

            if (!$appointment) {
                return response()->json([
                    'success' => false,
                    'message' => 'Appointment not found.'
                ], 404);
            }

            $appointment->delete();

            return response()->json([
                'success' => true,
                'message' => 'Appointment deleted successfully.'
            ]);

        } catch (Exception $e) {
            Log::error('Error deleting appointment', [
                'error' => $e->getMessage(),
                'appointment_id' => $id
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Unable to delete appointment.'
            ], 500);
        }
    }
}