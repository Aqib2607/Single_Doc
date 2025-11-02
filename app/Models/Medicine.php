<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Medicine extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'category',
        'manufacturer',
        'price',
        'stock_quantity',
        'dosage_form',
        'strength',
        'is_active',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    protected $appends = ['inStock'];

    public function getInStockAttribute()
    {
        return $this->is_active && $this->stock_quantity > 0;
    }
}