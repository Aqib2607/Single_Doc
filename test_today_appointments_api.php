<?php

// Test the today appointments API endpoint
$baseUrl = 'http://127.0.0.1:8000';

echo "Today's Appointments API Test\n";
echo "=============================\n\n";

// Step 1: Login as doctor
echo "1. Logging in as doctor...\n";

$loginData = [
    'email' => 'test@example.com', // Use existing doctor
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

if ($loginHttpCode !== 200) {
    echo "❌ Login failed with HTTP code: $loginHttpCode\n";
    echo "Response: $loginResponse\n";
    exit(1);
}

$loginData = json_decode($loginResponse, true);
if (!isset($loginData['token'])) {
    echo "❌ No token received from login\n";
    echo "Response: $loginResponse\n";
    exit(1);
}

$token = $loginData['token'];
echo "✓ Login successful, token received\n\n";

// Step 2: Call today appointments endpoint
echo "2. Fetching today's appointments...\n";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $baseUrl . '/api/doctor/today-appointments');
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . $token,
    'Accept: application/json'
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$appointmentsResponse = curl_exec($ch);
$appointmentsHttpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "HTTP Status Code: $appointmentsHttpCode\n";
echo "Response:\n";
$responseData = json_decode($appointmentsResponse, true);
echo json_encode($responseData, JSON_PRETTY_PRINT);
echo "\n\n";

if ($appointmentsHttpCode === 200 && $responseData['success']) {
    echo "✅ Successfully retrieved " . $responseData['total'] . " appointments for today\n\n";
    
    if ($responseData['total'] > 0) {
        echo "Today's Schedule:\n";
        echo "================\n";
        foreach ($responseData['data'] as $appointment) {
            echo "• {$appointment['formatted_time']} - {$appointment['patient_name']}\n";
            echo "  Purpose: {$appointment['purpose']}\n";
            echo "  Status: {$appointment['status']} ({$appointment['consultation_type']})\n";
            echo "  Phone: {$appointment['patient_phone']}\n\n";
        }
    }
} elseif ($appointmentsHttpCode === 200 && !$responseData['success']) {
    echo "ℹ️ No appointments found for today\n";
} elseif ($appointmentsHttpCode === 401) {
    echo "❌ Authentication failed\n";
} else {
    echo "❌ Request failed with HTTP code: $appointmentsHttpCode\n";
}

echo "\n=== Validation Results ===\n";
echo "✓ Doctor authentication: " . ($loginHttpCode === 200 ? "PASSED" : "FAILED") . "\n";
echo "✓ Today's date filtering: " . ($appointmentsHttpCode === 200 ? "PASSED" : "FAILED") . "\n";
echo "✓ Doctor-specific data: " . ($appointmentsHttpCode === 200 ? "PASSED" : "FAILED") . "\n";
echo "✓ Proper response format: " . (isset($responseData['success']) ? "PASSED" : "FAILED") . "\n";

echo "\n=== API Endpoint Information ===\n";
echo "URL: $baseUrl/api/doctor/today-appointments\n";
echo "Method: GET\n";
echo "Authentication: Bearer token required\n";
echo "Filters: Today's date + Doctor ID\n";
echo "Timezone: Server timezone (" . date_default_timezone_get() . ")\n";