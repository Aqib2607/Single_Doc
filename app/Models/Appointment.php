<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
    use HasFactory;

    protected $fillable = [
        'patient_id',
        'guest_id',
        'name',
        'email',
        'phone',
        'gender',
        'date_of_birth',
        'appointment_date',
        'appointment_time',
        'doctor',
        'doctor_id',
        'consultation_type',
        'reason',
        'medical_notes',
        'terms_accepted',
        'status'
    ];

    protected $casts = [
        'appointment_date' => 'date',
        'appointment_time' => 'datetime:H:i',
        'date_of_birth' => 'date',
        'terms_accepted' => 'boolean',
    ];

    public function doctor()
    {
        return $this->belongsTo(Doctor::class, 'doctor_id', 'doctor_id');
    }

    public function patient()
    {
        return $this->belongsTo(Patient::class, 'patient_id', 'patient_id');
    }

    public function guest()
    {
        return $this->belongsTo(Guest::class, 'guest_id', 'id');
    }
}