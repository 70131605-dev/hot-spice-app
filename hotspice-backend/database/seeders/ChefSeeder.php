<?php

namespace Database\Seeders;

use App\Models\Chef;
use Illuminate\Database\Seeder;

class ChefSeeder extends Seeder
{
    public function run(): void
    {
        $chefs = [
            [
                'name' => 'Marco Rossetti',
                'role' => 'Executive Chef & Owner',
                'bio' => 'Born in Naples and trained at Le Cordon Bleu Paris, Chef Marco spent a decade working alongside three-Michelin-star chefs across Europe before bringing his vision of elevated Italian-American cuisine to Hot & Spice. His philosophy is simple: the finest ingredients, treated with respect.',
                'specialty' => 'Italian Fine Dining, Wood-Fired Techniques',
                'experience' => 22,
                'image' => 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=500&h=600&fit=crop&auto=format&q=80',
                'instagram' => '@chefmarcorossetti',
                'signature' => 'Dry-Aged Ribeye with Black Truffle Butter',
                'sort_order' => 1,
            ],
            [
                'name' => 'Amara Chen',
                'role' => 'Head Chef — Asian Kitchen',
                'bio' => 'Chef Amara grew up in Hong Kong watching her grandmother perfect dim sum. After culinary school in Singapore and stints in Shanghai and Tokyo, she joined Hot & Spice to lead our Asian kitchen. Her Peking Duck has been featured in three national food magazines.',
                'specialty' => 'Pan-Asian Cuisine, Dim Sum, Wok Mastery',
                'experience' => 15,
                'image' => 'https://images.unsplash.com/photo-1595257851868-a14ed76f70e5?w=500&h=600&fit=crop&auto=format&q=80',
                'instagram' => '@chefamarachen',
                'signature' => 'Traditional Peking Duck with House Hoisin',
                'sort_order' => 2,
            ],
            [
                'name' => 'James "Smoke" Walker',
                'role' => 'Pit Master & BBQ Chef',
                'bio' => "A Texas native with BBQ in his DNA, James honed his craft at legendary roadside joints across the South before taking the art fine-dining serious. His 16-hour smoked ribs have a cult following, and his brisket technique was featured on America's Best BBQ documentary.",
                'specialty' => 'Low & Slow Smoking, American BBQ, Meat Curing',
                'experience' => 18,
                'image' => 'https://images.unsplash.com/photo-1550966871-3ed6593773e5?w=500&h=600&fit=crop&auto=format&q=80',
                'instagram' => '@pitmaster_walker',
                'signature' => 'Cherry-Glazed Baby Back Ribs',
                'sort_order' => 3,
            ],
            [
                'name' => 'Sophie Laurent',
                'role' => 'Executive Pastry Chef',
                'bio' => 'A graduate of École Nationale Supérieure de la Pâtisserie in Paris, Chef Sophie worked at two-star Michelin patisseries in Lyon before joining us. Every dessert is an act of precision and creativity — her Chocolate Lava Cake has never once come back to the kitchen.',
                'specialty' => 'French Patisserie, Chocolate Work, Sugar Art',
                'experience' => 12,
                'image' => 'https://images.unsplash.com/photo-1581299894007-8daa4e8c57bd?w=500&h=600&fit=crop&auto=format&q=80',
                'instagram' => '@chefsofielaurent',
                'signature' => 'Valrhona Chocolate Lava Cake',
                'sort_order' => 4,
            ],
        ];

        foreach ($chefs as $chef) {
            Chef::updateOrCreate(['name' => $chef['name']], $chef);
        }
    }
}
