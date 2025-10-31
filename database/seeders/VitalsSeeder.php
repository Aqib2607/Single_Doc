<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Vital;
use App\Models\Patient;
use Carbon\Carbon;

class VitalsSeeder extends Seeder
{
    public function run(): void
    {
        $patients = Patient::all();
        
        $vitalTypes = [
            ['type' => 'blood_pressure_systolic', 'unit' => 'mmHg', 'min' => 110, 'max' => 150],
            ['type' => 'blood_pressure_diastolic', 'unit' => 'mmHg', 'min' => 70, 'max' => 95],
            ['type' => 'heart_rate', 'unit' => 'bpm', 'min' => 60, 'max' => 100],
            ['type' => 'temperature', 'unit' => '°F', 'min' => 97.0, 'max' => 99.5],
            ['type' => 'respiratory_rate', 'unit' => '/min', 'min' => 12, 'max' => 20],
            ['type' => 'oxygen_saturation', 'unit' => '%', 'min' => 95, 'max' => 100]
        ];

        foreach ($patients as $patient) {
            // Generate vitals for the last 30 days
            for ($i = 0; $i < 30; $i++) {
                $date = Carbon::now()->subDays($i);
                
                foreach ($vitalTypes as $vitalType) {
                    // Skip some readings to make it more realistic
                    if (rand(1, 3) === 1) continue;
                    
                    $value = round(rand($vitalType['min'] * 100, $vitalType['max'] * 100) / 100, 2);
                    
                    Vital::create([
                        'patient_id' => $patient->patient_id,
                        'vital_type' => $vitalType['type'],
                        'value' => $value,
                        'unit' => $vitalType['unit'],
                        'recorded_at' => $date->addHours(rand(8, 18))->addMinutes(rand(0, 59)),
                        'recorded_by' => rand(1, 2) === 1 ? 'Dr. Smith' : 'Nurse Johnson',
                        'notes' => rand(1, 4) === 1 ? 'Patient feeling well' : null
                    ]);
                }
            }
        }
    }
}