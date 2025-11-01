<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreGuestRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // No authentication required for guest appointments
    }

    public function rules(): array
    {
        return [
            'full_name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone_number' => 'required|string|regex:/^[\+]?[1-9][\d]{0,15}$/',
            'appointment_date' => 'required|date|after:now',
            'doctor_id' => 'required|exists:doctors,doctor_id'
        ];
    }

    public function messages(): array
    {
        return [
            'full_name.required' => 'Full name is required',
            'phone_number.required' => 'Phone number is required',
            'phone_number.regex' => 'Please enter a valid phone number',
            'appointment_date.required' => 'Appointment date is required',
            'appointment_date.after' => 'Appointment date must be in the future',
            'doctor_id.required' => 'Please select a doctor',
            'doctor_id.exists' => 'Selected doctor does not exist',
            'email.email' => 'Please enter a valid email address'
        ];
    }
}