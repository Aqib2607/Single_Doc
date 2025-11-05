<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class Doctor extends Authenticatable
{
    use HasFactory, HasApiTokens;

    protected $primaryKey = 'doctor_id';
    
    protected $fillable = [
        'name',
        'email',
        'password',
        'specialization',
        'license_number',
        'bio',
        'phone',
        'gender',
        'availability',
        'consultation_fee'
    ];

    protected $hidden = [
        'password',
    ];

    protected $casts = [
        'availability' => 'array',
        'consultation_fee' => 'decimal:2'
    ];

    public function consultations(): HasMany
    {
        return $this->hasMany(Consultation::class, 'doctor_id', 'doctor_id');
    }

    public function medicalRecords(): HasMany
    {
        return $this->hasMany(MedicalRecord::class, 'doctor_id', 'doctor_id');
    }

    public function prescriptions(): HasMany
    {
        return $this->hasMany(Prescription::class, 'doctor_id', 'doctor_id');
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(DoctorReview::class, 'doctor_id', 'doctor_id');
    }

    public function blogs(): HasMany
    {
        return $this->hasMany(Blog::class, 'doctor_id', 'doctor_id');
    }

    public function galleries(): HasMany
    {
        return $this->hasMany(Gallery::class, 'doctor_id', 'doctor_id');
    }

    public function schedules(): HasMany
    {
        return $this->hasMany(Schedule::class, 'doctor_id', 'doctor_id');
    }

    public function guests(): HasMany
    {
        return $this->hasMany(Guest::class, 'doctor_id', 'doctor_id');
    }
}