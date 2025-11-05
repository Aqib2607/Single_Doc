<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Guest;
use App\Models\Appointment;
use App\Models\Doctor;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class BookingController extends Controller
{
    public function book(Request $request): JsonResponse
    {
        $user = $request->user();
        
        // Check if user is authenticated and has patient_id
        if ($user && isset($user->patient_id) && $user->patient_id) {
            return $this->bookPatientAppointment($request, $user);
        } else {
            return $this->bookGuestAppointment($request);
        }
    }

    private function bookPatientAppointment(Request $request, $patient): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'date' => 'required|date_format:Y-m-d|after_or_equal:' . now()->format('Y-m-d'),
            'time' => 'required|string',
            'doctor_id' => 'required|integer|exists:doctors,doctor_id',
            'consultationType' => 'nullable|in:in-person,telemedicine,follow-up,consultation',
            'reason' => 'nullable|string|max:1000',
            'termsAccepted' => 'required|accepted'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Patient booking validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            DB::beginTransaction();

            $doctor = Doctor::find($request->doctor_id);
            
            $appointment = Appointment::create([
                'patient_id' => $patient->patient_id,
                'name' => $patient->name,
                'email' => $patient->email,
                'phone' => $patient->phone,
                'gender' => $patient->gender,
                'date_of_birth' => $patient->date_of_birth,
                'appointment_date' => $request->date,
                'appointment_time' => $request->time,
                'doctor' => $doctor->name,
                'doctor_id' => $doctor->doctor_id,
                'consultation_type' => $request->consultationType,
                'reason' => $request->reason,
                'terms_accepted' => true,
                'status' => 'pending'
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Appointment booked successfully!',
                'appointment' => $appointment,
                'type' => 'patient'
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Patient booking failed. Please try again.'
            ], 500);
        }
    }

    private function bookGuestAppointment(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'required|string|min:10|max:20',
            'gender' => 'required|in:male,female,other,prefer-not-to-say',
            'date_of_birth' => 'required|date|before:today',
            'date' => 'required|date_format:Y-m-d|after_or_equal:' . now()->format('Y-m-d'),
            'time' => 'required|string',
            'doctor_id' => 'required|exists:doctors,doctor_id',
            'consultationType' => 'nullable|in:in-person,telemedicine,follow-up,consultation',
            'reason' => 'nullable|string|max:1000'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Guest booking validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            DB::beginTransaction();

            $doctor = Doctor::find($request->doctor_id);
            
            // Create guest record
            $guest = Guest::create([
                'full_name' => $request->name,
                'email' => $request->email,
                'phone_number' => $request->phone,
                'appointment_date' => $request->date . ' ' . $request->time . ':00',
                'doctor_id' => $doctor->doctor_id
            ]);

            // Create appointment record with guest reference
            $appointment = Appointment::create([
                'guest_id' => $guest->id,
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
                'gender' => $request->gender,
                'date_of_birth' => $request->date_of_birth,
                'appointment_date' => $request->date,
                'appointment_time' => $request->time,
                'doctor' => $doctor->name,
                'doctor_id' => $doctor->doctor_id,
                'consultation_type' => $request->consultationType,
                'reason' => $request->reason,
                'status' => 'pending'
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Guest appointment booked successfully!',
                'appointment' => $appointment,
                'guest' => $guest,
                'type' => 'guest'
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Guest booking failed. Please try again.'
            ], 500);
        }
    }
}