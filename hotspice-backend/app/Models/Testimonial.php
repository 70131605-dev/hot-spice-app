<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'name', 'role', 'avatar', 'rating', 'comment', 'date', 'dish', 'sort_order', 'is_active',
])]
class Testimonial extends Model
{
    protected function casts(): array
    {
        return [
            'date' => 'date',
            'is_active' => 'boolean',
        ];
    }
}
