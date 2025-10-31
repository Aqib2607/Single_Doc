<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Patient;
use App\Models\User;

class PatientSeeder extends Seeder
{
    public function run(): void
    {
        $patientUsers = User::where('role', 'patient')->get();
        
        foreach ($patientUsers as $user) {
            if (!Patient::where('user_id', $user->id)->exists()) {
                Patient::create([
                    'user_id' => $user->id,
                    'date_of_birth' => fake()->dateTimeBetween('-80 years', '-18 years')->format('Y-m-d'),
                    'gender' => fake()->randomElement(['male', 'female', 'other']),
                    'phone' => fake()->phoneNumber(),
                    'address' => fake()->address(),
                    'emergency_contact_name' => fake()->name(),
                    'emergency_contact_phone' => fake()->phoneNumber(),
                    'medical_history' => fake()->optional()->sentence(),
                    'allergies' => fake()->optional()->words(3, true),
                ]);
            }
        }
    }
}