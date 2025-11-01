<?php

require_once 'vendor/autoload.php';

use App\Models\Doctor;
use App\Models\Patient;
use App\Models\Appointment;

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "Creating appointments for test doctor...\n\n";

try {
    // Get the test doctor
    $doctor = Doctor::where('email', 'test@example.com')->first();
    if (!$doctor) {
        echo "❌ Test doctor not found.\n";
        exit(1);
    }

    // Get or create patients
    $patients = Patient::take(3)->get();
    if ($patients->count() < 3) {
        echo "Not enough patients, using existing ones...\n";
    }

    echo "✓ Using doctor: {$doctor->name} (ID: {$doctor->doctor_id})\n";

    // Create today's appointments for this doctor
    $today = now()->format('Y-m-d');
    $times = ['10:00', '13:30', '16:00'];
    $reasons = ['Routine checkup', 'Blood pressure monitoring', 'Diabetes consultation'];

    // Clear existing appointments for today for this doctor
    Appointment::where('doctor_id', $doctor->doctor_id)
              ->whereDate('appointment_date', $today)
              ->delete();

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

    echo "\n🎉 Test doctor appointments created successfully!\n";
    echo "Now test the API again to see the appointments.\n";

} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}