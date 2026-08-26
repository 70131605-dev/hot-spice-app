<?php

namespace App\Support;

use Illuminate\Support\Str;

class Slugger
{
    /**
     * Slugify $source and, if it collides with another row, append -2, -3, ...
     * until it's unique. Pass $ignoreId when updating a row so it doesn't
     * collide with its own current slug.
     */
    public static function unique(string $modelClass, string $source, ?int $ignoreId = null): string
    {
        $base = Str::slug($source);
        $slug = $base;
        $i = 1;

        while ($modelClass::where('slug', $slug)->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))->exists()) {
            $slug = $base.'-'.$i++;
        }

        return $slug;
    }
}
