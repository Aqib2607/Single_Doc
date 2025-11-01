<?php

// Simple API test for doctor appointments endpoint
// This demonstrates how to call the endpoint with proper authentication

$baseUrl = 'http://127.0.0.1:8000';

echo "Doctor Appointments API Test\n";
echo "============================\n\n";

// Step 1: Login as doctor to get token
echo "1. Logging in as doctor...\n";

$loginData = [
    'email' => 'appointments1730472982@test.com', // Use the email from our test
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

// Step 2: Call doctor appointments endpoint
echo "2. Fetching doctor appointments...\n";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $baseUrl . '/api/doctor/appointments');
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
echo json_encode(json_decode($appointmentsResponse), JSON_PRETTY_PRINT);
echo "\n\n";

if ($appointmentsHttpCode === 200) {
    $appointmentsData = json_decode($appointmentsResponse, true);
    if ($appointmentsData['success']) {
        echo "✅ Successfully retrieved " . $appointmentsData['total'] . " appointments\n";
    }
} elseif ($appointmentsHttpCode === 404) {
    echo "ℹ️ No appointments found for this doctor\n";
} elseif ($appointmentsHttpCode === 401) {
    echo "❌ Authentication failed\n";
} else {
    echo "❌ Request failed with HTTP code: $appointmentsHttpCode\n";
}

echo "\n=== API Endpoint Information ===\n";
echo "URL: $baseUrl/api/doctor/appointments\n";
echo "Method: GET\n";
echo "Authentication: Bearer token required\n";
echo "Content-Type: application/json\n";
echo "\nResponse Structure:\n";
echo "{\n";
echo "  \"success\": true,\n";
echo "  \"data\": [\n";
echo "    {\n";
echo "      \"appointment_id\": 1,\n";
echo "      \"patient_info\": {\n";
echo "        \"name\": \"Patient Name\",\n";
echo "        \"email\": \"patient@example.com\",\n";
echo "        \"phone\": \"+1234567890\",\n";
echo "        \"gender\": \"male\"\n";
echo "      },\n";
echo "      \"date_time\": {\n";
echo "        \"date\": \"2025-01-20\",\n";
echo "        \"time\": \"10:00\",\n";
echo "        \"formatted\": \"Jan 20, 2025 at 10:00 AM\"\n";
echo "      },\n";
echo "      \"status\": \"confirmed\",\n";
echo "      \"consultation_type\": \"in-person\",\n";
echo "      \"reason\": \"Regular checkup\",\n";
echo "      \"medical_notes\": \"Patient notes\"\n";
echo "    }\n";
echo "  ],\n";
echo "  \"total\": 1\n";
echo "}\n";