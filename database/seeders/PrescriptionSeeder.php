<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Prescription;

class PrescriptionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $prescriptions = [
            [
                'patient_email' => 'aqibjawwad2607@gmail.com',
                'medication_name' => 'Aspirin',
                'dosage' => '100mg',
                'frequency' => 'Once daily with food',
                'instructions' => 'Take after breakfast to reduce stomach irritation',
                'start_date' => '2025-10-01',
                'end_date' => '2025-12-01',
                'is_active' => true,
                'refills_remaining' => 2,
            ],
            [
                'patient_email' => 'aqibjawwad2607@gmail.com',
                'medication_name' => 'Vitamin D3',
                'dosage' => '1000IU',
                'frequency' => 'Once daily in morning',
                'instructions' => 'Take with a meal for better absorption',
                'start_date' => '2025-09-15',
                'end_date' => null,
                'is_active' => true,
                'refills_remaining' => 3,
            ],
            [
                'patient_email' => 'aqibjawwad2607@gmail.com',
                'medication_name' => 'Metformin',
                'dosage' => '500mg',
                'frequency' => 'Twice daily',
                'instructions' => 'Take with meals to reduce side effects',
                'start_date' => '2025-08-01',
                'end_date' => '2026-08-01',
                'is_active' => true,
                'refills_remaining' => 5,
            ],
            [
                'patient_email' => 'aqibjawwad2607@gmail.com',
                'medication_name' => 'Lisinopril',
                'dosage' => '10mg',
                'frequency' => 'Once daily',
                'instructions' => 'Take at the same time each day, preferably in the morning',
                'start_date' => '2025-07-15',
                'end_date' => null,
                'is_active' => true,
                'refills_remaining' => 4,
            ],
            [
                'patient_email' => 'aqibjawwad2607@gmail.com',
                'medication_name' => 'Omega-3',
                'dosage' => '1000mg',
                'frequency' => 'Once daily with dinner',
                'instructions' => 'Take with food to improve absorption and reduce fishy aftertaste',
                'start_date' => '2025-06-01',
                'end_date' => null,
                'is_active' => true,
                'refills_remaining' => 6,
            ],
        ];

        foreach ($prescriptions as $prescription) {
            Prescription::create($prescription);
        }

        $this->command->info('5 prescriptions seeded successfully!');
    }
}
