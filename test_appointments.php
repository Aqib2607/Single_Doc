<?php

require_once 'vendor/autoload.php';

use Illuminate\Database\Capsule\Manager as Capsule;

// Database configuration
$capsule = new Capsule;
$capsule->addConnection([
    'driver' => 'mysql',
    'host' => 'localhost',
    'database' => 'healthcare_db',
    'username' => 'root',
    'password' => '',
    'charset' => 'utf8',
    'collation' => 'utf8_unicode_ci',
    'prefix' => '',
]);

$capsule->setAsGlobal();
$capsule->bootEloquent();

try {
    // Check appointments table
    $appointments = Capsule::table('appointments')->get();
    echo "Total appointments in database: " . count($appointments) . "\n";
    
    if (count($appointments) > 0) {
        echo "Sample appointments:\n";
        foreach ($appointments->take(5) as $appointment) {
            echo "ID: {$appointment->id}, Doctor: {$appointment->doctor}, Date: {$appointment->appointment_date}, Patient: {$appointment->name}\n";
        }
    }
    
    // Check doctors table
    $doctors = Capsule::table('doctors')->get();
    echo "\nTotal doctors in database: " . count($doctors) . "\n";
    
    if (count($doctors) > 0) {
        echo "Sample doctors:\n";
        foreach ($doctors->take(3) as $doctor) {
            echo "ID: {$doctor->doctor_id}, Name: {$doctor->name}\n";
        }
    }
    
    // If no appointments exist, create some test data
    if (count($appointments) == 0 && count($doctors) > 0) {
        $doctor = $doctors->first();
        echo "\nCreating test appointments for doctor: {$doctor->name}\n";
        
        // Create test appointments
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
                'status' => 'pending',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'Jane Smith',
                'email' => 'jane@example.com',
                'phone' => '0987654321',
                'gender' => 'female',
                'appointment_date' => date('Y-m-d', strtotime('+1 day')),
                'appointment_time' => '14:00:00',
                'doctor' => $doctor->name,
                'consultation_type' => 'follow-up',
                'reason' => 'Follow-up visit',
                'status' => 'confirmed',
                'created_at' => now(),
                'updated_at' => now()
            ]
        ];
        
        foreach ($testAppointments as $appointment) {
            Capsule::table('appointments')->insert($appointment);
        }
        
        echo "Created " . count($testAppointments) . " test appointments\n";
    }
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}