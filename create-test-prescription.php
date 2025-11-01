<?php

require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Prescription;
use App\Models\Doctor;
use App\Models\Patient;

echo "=== Creating Test Prescription ===\n\n";

// Get first doctor and patient
$doctor = Doctor::first();
$patient = Patient::first();

if (!$doctor) {
    echo "No doctors found!\n";
    exit;
}

if (!$patient) {
    echo "No patients found!\n";
    exit;
}

echo "Using Doctor: {$doctor->name} (ID: {$doctor->doctor_id})\n";
echo "Using Patient: {$patient->name} (ID: {$patient->patient_id})\n\n";

// Create test prescription
$prescription = Prescription::create([
    'doctor_id' => $doctor->doctor_id,
    'patient_id' => $patient->patient_id,
    'patient_email' => $patient->email,
    'medication_name' => 'Test Aspirin',
    'dosage' => '100mg',
    'frequency' => 'Once daily',
    'instructions' => 'Take with food',
    'start_date' => '2024-01-01',
    'end_date' => '2024-01-31',
    'is_active' => true,
    'refills_remaining' => 3
]);

echo "Created prescription ID: {$prescription->id}\n";
echo "Doctor ID: {$prescription->doctor_id}\n";
echo "Patient ID: {$prescription->patient_id}\n";
echo "Medication: {$prescription->medication_name}\n\n";

// Verify it was created
$count = Prescription::where('doctor_id', $doctor->doctor_id)->count();
echo "Total prescriptions for doctor {$doctor->doctor_id}: {$count}\n";

echo "\n=== Test Complete ===\n";