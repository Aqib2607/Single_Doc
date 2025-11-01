<?php

namespace Database\Factories;

use App\Models\Patient;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;

class PatientFactory extends Factory
{
    protected $model = Patient::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->name(),
            'email' => $this->faker->unique()->safeEmail(),
            'password' => Hash::make('password'),
            'phone' => $this->faker->phoneNumber(),
            'gender' => $this->faker->randomElement(['male', 'female', 'other', 'prefer-not-to-say']),
            'date_of_birth' => $this->faker->date(),
            'address' => $this->faker->address(),
            'emergency_contact_name' => $this->faker->name(),
            'emergency_contact_phone' => $this->faker->phoneNumber(),
            'medical_history' => $this->faker->optional()->paragraph(),
            'allergies' => $this->faker->optional()->words(3, true)
        ];
    }
}