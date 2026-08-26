<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'code',
    'discount_type',
    'discount_value',
    'min_order_value',
    'expires_at',
    'usage_limit',
    'times_used',
    'is_active',
])]
class Coupon extends Model
{
    protected function casts(): array
    {
        return [
            'expires_at' => 'date',
            'discount_value' => 'decimal:2',
            'min_order_value' => 'decimal:2',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Null if the coupon can be applied to an order of this subtotal,
     * otherwise a customer-facing reason why not.
     */
    public function invalidReason(float $subtotal): ?string
    {
        if (! $this->is_active) {
            return 'This coupon is no longer active.';
        }

        if ($this->expires_at && now()->startOfDay()->gt($this->expires_at)) {
            return 'This coupon has expired.';
        }

        if ($this->usage_limit !== null && $this->times_used >= $this->usage_limit) {
            return 'This coupon has reached its usage limit.';
        }

        if ($subtotal < $this->min_order_value) {
            return 'This coupon requires a minimum order of Rs. '.number_format((float) $this->min_order_value, 2).'.';
        }

        return null;
    }

    public function calculateDiscount(float $subtotal): float
    {
        if ($this->discount_type === 'percentage') {
            return round($subtotal * ((float) $this->discount_value / 100), 2);
        }

        return min((float) $this->discount_value, $subtotal);
    }
}
