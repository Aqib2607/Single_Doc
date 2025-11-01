<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Consultation extends Model
{
    use HasFactory;

    protected $fillable = [
        'doctor_id',
        'patient_id',
        'consultation_date',
        'diagnosis',
        'treatment',
        'notes',
        'follow_up_date',
        'treatment_plan',
    ];

    protected $casts = [
        'consultation_date' => 'date',
        'follow_up_date' => 'date',
    ];

    public function doctor(): BelongsTo
    {
        return $this->belongsTo(Doctor::class, 'doctor_id', 'doctor_id');
    }

    public function patient(): BelongsTo
    {
        return $this->belongsTo(Patient::class, 'patient_id', 'patient_id');
    }
}