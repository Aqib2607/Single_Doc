<?php

namespace Database\Factories;

use App\Models\Appointment;
use App\Models\Doctor;
use App\Models\Patient;
use Illuminate\Database\Eloquent\Factories\Factory;

class AppointmentFactory extends Factory
{
    protected $model = Appointment::class;

    public function definition(): array
    {
        return [
            'patient_id' => Patient::factory(),
            'name' => $this->faker->name(),
            'email' => $this->faker->safeEmail(),
            'phone' => $this->faker->phoneNumber(),
            'gender' => $this->faker->randomElement(['male', 'female', 'other']),
            'appointment_date' => $this->faker->dateTimeBetween('+1 day', '+30 days'),
            'appointment_time' => $this->faker->time('H:i'),
            'doctor' => $this->faker->name(),
            'doctor_id' => Doctor::factory(),
            'consultation_type' => $this->faker->randomElement(['in-person', 'telemedicine', 'consultation']),
            'reason' => $this->faker->sentence(),
            'medical_notes' => $this->faker->optional()->paragraph(),
            'terms_accepted' => true,
            'status' => $this->faker->randomElement(['pending', 'confirmed', 'cancelled'])
        ];
    }
}