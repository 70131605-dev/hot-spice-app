<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DemoUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@hotandspice.pk'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('HotSpice#2026Admin'),
                'phone' => '+1 555-0100',
                'status' => 'active',
                'role' => 'admin',
            ]
        );

        User::updateOrCreate(
            ['email' => 'john@example.com'],
            [
                'name' => 'John Doe',
                'password' => Hash::make('anypassword6+'),
                'phone' => '+1 555-0101',
                'status' => 'active',
                'role' => 'user',
            ]
        );
    }
}
