<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CartItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'session_id',
        'name',
        'description',
        'price',
        'quantity',
        'category'
    ];

    protected $casts = [
        'price' => 'decimal:2',
    ];
}