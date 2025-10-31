<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Message extends Model
{
    use HasFactory;

    protected $fillable = [
        'sender_id',
        'sender_type',
        'receiver_id',
        'receiver_type',
        'subject',
        'message',
        'is_read',
        'read_at',
    ];

    protected $casts = [
        'is_read' => 'boolean',
        'read_at' => 'datetime',
    ];

    public function sender()
    {
        if ($this->sender_type === 'doctor') {
            return $this->belongsTo(Doctor::class, 'sender_id', 'doctor_id');
        }
        return $this->belongsTo(Patient::class, 'sender_id', 'patient_id');
    }

    public function receiver()
    {
        if ($this->receiver_type === 'doctor') {
            return $this->belongsTo(Doctor::class, 'receiver_id', 'doctor_id');
        }
        return $this->belongsTo(Patient::class, 'receiver_id', 'patient_id');
    }
}