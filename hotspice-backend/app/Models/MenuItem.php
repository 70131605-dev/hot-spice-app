<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'category_id',
    'name',
    'slug',
    'description',
    'price',
    'image',
    'calories',
    'is_available',
    'is_featured',
    'is_special',
    'prep_time',
    'tags',
    'rating',
    'rating_count',
])]
class MenuItem extends Model
{
    use HasFactory;

    protected $casts = [
        'is_available' => 'boolean',
        'is_featured' => 'boolean',
        'is_special' => 'boolean',
        'tags' => 'array',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }
}