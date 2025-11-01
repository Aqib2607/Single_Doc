<?php

namespace Database\Factories;

use App\Models\Guest;
use App\Models\Doctor;
use Illuminate\Database\Eloquent\Factories\Factory;

class GuestFactory extends Factory
{
    protected $model = Guest::class;

    public function definition(): array
    {
        return [
            'full_name' => $this->faker->name(),
            'email' => $this->faker->optional()->safeEmail(),
            'phone_number' => $this->faker->phoneNumber(),
            'appointment_date' => $this->faker->dateTimeBetween('+1 day', '+30 days'),
            'doctor_id' => Doctor::factory()
        ];
    }
}