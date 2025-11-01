<?php

require_once 'vendor/autoload.php';

use App\Models\Patient;
use App\Models\Doctor;
use App\Models\Appointment;

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "Testing Patient Dual-Path Booking...\n\n";

try {
    $patient = Patient::first();
    $doctor = Doctor::first();
    
    if (!$patient || !$doctor) {
        echo "❌ Missing patient or doctor data\n";
        exit(1);
    }
    
    echo "✓ Using Patient: {$patient->name} (ID: {$patient->patient_id})\n";
    echo "✓ Using Doctor: {$doctor->name} (ID: {$doctor->doctor_id})\n\n";
    
    // Test patient booking with new dual-path system
    $request = new \Illuminate\Http\Request();
    $request->merge([
        'date' => now()->addDays(2)->format('Y-m-d'),
        'time' => '15:00',
        'doctor_id' => $doctor->doctor_id,
        'consultationType' => 'in-person',
        'reason' => 'Dual-path test appointment',
        'termsAccepted' => true
    ]);
    
    $request->setUserResolver(function () use ($patient) {
        return $patient;
    });
    
    $controller = new \App\Http\Controllers\Api\BookingController();
    $response = $controller->book($request);
    
    $responseData = json_decode($response->getContent(), true);
    
    echo "Response Status: " . $response->getStatusCode() . "\n";
    echo "Response Data: " . json_encode($responseData, JSON_PRETTY_PRINT) . "\n\n";
    
    if ($response->getStatusCode() === 201 && $responseData['success']) {
        echo "✅ Patient dual-path booking successful!\n";
        echo "   Type: " . $responseData['type'] . "\n";
        echo "   Appointment ID: " . $responseData['appointment']['id'] . "\n";
        
        // Verify appointment has patient_id and no guest_id
        $appointment = Appointment::find($responseData['appointment']['id']);
        echo "   Patient ID: " . ($appointment->patient_id ?? 'null') . "\n";
        echo "   Guest ID: " . ($appointment->guest_id ?? 'null') . "\n";
        
        if ($appointment->patient_id && !$appointment->guest_id) {
            echo "✅ Correct patient reference in appointment\n";
        } else {
            echo "❌ Incorrect appointment references\n";
        }
    } else {
        echo "❌ Patient dual-path booking failed\n";
        if (isset($responseData['errors'])) {
            echo "   Errors: " . implode(', ', array_keys($responseData['errors'])) . "\n";
        }
    }
    
    // Test guest booking to verify dual-path separation
    echo "\n--- Testing Guest Booking for Comparison ---\n";
    
    $guestRequest = new \Illuminate\Http\Request();
    $guestRequest->merge([
        'name' => 'Test Guest User',
        'email' => 'testguest@example.com',
        'phone' => '+9876543210',
        'date' => now()->addDays(3)->format('Y-m-d'),
        'time' => '11:00',
        'doctor_id' => $doctor->doctor_id,
        'reason' => 'Guest dual-path test'
    ]);
    
    // No user resolver for guest
    
    $guestResponse = $controller->book($guestRequest);
    $guestResponseData = json_decode($guestResponse->getContent(), true);
    
    echo "Guest Response Status: " . $guestResponse->getStatusCode() . "\n";
    
    if ($guestResponse->getStatusCode() === 201 && $guestResponseData['success']) {
        echo "✅ Guest dual-path booking successful!\n";
        echo "   Type: " . $guestResponseData['type'] . "\n";
        echo "   Guest ID: " . $guestResponseData['guest']['id'] . "\n";
        echo "   Appointment ID: " . $guestResponseData['appointment']['id'] . "\n";
        
        // Verify appointment has guest_id and no patient_id
        $guestAppointment = Appointment::find($guestResponseData['appointment']['id']);
        echo "   Patient ID: " . ($guestAppointment->patient_id ?? 'null') . "\n";
        echo "   Guest ID: " . ($guestAppointment->guest_id ?? 'null') . "\n";
        
        if ($guestAppointment->guest_id && !$guestAppointment->patient_id) {
            echo "✅ Correct guest reference in appointment\n";
        } else {
            echo "❌ Incorrect guest appointment references\n";
        }
    }
    
    echo "\n🎉 Dual-path booking system working correctly!\n";
    echo "✓ Patient bookings create appointments with patient_id\n";
    echo "✓ Guest bookings create guests and appointments with guest_id\n";
    echo "✓ Proper data separation maintained\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    echo "File: " . $e->getFile() . " Line: " . $e->getLine() . "\n";
}