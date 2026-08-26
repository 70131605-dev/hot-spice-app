<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Pizza', 'slug' => 'pizza', 'icon' => '🍕', 'sort_order' => 1],
            ['name' => 'Burger', 'slug' => 'burger', 'icon' => '🍔', 'sort_order' => 2],
            ['name' => 'BBQ', 'slug' => 'bbq', 'icon' => '🍖', 'sort_order' => 3],
            ['name' => 'Chinese', 'slug' => 'chinese', 'icon' => '🥢', 'sort_order' => 4],
            ['name' => 'Steak', 'slug' => 'steak', 'icon' => '🥩', 'sort_order' => 5],
            ['name' => 'Fast Food', 'slug' => 'fast-food', 'icon' => '🍟', 'sort_order' => 6],
            ['name' => 'Desserts', 'slug' => 'desserts', 'icon' => '🍰', 'sort_order' => 7],
            ['name' => 'Drinks', 'slug' => 'drinks', 'icon' => '🥤', 'sort_order' => 8],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
