<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use App\Models\User;
use App\Models\Doctor;
use App\Models\Patient;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // Try to find patient first
        $patient = Patient::where('email', $credentials['email'])->first();
        if ($patient && Hash::check($credentials['password'], $patient->password)) {
            $token = $patient->createToken('auth_token')->plainTextToken;
            return response()->json([
                'user' => array_merge($patient->toArray(), ['role' => 'patient', 'id' => $patient->patient_id]),
                'token' => $token
            ]);
        }

        // Try to find doctor
        $doctor = Doctor::where('email', $credentials['email'])->first();
        if ($doctor && Hash::check($credentials['password'], $doctor->password)) {
            $token = $doctor->createToken('auth_token')->plainTextToken;
            return response()->json([
                'user' => array_merge($doctor->toArray(), ['role' => 'doctor', 'id' => $doctor->doctor_id]),
                'token' => $token
            ]);
        }

        return response()->json(['message' => 'Invalid credentials'], 401);
    }

    public function register(Request $request)
    {
        $role = $request->input('role');
        
        Log::info('Registration attempt', [
            'role' => $role,
            'data' => $request->except(['password', 'password_confirmation'])
        ]);
        
        try {
            if ($role === 'patient') {
                $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:patients',
                'password' => 'required|string|min:8|confirmed',
                'date_of_birth' => 'required|date',
                'gender' => 'nullable|in:male,female,other,prefer-not-to-say',
                'phone' => 'required|string|max:20',
                'address' => 'required|string',
                'emergency_contact_name' => 'required|string|max:255',
                'emergency_contact_phone' => 'required|string|max:20',
                'medical_history' => 'nullable|string',
                'allergies' => 'nullable|string',
            ]);

            $patient = Patient::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'date_of_birth' => $validated['date_of_birth'],
                'gender' => $validated['gender'] ?? 'prefer-not-to-say',
                'phone' => $validated['phone'],
                'address' => $validated['address'],
                'emergency_contact_name' => $validated['emergency_contact_name'],
                'emergency_contact_phone' => $validated['emergency_contact_phone'],
                'medical_history' => $validated['medical_history'] ?? null,
                'allergies' => $validated['allergies'] ?? null,
            ]);

            $token = $patient->createToken('auth_token')->plainTextToken;

            return response()->json([
                'user' => array_merge($patient->toArray(), ['role' => 'patient', 'id' => $patient->patient_id]),
                'token' => $token
            ]);
        } else {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:doctors',
                'password' => 'required|string|min:8|confirmed',
                'specialization' => 'required|string|max:255',
                'license_number' => 'required|string|max:255',
                'bio' => 'nullable|string',
                'phone' => 'required|string|max:20',
                'gender' => 'nullable|in:male,female,other,prefer-not-to-say',
                'consultation_fee' => 'nullable|numeric|min:0',
            ]);

            $doctor = Doctor::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'specialization' => $validated['specialization'],
                'license_number' => $validated['license_number'],
                'bio' => $validated['bio'] ?? null,
                'phone' => $validated['phone'],
                'gender' => $validated['gender'] ?? 'prefer-not-to-say',
                'consultation_fee' => $validated['consultation_fee'] ?? null,
            ]);

            $token = $doctor->createToken('auth_token')->plainTextToken;

            return response()->json([
                'user' => array_merge($doctor->toArray(), ['role' => 'doctor', 'id' => $doctor->doctor_id]),
                'token' => $token
            ]);
            }
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Registration validation failed', [
                'role' => $role,
                'errors' => $e->errors()
            ]);
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Registration failed', [
                'role' => $role,
                'error' => $e->getMessage()
            ]);
            return response()->json([
                'message' => 'Registration failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function logout(Request $request)
    {
        $token = $request->bearerToken();
        if ($token) {
            // Try to find and delete token from patients
            $patient = Patient::whereHas('tokens', function($query) use ($token) {
                $query->where('token', hash('sha256', $token));
            })->first();
            
            if ($patient) {
                $patient->tokens()->where('token', hash('sha256', $token))->delete();
                return response()->json(['message' => 'Logged out']);
            }
            
            // Try to find and delete token from doctors
            $doctor = Doctor::whereHas('tokens', function($query) use ($token) {
                $query->where('token', hash('sha256', $token));
            })->first();
            
            if ($doctor) {
                $doctor->tokens()->where('token', hash('sha256', $token))->delete();
                return response()->json(['message' => 'Logged out']);
            }
        }
        
        return response()->json(['message' => 'Logged out']);
    }
}