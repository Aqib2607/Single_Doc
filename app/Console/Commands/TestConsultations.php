<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Doctor;
use App\Models\Patient;
use App\Models\Consultation;

class TestConsultations extends Command
{
    protected $signature = 'test:consultations';
    protected $description = 'Test consultation functionality';

    public function handle()
    {
        $this->info('Testing Consultation Functionality...');
        
        // Check if we have doctors and patients
        $doctorCount = Doctor::count();
        $patientCount = Patient::count();
        
        $this->table(['Entity', 'Count'], [
            ['Doctors', $doctorCount],
            ['Patients', $patientCount],
            ['Consultations', Consultation::count()]
        ]);
        
        if ($doctorCount === 0) {
            $this->error('No doctors found. Please create a doctor first.');
            return 1;
        }
        
        if ($patientCount === 0) {
            $this->error('No patients found. Please create a patient first.');
            return 1;
        }
        
        // Show sample data
        $this->info('Sample Doctors:');
        Doctor::take(3)->get()->each(function($doctor) {
            $this->line("- ID: {$doctor->doctor_id}, Name: {$doctor->name}");
        });
        
        $this->info('Sample Patients:');
        Patient::take(3)->get()->each(function($patient) {
            $this->line("- ID: {$patient->patient_id}, Name: {$patient->name}");
        });
        
        // Test consultation creation
        if ($this->confirm('Create a test consultation?')) {
            $doctor = Doctor::first();
            $patient = Patient::first();
            
            $consultation = Consultation::create([
                'doctor_id' => $doctor->doctor_id,
                'patient_id' => $patient->patient_id,
                'consultation_date' => now()->format('Y-m-d'),
                'diagnosis' => 'Test diagnosis - Common cold',
                'treatment' => 'Rest and fluids',
                'notes' => 'Test consultation created via command',
                'follow_up_date' => now()->addDays(7)->format('Y-m-d')
            ]);
            
            $this->info("Test consultation created with ID: {$consultation->id}");
            $this->line("Doctor: {$doctor->name}");
            $this->line("Patient: {$patient->name}");
            $this->line("Diagnosis: {$consultation->diagnosis}");
        }
        
        $this->info('Consultation test completed!');
        return 0;
    }
}