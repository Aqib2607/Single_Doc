<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Doctor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class DoctorProfileController extends Controller
{
    /**
     * Get the authenticated doctor's profile
     */
    public function show(Request $request)
    {
        $doctor = $request->user();
        
        if (!$doctor instanceof Doctor) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        return response()->json([
            'doctor_id' => $doctor->doctor_id,
            'name' => $doctor->name,
            'email' => $doctor->email,
            'specialization' => $doctor->specialization,
            'license_number' => $doctor->license_number,
            'bio' => $doctor->bio,
            'phone' => $doctor->phone,
            'gender' => $doctor->gender,
            'consultation_fee' => $doctor->consultation_fee,
            'availability' => $doctor->availability,
        ]);
    }

    /**
     * Update the authenticated doctor's profile
     */
    public function update(Request $request)
    {
        $doctor = $request->user();
        
        if (!$doctor instanceof Doctor) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => [
                'required',
                'email',
                Rule::unique('doctors')->ignore($doctor->doctor_id, 'doctor_id')
            ],
            'specialization' => 'required|string|max:255',
            'license_number' => [
                'required',
                'string',
                'max:50',
                Rule::unique('doctors')->ignore($doctor->doctor_id, 'doctor_id')
            ],
            'bio' => 'nullable|string|max:1000',
            'phone' => 'nullable|string|max:20',
            'gender' => 'required|in:male,female,other',
            'consultation_fee' => 'required|numeric|min:0',
            'availability' => 'nullable|array',
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

            if (!Hash::check($request->current_password, $doctor->password)) {
                return response()->json([
                    'error' => 'Current password is incorrect'
                ], 400);
            }
        }

        // Update doctor profile
        $updateData = $request->only([
            'name', 'email', 'specialization', 'license_number', 
            'bio', 'phone', 'gender', 'consultation_fee', 'availability'
        ]);

        if ($request->filled('new_password')) {
            $updateData['password'] = Hash::make($request->new_password);
        }

        $doctor->update($updateData);

        return response()->json([
            'message' => 'Profile updated successfully',
            'doctor' => [
                'doctor_id' => $doctor->doctor_id,
                'name' => $doctor->name,
                'email' => $doctor->email,
                'specialization' => $doctor->specialization,
                'license_number' => $doctor->license_number,
                'bio' => $doctor->bio,
                'phone' => $doctor->phone,
                'gender' => $doctor->gender,
                'consultation_fee' => $doctor->consultation_fee,
                'availability' => $doctor->availability,
            ]
        ]);
    }

    /**
     * Delete the authenticated doctor's account
     */
    public function destroy(Request $request)
    {
        $doctor = $request->user();
        
        if (!$doctor instanceof Doctor) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $request->validate([
            'password' => 'required|string',
            'confirmation' => 'required|string|in:DELETE',
        ]);

        // Verify password
        if (!Hash::check($request->password, $doctor->password)) {
            return response()->json([
                'error' => 'Password is incorrect'
            ], 400);
        }

        // Note: In a real application, you might want to:
        // 1. Soft delete instead of hard delete
        // 2. Transfer or handle related data (appointments, prescriptions, etc.)
        // 3. Send confirmation email
        // 4. Log the account deletion
        
        // For now, we'll just delete the doctor account
        $doctorName = $doctor->name;
        $doctorId = $doctor->doctor_id;
        
        // Revoke all tokens
        $doctor->tokens()->delete();
        
        // Delete the doctor
        $doctor->delete();

        return response()->json([
            'message' => "Doctor account for {$doctorName} (ID: {$doctorId}) has been successfully deleted."
        ]);
    }
}