<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\MedicalRecord;

class MedicalRecordSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $records = [
            [
                'patient_email' => 'aqibjawwad2607@gmail.com',
                'record_type' => 'Blood Test',
                'title' => 'Complete Blood Count (CBC)',
                'description' => 'Routine blood work showing normal values across all parameters',
                'status' => 'complete',
                'record_date' => '2025-10-25',
            ],
            [
                'patient_email' => 'aqibjawwad2607@gmail.com',
                'record_type' => 'X-Ray',
                'title' => 'Chest X-Ray',
                'description' => 'Clear chest X-ray with no abnormalities detected',
                'status' => 'reviewed',
                'record_date' => '2025-10-20',
            ],
            [
                'patient_email' => 'aqibjawwad2607@gmail.com',
                'record_type' => 'Consultation',
                'title' => 'Annual Physical Examination',
                'description' => 'Comprehensive physical exam with vital signs and health assessment',
                'status' => 'complete',
                'record_date' => '2025-10-15',
            ],
            [
                'patient_email' => 'aqibjawwad2607@gmail.com',
                'record_type' => 'Lab Test',
                'title' => 'Lipid Panel',
                'description' => 'Cholesterol and triglyceride levels within normal range',
                'status' => 'reviewed',
                'record_date' => '2025-10-10',
            ],
            [
                'patient_email' => 'aqibjawwad2607@gmail.com',
                'record_type' => 'Vaccination',
                'title' => 'Annual Flu Shot',
                'description' => 'Seasonal influenza vaccination administered',
                'status' => 'complete',
                'record_date' => '2025-10-05',
            ],
        ];

        foreach ($records as $record) {
            MedicalRecord::create($record);
        }

        $this->command->info('5 medical records seeded successfully!');
    }
}
