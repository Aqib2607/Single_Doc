<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Patient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class PatientProfileController extends Controller
{
    /**
     * Get the authenticated patient's profile
     */
    public function show(Request $request)
    {
        $patient = $request->user();
        
        if (!$patient instanceof Patient) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        return response()->json([
            'patient_id' => $patient->patient_id,
            'name' => $patient->name,
            'email' => $patient->email,
            'date_of_birth' => $patient->date_of_birth?->format('Y-m-d'),
            'gender' => $patient->gender,
            'phone' => $patient->phone,
            'address' => $patient->address,
            'emergency_contact_name' => $patient->emergency_contact_name,
            'emergency_contact_phone' => $patient->emergency_contact_phone,
            'medical_history' => $patient->medical_history,
            'allergies' => $patient->allergies,
        ]);
    }

    /**
     * Update the authenticated patient's profile
     */
    public function update(Request $request)
    {
        $patient = $request->user();
        
        if (!$patient instanceof Patient) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => [
                'required',
                'email',
                Rule::unique('patients')->ignore($patient->patient_id, 'patient_id')
            ],
            'date_of_birth' => 'nullable|date|before:today',
            'gender' => 'required|in:male,female,other',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:500',
            'emergency_contact_name' => 'nullable|string|max:255',
            'emergency_contact_phone' => 'nullable|string|max:20',
            'medical_history' => 'nullable|string|max:2000',
            'allergies' => 'nullable|string|max:1000',
            'current_password' => 'nullable|string',
            'new_password' => 'nullable|string|min:8|confirmed',
        ]);

        // If changing password, verify current password
        if ($request->filled('new_password')) {
            if (!$request->filled('current_password')) {
                return response()->json([
                    'error' => 'Current password is required to set a new password'
                ], 400);
            }

            if (!Hash::check($request->current_password, $patient->password)) {
                return response()->json([
                    'error' => 'Current password is incorrect'
                ], 400);
            }
        }

        // Update patient profile
        $updateData = $request->only([
            'name', 'email', 'date_of_birth', 'gender', 'phone', 'address',
            'emergency_contact_name', 'emergency_contact_phone', 'medical_history', 'allergies'
        ]);

        if ($request->filled('new_password')) {
            $updateData['password'] = Hash::make($request->new_password);
        }

        $patient->update($updateData);

        return response()->json([
            'message' => 'Profile updated successfully',
            'patient' => [
                'patient_id' => $patient->patient_id,
                'name' => $patient->name,
                'email' => $patient->email,
                'date_of_birth' => $patient->date_of_birth?->format('Y-m-d'),
                'gender' => $patient->gender,
                'phone' => $patient->phone,
                'address' => $patient->address,
                'emergency_contact_name' => $patient->emergency_contact_name,
                'emergency_contact_phone' => $patient->emergency_contact_phone,
                'medical_history' => $patient->medical_history,
                'allergies' => $patient->allergies,
            ]
        ]);
    }

    /**
     * Delete the authenticated patient's account
     */
    public function destroy(Request $request)
    {
        $patient = $request->user();
        
        if (!$patient instanceof Patient) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $request->validate([
            'password' => 'required|string',
            'confirmation' => 'required|string|in:DELETE',
        ]);

        // Verify password
        if (!Hash::check($request->password, $patient->password)) {
            return response()->json([
                'error' => 'Password is incorrect'
            ], 400);
        }

        // Note: In a real application, you might want to:
        // 1. Soft delete instead of hard delete
        // 2. Transfer or handle related data (appointments, medical records, etc.)
        // 3. Send confirmation email
        // 4. Log the account deletion
        
        // For now, we'll just delete the patient account
        $patientName = $patient->name;
        $patientId = $patient->patient_id;
        
        // Revoke all tokens
        $patient->tokens()->delete();
        
        // Delete the patient
        $patient->delete();

        return response()->json([
            'message' => "Patient account for {$patientName} (ID: {$patientId}) has been successfully deleted."
        ]);
    }
}