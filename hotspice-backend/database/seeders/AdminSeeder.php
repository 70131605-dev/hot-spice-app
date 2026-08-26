<?php

namespace Database\Seeders;

use App\Models\Admin;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Admin::firstOrCreate(
            ['email' => 'faizanabdulsalam112@gmail.com'],
            [
                'name' => 'Faizan',
                'password' => Hash::make('faizan12admin'),
                'role' => 'owner',
            ]
        );
    }
}
