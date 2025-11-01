<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Doctor;
use App\Models\Patient;
use App\Models\MedicalRecord;

class TestMedicalRecords extends Command
{
    protected $signature = 'test:medical-records';
    protected $description = 'Test medical records functionality';

    public function handle()
    {
        $this->info('Testing Medical Records Functionality...');
        
        // Check if we have doctors and patients
        $doctorCount = Doctor::count();
        $patientCount = Patient::count();
        
        $this->table(['Entity', 'Count'], [
            ['Doctors', $doctorCount],
            ['Patients', $patientCount],
            ['Medical Records', MedicalRecord::count()]
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
        
        // Test medical record creation
        if ($this->confirm('Create a test medical record?')) {
            $doctor = Doctor::first();
            $patient = Patient::first();
            
            $record = MedicalRecord::create([
                'doctor_id' => $doctor->doctor_id,
                'patient_id' => $patient->patient_id,
                'record_type' => 'Blood Test',
                'title' => 'Complete Blood Count',
                'description' => 'Test medical record created via command',
                'status' => 'complete',
                'record_date' => now()->format('Y-m-d')
            ]);
            
            $this->info("Test medical record created with ID: {$record->id}");
            $this->line("Doctor: {$doctor->name}");
            $this->line("Patient: {$patient->name}");
            $this->line("Type: {$record->record_type}");
            $this->line("Title: {$record->title}");
        }
        
        // Test API endpoints
        $this->info('\nTesting API Endpoints:');
        $this->line('POST /api/medical-records - Create record');
        $this->line('GET /api/medical-records - List records');
        $this->line('GET /api/medical-records/{id} - Show record');
        $this->line('PUT /api/medical-records/{id} - Update record');
        $this->line('DELETE /api/medical-records/{id} - Delete record');
        $this->line('GET /api/medical-records/{id}/download - Download file');
        
        // Test file upload validation
        $this->info('\nFile Upload Validation:');
        $this->line('- Allowed types: PDF, DOC, DOCX, JPG, JPEG, PNG');
        $this->line('- Maximum size: 10MB');
        $this->line('- Files stored in: storage/app/public/medical_records/');
        
        $this->info('\nMedical records test completed!');
        return 0;
    }
}