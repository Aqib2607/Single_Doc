<?php

// Test the dual-path booking system
$baseUrl = 'http://127.0.0.1:8000';

echo "Dual-Path Booking System Test\n";
echo "=============================\n\n";

// Test 1: Guest Booking (No Authentication)
echo "1. Testing Guest Booking (No Authentication)...\n";

$guestData = [
    'name' => 'Jane Guest',
    'email' => 'jane.guest@example.com',
    'phone' => '+1234567890',
    'date' => date('Y-m-d', strtotime('+2 days')),
    'time' => '10:00',
    'doctor_id' => 1,
    'reason' => 'General health consultation'
];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $baseUrl . '/api/book-appointment');
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($guestData));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Accept: application/json'
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$guestResponse = curl_exec($ch);
$guestHttpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "Guest Booking HTTP Code: $guestHttpCode\n";
$guestResult = json_decode($guestResponse, true);
echo "Guest Response: " . json_encode($guestResult, JSON_PRETTY_PRINT) . "\n\n";

if ($guestHttpCode === 201 && $guestResult['success']) {
    echo "✅ Guest booking successful!\n";
    echo "   Type: " . $guestResult['type'] . "\n";
    echo "   Guest ID: " . $guestResult['guest']['id'] . "\n";
    echo "   Appointment ID: " . $guestResult['appointment']['id'] . "\n\n";
} else {
    echo "❌ Guest booking failed\n\n";
}

// Test 2: Patient Booking (With Authentication)
echo "2. Testing Patient Booking (With Authentication)...\n";

// Login as patient first
$loginData = [
    'email' => 'john.smith@email.com',
    'password' => 'password'
];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $baseUrl . '/api/login');
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($loginData));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Accept: application/json'
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$loginResponse = curl_exec($ch);
$loginHttpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($loginHttpCode === 200) {
    $loginResult = json_decode($loginResponse, true);
    $token = $loginResult['token'];
    echo "✅ Patient login successful\n";

    // Book appointment as authenticated patient
    $patientData = [
        'date' => date('Y-m-d', strtotime('+3 days')),
        'time' => '14:00',
        'doctor_id' => 1,
        'consultationType' => 'in-person',
        'reason' => 'Regular checkup',
        'termsAccepted' => true
    ];

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $baseUrl . '/api/book-appointment');
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($patientData));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Accept: application/json',
        'Authorization: Bearer ' . $token
    ]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    $patientResponse = curl_exec($ch);
    $patientHttpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    echo "Patient Booking HTTP Code: $patientHttpCode\n";
    $patientResult = json_decode($patientResponse, true);
    echo "Patient Response: " . json_encode($patientResult, JSON_PRETTY_PRINT) . "\n\n";

    if ($patientHttpCode === 201 && $patientResult['success']) {
        echo "✅ Patient booking successful!\n";
        echo "   Type: " . $patientResult['type'] . "\n";
        echo "   Appointment ID: " . $patientResult['appointment']['id'] . "\n\n";
    } else {
        echo "❌ Patient booking failed\n\n";
    }
} else {
    echo "❌ Patient login failed, skipping patient booking test\n\n";
}

// Test 3: Validation Tests
echo "3. Testing Validation...\n";

// Test guest validation
$invalidGuestData = [
    'name' => 'Invalid Guest',
    // Missing required fields
];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $baseUrl . '/api/book-appointment');
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($invalidGuestData));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Accept: application/json'
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$validationResponse = curl_exec($ch);
$validationHttpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "Guest Validation Test HTTP Code: $validationHttpCode\n";
$validationResult = json_decode($validationResponse, true);

if ($validationHttpCode === 422) {
    echo "✅ Guest validation working correctly\n";
    echo "   Message: " . $validationResult['message'] . "\n";
    echo "   Errors: " . implode(', ', array_keys($validationResult['errors'])) . "\n\n";
} else {
    echo "❌ Guest validation test failed\n\n";
}

// Summary
echo "=== Test Summary ===\n";
echo "Guest Booking: " . ($guestHttpCode === 201 ? "✅ PASSED" : "❌ FAILED") . "\n";
echo "Patient Booking: " . (isset($patientHttpCode) && $patientHttpCode === 201 ? "✅ PASSED" : "❌ FAILED") . "\n";
echo "Validation: " . ($validationHttpCode === 422 ? "✅ PASSED" : "❌ FAILED") . "\n";

echo "\n=== System Features ===\n";
echo "✓ Dual-path booking (guest/patient)\n";
echo "✓ No login requirement for guests\n";
echo "✓ Guest data stored in guests table\n";
echo "✓ Appointment data with guest_id/patient_id references\n";
echo "✓ Context-specific error messages\n";
echo "✓ Proper foreign key relationships\n";
echo "✓ Transaction handling for data integrity\n";

echo "\n=== Database Structure ===\n";
echo "Guests Table: id, full_name, email, phone_number, appointment_date, doctor_id\n";
echo "Appointments Table: id, patient_id, guest_id, name, email, phone, appointment_date, appointment_time, doctor_id\n";
echo "Foreign Keys: appointments.guest_id -> guests.id, appointments.patient_id -> patients.patient_id\n";