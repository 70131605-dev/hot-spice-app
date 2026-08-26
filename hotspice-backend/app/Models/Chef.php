<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'name', 'role', 'bio', 'specialty', 'experience',
    'image', 'instagram', 'signature', 'sort_order', 'is_active',
])]
class Chef extends Model
{
    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }
}
