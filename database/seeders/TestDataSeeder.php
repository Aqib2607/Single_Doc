<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Doctor;
use App\Models\Patient;
use Illuminate\Support\Facades\Hash;

class TestDataSeeder extends Seeder
{
    public function run(): void
    {
        // Create test doctors
        Doctor::firstOrCreate(
            ['email' => 'doctor@example.com'],
            [
                'name' => 'Dr. John Smith',
                'password' => Hash::make('password'),
                'specialization' => 'General Medicine',
                'license_number' => 'MD12345',
                'bio' => 'Experienced general practitioner',
                'phone' => '+1234567890',
                'consultation_fee' => 100.00,
                'availability' => ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
            ]
        );

        Doctor::firstOrCreate(
            ['email' => 'doctor2@example.com'],
            [
                'name' => 'Dr. Sarah Johnson',
                'password' => Hash::make('password'),
                'specialization' => 'Cardiology',
                'license_number' => 'MD12346',
                'bio' => 'Heart specialist with 10 years experience',
                'phone' => '+1234567891',
                'consultation_fee' => 150.00,
                'availability' => ['Monday', 'Wednesday', 'Friday']
            ]
        );

        // Create test patients
        Patient::firstOrCreate(
            ['email' => 'patient1@example.com'],
            [
                'name' => 'Alice Brown',
                'password' => Hash::make('password'),
                'date_of_birth' => '1990-05-15',
                'gender' => 'female',
                'phone' => '+1234567892',
                'address' => '123 Main St, City, State',
                'emergency_contact_name' => 'Bob Brown',
                'emergency_contact_phone' => '+1234567893',
                'medical_history' => 'No significant medical history',
                'allergies' => 'None known'
            ]
        );

        Patient::firstOrCreate(
            ['email' => 'patient2@example.com'],
            [
                'name' => 'Michael Davis',
                'password' => Hash::make('password'),
                'date_of_birth' => '1985-08-22',
                'gender' => 'male',
                'phone' => '+1234567894',
                'address' => '456 Oak Ave, City, State',
                'emergency_contact_name' => 'Lisa Davis',
                'emergency_contact_phone' => '+1234567895',
                'medical_history' => 'Hypertension',
                'allergies' => 'Penicillin'
            ]
        );

        Patient::firstOrCreate(
            ['email' => 'patient3@example.com'],
            [
                'name' => 'Emma Wilson',
                'password' => Hash::make('password'),
                'date_of_birth' => '1992-12-03',
                'gender' => 'female',
                'phone' => '+1234567896',
                'address' => '789 Pine St, City, State',
                'emergency_contact_name' => 'James Wilson',
                'emergency_contact_phone' => '+1234567897',
                'medical_history' => 'Diabetes Type 2',
                'allergies' => 'Shellfish'
            ]
        );
    }
}