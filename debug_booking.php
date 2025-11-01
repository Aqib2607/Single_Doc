<?php

require_once 'vendor/autoload.php';

use App\Models\Patient;

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "Debugging Patient Authentication...\n\n";

// Check if patient exists
$patient = Patient::where('email', 'john.smith@email.com')->first();

if ($patient) {
    echo "✓ Patient found:\n";
    echo "  ID: {$patient->patient_id}\n";
    echo "  Name: {$patient->name}\n";
    echo "  Email: {$patient->email}\n";
    echo "  Has patient_id property: " . (property_exists($patient, 'patient_id') ? 'Yes' : 'No') . "\n";
    echo "  patient_id value: " . ($patient->patient_id ?? 'null') . "\n\n";
} else {
    echo "❌ Patient not found with email: john.smith@email.com\n";
    echo "Available patients:\n";
    $patients = Patient::select('patient_id', 'name', 'email')->take(5)->get();
    foreach ($patients as $p) {
        echo "  ID: {$p->patient_id}, Name: {$p->name}, Email: {$p->email}\n";
    }
}