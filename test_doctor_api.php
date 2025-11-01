<?php

// Test script to check doctor API endpoints
require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Doctor;
use App\Models\Appointment;

try {
    // Get first doctor
    $doctor = Doctor::first();
    if (!$doctor) {
        echo "No doctors found in database\n";
        exit;
    }
    
    echo "Testing with doctor: {$doctor->name} (ID: {$doctor->doctor_id})\n";
    
    // Check appointments for this doctor
    $appointments = Appointment::where('doctor', $doctor->name)->get();
    echo "Found {$appointments->count()} appointments for this doctor\n";
    
    if ($appointments->count() > 0) {
        echo "Sample appointments:\n";
        foreach ($appointments->take(3) as $appointment) {
            echo "- {$appointment->name} on {$appointment->appointment_date} at {$appointment->appointment_time} (Status: {$appointment->status})\n";
        }
    }
    
    // Check today's appointments
    $today = date('Y-m-d');
    $todayAppointments = Appointment::where('doctor', $doctor->name)
        ->whereDate('appointment_date', $today)
        ->get();
    
    echo "\nToday's appointments ({$today}): {$todayAppointments->count()}\n";
    
    if ($todayAppointments->count() == 0) {
        echo "Creating a test appointment for today...\n";
        Appointment::create([
            'name' => 'Test Patient',
            'email' => 'test@example.com',
            'phone' => '1234567890',
            'gender' => 'male',
            'appointment_date' => $today,
            'appointment_time' => '15:00:00',
            'doctor' => $doctor->name,
            'consultation_type' => 'consultation',
            'reason' => 'Test appointment for today',
            'status' => 'pending'
        ]);
        echo "Created test appointment for today\n";
    }
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}