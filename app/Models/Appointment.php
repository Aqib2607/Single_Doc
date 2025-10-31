<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
    use HasFactory;

    protected $fillable = [
        'patient_id',
        'name',
        'email',
        'phone',
        'gender',
        'appointment_date',
        'appointment_time',
        'doctor',
        'consultation_type',
        'reason',
        'terms_accepted',
        'status'
    ];

    protected $casts = [
        'appointment_date' => 'date',
        'appointment_time' => 'datetime:H:i',
        'terms_accepted' => 'boolean',
    ];
}

class Schedule extends Model
{
    use HasFactory;

    protected $fillable = [
        'doctor_email',
        'day_of_week',
        'start_time',
        'end_time',
        'is_available',
    ];

    protected $casts = [
        'start_time' => 'datetime:H:i',
        'end_time' => 'datetime:H:i',
        'is_available' => 'boolean',
    ];
}