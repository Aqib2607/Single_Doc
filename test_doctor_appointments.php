<?php

require_once 'vendor/autoload.php';

use App\Models\Doctor;
use App\Models\Patient;
use App\Models\Appointment;

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "Testing Doctor Appointments Endpoint...\n\n";

try {
    // Create test doctor
    $doctor = Doctor::create([
        'name' => 'Dr. Test Appointments',
        'email' => 'appointments' . time() . '@test.com',
        'password' => bcrypt('password'),
        'specialization' => 'Internal Medicine',
        'license_number' => 'APPT-12345',
        'phone' => '+1234567890',
        'consultation_fee' => 150.00
    ]);
    echo "✓ Test doctor created with ID: {$doctor->doctor_id}\n";

    // Create test patient
    $patient = Patient::create([
        'name' => 'Test Patient',
        'email' => 'patient' . time() . '@test.com',
        'password' => bcrypt('password'),
        'phone' => '+9876543210',
        'gender' => 'male',
        'date_of_birth' => '1990-01-01',
        'address' => '123 Test Street',
        'emergency_contact_name' => 'Emergency Contact',
        'emergency_contact_phone' => '+1111111111'
    ]);
    echo "✓ Test patient created with ID: {$patient->patient_id}\n";

    // Create test appointments
    $appointments = [];
    for ($i = 1; $i <= 3; $i++) {
        $appointment = Appointment::create([
            'patient_id' => $patient->patient_id,
            'name' => $patient->name,
            'email' => $patient->email,
            'phone' => $patient->phone,
            'gender' => $patient->gender,
            'appointment_date' => now()->addDays($i),
            'appointment_time' => '10:00',
            'doctor' => $doctor->name,
            'doctor_id' => $doctor->doctor_id,
            'consultation_type' => 'in-person',
            'reason' => "Test appointment reason $i",
            'medical_notes' => "Test medical notes for appointment $i",
            'terms_accepted' => true,
            'status' => 'confirmed'
        ]);
        $appointments[] = $appointment;
        echo "✓ Appointment $i created with ID: {$appointment->id}\n";
    }

    // Test the endpoint logic
    echo "\n2. Testing appointment retrieval...\n";
    $doctorAppointments = Appointment::with(['patient'])
        ->where('doctor_id', $doctor->doctor_id)
        ->orderBy('appointment_date', 'desc')
        ->orderBy('appointment_time', 'desc')
        ->get()
        ->map(function ($appointment) {
            return [
                'appointment_id' => $appointment->id,
                'patient_info' => [
                    'name' => $appointment->name,
                    'email' => $appointment->email,
                    'phone' => $appointment->phone,
                    'gender' => $appointment->gender
                ],
                'date_time' => [
                    'date' => $appointment->appointment_date->format('Y-m-d'),
                    'time' => $appointment->appointment_time->format('H:i'),
                    'formatted' => $appointment->appointment_date->format('M d, Y') . ' at ' . $appointment->appointment_time->format('g:i A')
                ],
                'status' => $appointment->status,
                'consultation_type' => $appointment->consultation_type,
                'reason' => $appointment->reason,
                'medical_notes' => $appointment->medical_notes
            ];
        });

    echo "✓ Found {$doctorAppointments->count()} appointments for doctor\n";
    
    foreach ($doctorAppointments as $index => $apt) {
        echo "  - Appointment " . ($index + 1) . ": {$apt['patient_info']['name']} on {$apt['date_time']['formatted']}\n";
        echo "    Status: {$apt['status']}, Type: {$apt['consultation_type']}\n";
        echo "    Reason: {$apt['reason']}\n";
        echo "    Notes: {$apt['medical_notes']}\n\n";
    }

    echo "🎉 Doctor appointments endpoint test completed successfully!\n";
    echo "\nEndpoint URL: http://127.0.0.1:8000/api/doctor/appointments\n";
    echo "Method: GET\n";
    echo "Authentication: Required (Bearer token for doctor)\n";

} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    echo "File: " . $e->getFile() . " Line: " . $e->getLine() . "\n";
}