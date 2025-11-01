<?php

require_once 'vendor/autoload.php';

use App\Models\Patient;
use App\Models\Doctor;

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "Testing Patient Booking Directly...\n\n";

try {
    // Get first patient and doctor
    $patient = Patient::first();
    $doctor = Doctor::first();
    
    if (!$patient || !$doctor) {
        echo "❌ Missing patient or doctor data\n";
        exit(1);
    }
    
    echo "✓ Using Patient: {$patient->name} (ID: {$patient->patient_id})\n";
    echo "✓ Using Doctor: {$doctor->name} (ID: {$doctor->doctor_id})\n\n";
    
    // Test the booking controller logic directly
    $request = new \Illuminate\Http\Request();
    $request->merge([
        'date' => now()->addDay()->format('Y-m-d'),
        'time' => '10:00',
        'doctor_id' => $doctor->doctor_id,
        'consultationType' => 'in-person',
        'reason' => 'Test appointment',
        'termsAccepted' => true
    ]);
    
    // Mock authenticated user
    $request->setUserResolver(function () use ($patient) {
        return $patient;
    });
    
    $controller = new \App\Http\Controllers\Api\BookingController();
    $response = $controller->book($request);
    
    $responseData = json_decode($response->getContent(), true);
    
    echo "Response Status: " . $response->getStatusCode() . "\n";
    echo "Response Data: " . json_encode($responseData, JSON_PRETTY_PRINT) . "\n\n";
    
    if ($response->getStatusCode() === 201 && $responseData['success']) {
        echo "✅ Patient booking successful!\n";
        echo "   Type: " . $responseData['type'] . "\n";
        echo "   Appointment ID: " . $responseData['appointment']['id'] . "\n";
    } else {
        echo "❌ Patient booking failed\n";
        if (isset($responseData['errors'])) {
            echo "   Errors: " . implode(', ', array_keys($responseData['errors'])) . "\n";
        }
    }
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    echo "File: " . $e->getFile() . " Line: " . $e->getLine() . "\n";
}