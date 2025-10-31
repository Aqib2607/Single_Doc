<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class Doctor extends Authenticatable
{
    use HasFactory, HasApiTokens;

    protected $fillable = [
        'name',
        'email',
        'password',
        'specialization',
        'license_number',
        'bio',
        'phone',
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
        return $this->hasMany(Consultation::class, 'doctor_id');
    }
}