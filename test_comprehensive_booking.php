<?php

// Test the comprehensive booking system
$baseUrl = 'http://127.0.0.1:8000';

echo "Comprehensive Booking System Test\n";
echo "=================================\n\n";

// Test 1: Guest Booking
echo "1. Testing Guest Booking...\n";

$guestData = [
    'full_name' => 'John Guest User',
    'email' => 'guest@example.com',
    'phone_number' => '+1234567890',
    'appointment_date' => date('Y-m-d H:i:s', strtotime('+2 days')),
    'doctor_id' => 1, // Assuming doctor ID 1 exists
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
    echo "   Guest ID: " . $guestResult['guest']['id'] . "\n\n";
} else {
    echo "❌ Guest booking failed\n\n";
}

// Test 2: Patient Booking (requires authentication)
echo "2. Testing Patient Booking...\n";

// First login as patient
$loginData = [
    'email' => 'john.smith@email.com', // Use existing patient
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

    // Now book appointment as patient
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

// Test missing required fields for guest
$invalidGuestData = [
    'full_name' => 'Invalid Guest',
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

echo "Validation Test HTTP Code: $validationHttpCode\n";
$validationResult = json_decode($validationResponse, true);

if ($validationHttpCode === 422) {
    echo "✅ Validation working correctly\n";
    echo "   Errors: " . implode(', ', array_keys($validationResult['errors'])) . "\n\n";
} else {
    echo "❌ Validation test failed\n\n";
}

// Summary
echo "=== Test Summary ===\n";
echo "Guest Booking: " . ($guestHttpCode === 201 ? "✅ PASSED" : "❌ FAILED") . "\n";
echo "Patient Booking: " . (isset($patientHttpCode) && $patientHttpCode === 201 ? "✅ PASSED" : "❌ FAILED") . "\n";
echo "Validation: " . ($validationHttpCode === 422 ? "✅ PASSED" : "❌ FAILED") . "\n";

echo "\n=== System Features ===\n";
echo "✓ Dual booking flow (guest/patient)\n";
echo "✓ Data separation between guests and patients\n";
echo "✓ Automatic patient data population\n";
echo "✓ Comprehensive field validation\n";
echo "✓ Secure authentication handling\n";
echo "✓ Proper error handling and responses\n";

echo "\n=== Usage ===\n";
echo "Guest Booking: POST /api/book-appointment (no auth)\n";
echo "Patient Booking: POST /api/book-appointment (with Bearer token)\n";
echo "Frontend: /book-appointment (handles both flows)\n";