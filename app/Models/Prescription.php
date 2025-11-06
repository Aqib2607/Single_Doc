<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Prescription extends Model
{
    use HasFactory;

    protected $fillable = [
        'doctor_id',
        'patient_id',
        'patient_email',
        'medication_name',
        'dosage',
        'frequency',
        'instructions',
        'start_date',
        'end_date',
        'is_active',
        'refills_remaining',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'is_active' => 'boolean',
    ];

    public function doctor(): BelongsTo
    {
        return $this->belongsTo(Doctor::class, 'doctor_id', 'doctor_id');
    }

    public function patient(): BelongsTo
    {
        return $this->belongsTo(Patient::class, 'patient_id', 'patient_id');
    }

    public function medicines(): HasMany
    {
        return $this->hasMany(PrescriptionMedicine::class);
    }

    public function tests(): HasMany
    {
        return $this->hasMany(PrescriptionTest::class);
    }
}