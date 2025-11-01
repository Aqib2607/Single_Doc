<?php

namespace Database\Factories;

use App\Models\Doctor;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;

class DoctorFactory extends Factory
{
    protected $model = Doctor::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->name(),
            'email' => $this->faker->unique()->safeEmail(),
            'password' => Hash::make('password'),
            'specialization' => $this->faker->randomElement(['Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics']),
            'license_number' => $this->faker->unique()->numerify('LIC-#####'),
            'bio' => $this->faker->paragraph(),
            'phone' => $this->faker->phoneNumber(),
            'availability' => ['monday' => '9:00-17:00', 'tuesday' => '9:00-17:00'],
            'consultation_fee' => $this->faker->randomFloat(2, 50, 200)
        ];
    }
}