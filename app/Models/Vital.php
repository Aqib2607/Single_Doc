<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Vital extends Model
{
    use HasFactory;

    protected $fillable = [
        'patient_id',
        'vital_type',
        'value',
        'unit',
        'recorded_at',
        'recorded_by',
        'notes'
    ];

    protected $casts = [
        'recorded_at' => 'datetime',
        'value' => 'decimal:2'
    ];

    public function patient(): BelongsTo
    {
        return $this->belongsTo(Patient::class, 'patient_id', 'patient_id');
    }

    public function isAbnormal(): bool
    {
        $normalRanges = [
            'blood_pressure_systolic' => ['min' => 90, 'max' => 140],
            'blood_pressure_diastolic' => ['min' => 60, 'max' => 90],
            'heart_rate' => ['min' => 60, 'max' => 100],
            'temperature' => ['min' => 97.0, 'max' => 99.5],
            'respiratory_rate' => ['min' => 12, 'max' => 20],
            'oxygen_saturation' => ['min' => 95, 'max' => 100]
        ];

        if (!isset($normalRanges[$this->vital_type])) {
            return false;
        }

        $range = $normalRanges[$this->vital_type];
        return $this->value < $range['min'] || $this->value > $range['max'];
    }
}