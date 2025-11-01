<?php

// Simple script to create test appointments
require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Appointment;
use App\Models\Doctor;

try {
    // Check if we have doctors
    $doctors = Doctor::all();
    echo "Found " . $doctors->count() . " doctors\n";
    
    if ($doctors->count() == 0) {
        echo "No doctors found. Please create a doctor first.\n";
        exit;
    }
    
    // Check existing appointments
    $appointments = Appointment::all();
    echo "Found " . $appointments->count() . " existing appointments\n";
    
    // Get first doctor
    $doctor = $doctors->first();
    echo "Using doctor: " . $doctor->name . " (ID: " . $doctor->doctor_id . ")\n";
    
    // Create test appointments if none exist
    if ($appointments->count() == 0) {
        echo "Creating test appointments...\n";
        
        $testAppointments = [
            [
                'name' => 'John Doe',
                'email' => 'john@example.com',
                'phone' => '1234567890',
                'gender' => 'male',
                'appointment_date' => date('Y-m-d'),
                'appointment_time' => '10:00:00',
                'doctor' => $doctor->name,
                'consultation_type' => 'consultation',
                'reason' => 'Regular checkup',
                'status' => 'pending'
            ],
            [
                'name' => 'Jane Smith',
                'email' => 'jane@example.com',
                'phone' => '0987654321',
                'gender' => 'female',
                'appointment_date' => date('Y-m-d'),
                'appointment_time' => '14:00:00',
                'doctor' => $doctor->name,
                'consultation_type' => 'follow-up',
                'reason' => 'Follow-up visit',
                'status' => 'confirmed'
            ],
            [
                'name' => 'Bob Wilson',
                'email' => 'bob@example.com',
                'phone' => '5555555555',
                'gender' => 'male',
                'appointment_date' => date('Y-m-d', strtotime('+1 day')),
                'appointment_time' => '09:00:00',
                'doctor' => $doctor->name,
                'consultation_type' => 'consultation',
                'reason' => 'Health screening',
                'status' => 'pending'
            ]
        ];
        
        foreach ($testAppointments as $appointmentData) {
            Appointment::create($appointmentData);
            echo "Created appointment for: " . $appointmentData['name'] . "\n";
        }
        
        echo "Successfully created " . count($testAppointments) . " test appointments\n";
    } else {
        echo "Appointments already exist. Showing sample:\n";
        foreach ($appointments->take(3) as $appointment) {
            echo "- {$appointment->name} with {$appointment->doctor} on {$appointment->appointment_date} at {$appointment->appointment_time}\n";
        }
    }
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    echo "Stack trace: " . $e->getTraceAsString() . "\n";
}