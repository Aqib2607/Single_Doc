<?php

require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Prescription;
use App\Models\Doctor;
use App\Models\Patient;

echo "=== Prescription Debug Script ===\n\n";

// Check total prescriptions in database
$totalPrescriptions = Prescription::count();
echo "Total prescriptions in database: {$totalPrescriptions}\n\n";

// Show all prescriptions
if ($totalPrescriptions > 0) {
    echo "All prescriptions:\n";
    $prescriptions = Prescription::with(['patient', 'doctor'])->get();
    foreach ($prescriptions as $prescription) {
        echo "ID: {$prescription->id}, Doctor ID: {$prescription->doctor_id}, Patient ID: {$prescription->patient_id}, Medication: {$prescription->medication_name}\n";
    }
    echo "\n";
}

// Check if doctors can authenticate
echo "Testing doctor authentication:\n";
$firstDoctor = Doctor::first();
if ($firstDoctor) {
    echo "First doctor: ID {$firstDoctor->doctor_id}, Email: {$firstDoctor->email}\n";
    // Check prescriptions for this doctor
    $doctorPrescriptions = Prescription::where('doctor_id', $firstDoctor->doctor_id)->count();
    echo "Prescriptions for this doctor: {$doctorPrescriptions}\n";
}
echo "\n";

// Check doctors
echo "All doctors:\n";
$doctors = Doctor::all();
foreach ($doctors as $doctor) {
    echo "Doctor ID: {$doctor->doctor_id}, Name: {$doctor->name}, User ID: {$doctor->user_id}\n";
}
echo "\n";

// Check patients
echo "All patients:\n";
$patients = Patient::all();
foreach ($patients as $patient) {
    echo "Patient ID: {$patient->patient_id}, Name: {$patient->name}\n";
}
echo "\n";

echo "=== Debug Complete ===\n";