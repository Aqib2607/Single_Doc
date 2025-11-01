<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Guest extends Model
{
    use HasFactory;

    protected $fillable = [
        'full_name',
        'email',
        'phone_number',
        'appointment_date',
        'doctor_id'
    ];

    protected $casts = [
        'appointment_date' => 'datetime'
    ];

    public function doctor(): BelongsTo
    {
        return $this->belongsTo(Doctor::class, 'doctor_id', 'doctor_id');
    }

    public static function rules(): array
    {
        return [
            'full_name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone_number' => 'required|string|regex:/^[\+]?[1-9][\d]{0,15}$/',
            'appointment_date' => 'required|date|after:now',
            'doctor_id' => 'required|exists:doctors,doctor_id'
        ];
    }
}