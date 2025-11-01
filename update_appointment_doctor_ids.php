<?php

require_once 'vendor/autoload.php';

use App\Models\Doctor;
use App\Models\Appointment;

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "Updating appointment doctor_id fields...\n\n";

try {
    // Get all appointments without doctor_id
    $appointments = Appointment::whereNull('doctor_id')->get();
    echo "Found {$appointments->count()} appointments without doctor_id\n";

    foreach ($appointments as $appointment) {
        // Try to find doctor by name
        $doctor = Doctor::where('name', $appointment->doctor)->first();
        
        if ($doctor) {
            $appointment->update(['doctor_id' => $doctor->doctor_id]);
            echo "✓ Updated appointment {$appointment->id} with doctor_id {$doctor->doctor_id} ({$doctor->name})\n";
        } else {
            echo "⚠ No doctor found for appointment {$appointment->id} with doctor name: {$appointment->doctor}\n";
        }
    }

    echo "\n✅ Doctor ID update completed!\n";

} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}