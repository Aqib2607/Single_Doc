<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Create a doctor if not exists
        if (!User::where('email', 'doctor@example.com')->exists()) {
            User::create([
                'name' => 'Dr. John Smith',
                'email' => 'doctor@example.com',
                'password' => Hash::make('password'),
                'role' => 'doctor',
            ]);
        }

        // Create patients (check existing and create new ones)
        for ($i = 1; $i <= 23; $i++) {
            $email = "patient$i@example.com";
            if (!User::where('email', $email)->exists()) {
                User::create([
                    'name' => "Patient $i",
                    'email' => $email,
                    'password' => Hash::make('password'),
                    'role' => 'patient',
                ]);
            }
        }

        $this->command->info('Users seeded successfully!');
    }
}