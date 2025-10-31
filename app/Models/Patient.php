<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class Patient extends Authenticatable
{
    use HasFactory, HasApiTokens;

    protected $primaryKey = 'patient_id';
    
    protected $fillable = [
        'name',
        'email',
        'password',
        'date_of_birth',
        'gender',
        'phone',
        'address',
        'emergency_contact_name',
        'emergency_contact_phone',
        'medical_history',
        'allergies'
    ];

    protected $hidden = [
        'password',
    ];

    protected $casts = [
        'date_of_birth' => 'date'
    ];

    public function consultations(): HasMany
    {
        return $this->hasMany(Consultation::class, 'patient_id', 'patient_id');
    }

    public function medicalRecords(): HasMany
    {
        return $this->hasMany(MedicalRecord::class, 'patient_id', 'patient_id');
    }

    public function prescriptions(): HasMany
    {
        return $this->hasMany(Prescription::class, 'patient_id', 'patient_id');
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(DoctorReview::class, 'patient_id', 'patient_id');
    }

    public function vitals(): HasMany
    {
        return $this->hasMany(Vital::class, 'patient_id', 'patient_id');
    }
}