<?php

namespace Database\Factories;

use App\Models\Doctor;
use App\Models\Patient;
use App\Models\Prescription;
use Illuminate\Database\Eloquent\Factories\Factory;

class PrescriptionFactory extends Factory
{
    protected $model = Prescription::class;

    public function definition(): array
    {
        return [
            'doctor_id' => Doctor::factory(),
            'patient_id' => Patient::factory(),
            'patient_email' => $this->faker->email(),
            'medication_name' => $this->faker->randomElement([
                'Aspirin', 'Ibuprofen', 'Acetaminophen', 'Lisinopril', 
                'Metformin', 'Atorvastatin', 'Omeprazole', 'Levothyroxine'
            ]),
            'dosage' => $this->faker->randomElement(['100mg', '200mg', '500mg', '10mg', '20mg']),
            'frequency' => $this->faker->randomElement([
                'Once daily', 'Twice daily', 'Three times daily', 'As needed'
            ]),
            'instructions' => $this->faker->optional()->sentence(),
            'start_date' => $this->faker->dateTimeBetween('-1 month', 'now'),
            'end_date' => $this->faker->optional()->dateTimeBetween('now', '+3 months'),
            'is_active' => $this->faker->boolean(80),
            'refills_remaining' => $this->faker->numberBetween(0, 5),
        ];
    }

    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => true,
        ]);
    }

    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }
}