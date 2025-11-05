<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreAppointmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'date' => [
                'required',
                'date_format:Y-m-d',
                'after_or_equal:' . now()->format('Y-m-d')
            ],
            'time' => [
                'required',
                'string',
                'regex:/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/'
            ],
            'doctor_id' => [
                'required',
                'integer',
                'exists:doctors,doctor_id'
            ],
            'consultationType' => [
                'nullable',
                Rule::in(['in-person', 'telemedicine', 'follow-up', 'consultation'])
            ],
            'reason' => [
                'nullable',
                'string',
                'max:1000'
            ],
            'termsAccepted' => [
                'required',
                'accepted'
            ]
        ];
    }

    public function messages(): array
    {
        return [
            'date.required' => 'Please select an appointment date.',
            'date.after_or_equal' => 'Appointment date cannot be in the past.',
            'time.required' => 'Please select an appointment time.',
            'time.regex' => 'Please provide a valid time format (HH:MM).',
            'doctor_id.required' => 'Please select a doctor.',
            'doctor_id.exists' => 'The selected doctor is not available.',
            'consultationType.in' => 'Please select a valid consultation type.',
            'reason.max' => 'Reason for visit cannot exceed 1000 characters.',
            'termsAccepted.accepted' => 'You must accept the terms and conditions.'
        ];
    }
}