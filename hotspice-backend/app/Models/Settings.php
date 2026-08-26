<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'store_name',
    'opening_time',
    'closing_time',
    'delivery_fee',
    'min_order_value',
    'is_accepting_orders',
])]
class Settings extends Model
{
    protected function casts(): array
    {
        return [
            'delivery_fee' => 'decimal:2',
            'min_order_value' => 'decimal:2',
            'is_accepting_orders' => 'boolean',
        ];
    }

    /**
     * The app is single-store, so settings is always exactly one row (id 1).
     * The migration seeds it; firstOrCreate here is just a safety net.
     */
    public static function current(): self
    {
        return static::firstOrCreate(['id' => 1], [
            'store_name' => 'Hot & Spice',
            'delivery_fee' => 2.99,
            'min_order_value' => 0,
            'is_accepting_orders' => true,
        ]);
    }
}
