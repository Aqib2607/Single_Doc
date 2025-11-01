<?php

require_once 'vendor/autoload.php';

use App\Models\Doctor;
use App\Models\Patient;
use App\Models\Appointment;

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "Creating today's appointments for testing...\n\n";

try {
    // Get a doctor
    $doctor = Doctor::first();
    if (!$doctor) {
        echo "❌ No doctors found. Please create a doctor first.\n";
        exit(1);
    }

    // Get or create patients
    $patients = Patient::take(3)->get();
    if ($patients->count() < 3) {
        echo "Creating test patients...\n";
        for ($i = $patients->count(); $i < 3; $i++) {
            $patient = Patient::create([
                'name' => "Test Patient " . ($i + 1),
                'email' => "testpatient" . ($i + 1) . time() . "@example.com",
                'password' => bcrypt('password'),
                'phone' => '+123456789' . $i,
                'gender' => 'male',
                'date_of_birth' => '1990-01-01',
                'address' => '123 Test Street',
                'emergency_contact_name' => 'Emergency Contact',
                'emergency_contact_phone' => '+1111111111'
            ]);
            $patients->push($patient);
        }
    }

    echo "✓ Using doctor: {$doctor->name} (ID: {$doctor->doctor_id})\n";

    // Create today's appointments
    $today = now()->format('Y-m-d');
    $times = ['09:00', '11:00', '14:30'];
    $reasons = ['Regular checkup', 'Follow-up consultation', 'Health screening'];

    foreach ($patients->take(3) as $index => $patient) {
        $appointment = Appointment::create([
            'patient_id' => $patient->patient_id,
            'name' => $patient->name,
            'email' => $patient->email,
            'phone' => $patient->phone,
            'gender' => $patient->gender,
            'appointment_date' => $today,
            'appointment_time' => $times[$index],
            'doctor' => $doctor->name,
            'doctor_id' => $doctor->doctor_id,
            'consultation_type' => 'in-person',
            'reason' => $reasons[$index],
            'terms_accepted' => true,
            'status' => 'confirmed'
        ]);

        echo "✓ Created appointment: {$patient->name} at {$times[$index]} - {$reasons[$index]}\n";
    }

    echo "\n🎉 Today's appointments created successfully!\n";
    echo "Doctor can now see these appointments in the dashboard.\n";

} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    echo "File: " . $e->getFile() . " Line: " . $e->getLine() . "\n";
}