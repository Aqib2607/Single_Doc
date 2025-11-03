<?php

// Test script for Gallery API endpoints
echo "Testing Gallery API Endpoints\n";
echo "=============================\n\n";

// Test 1: Login as doctor to get token
echo "1. Testing doctor login...\n";
$loginData = [
    'email' => 'sarah.johnson@hospital.com',
    'password' => 'password123'
];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'http://localhost:8000/api/login');
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($loginData));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode === 200) {
    $loginResponse = json_decode($response, true);
    $token = $loginResponse['token'];
    $doctorId = $loginResponse['user']['doctor_id'];
    echo "✓ Login successful. Doctor ID: $doctorId\n\n";
    
    // Test 2: Get doctor galleries
    echo "2. Testing get doctor galleries...\n";
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, 'http://localhost:8000/api/doctor-galleries');
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Authorization: Bearer ' . $token
    ]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode === 200) {
        $galleries = json_decode($response, true);
        echo "✓ Retrieved " . count($galleries) . " gallery items\n";
        foreach ($galleries as $gallery) {
            echo "  - {$gallery['title']} ({$gallery['type']}) - {$gallery['category']}\n";
        }
    } else {
        echo "✗ Failed to retrieve galleries. HTTP Code: $httpCode\n";
        echo "Response: $response\n";
    }
    
    echo "\n3. Testing create new gallery item...\n";
    $newGallery = [
        'doctor_id' => $doctorId,
        'title' => 'Test Gallery Item',
        'description' => 'This is a test gallery item created via API',
        'url' => '/images/test-image.jpg',
        'type' => 'image',
        'category' => 'Equipment'
    ];
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, 'http://localhost:8000/api/galleries');
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($newGallery));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Authorization: Bearer ' . $token
    ]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode === 201) {
        $createdGallery = json_decode($response, true);
        echo "✓ Gallery item created successfully. ID: {$createdGallery['id']}\n";
    } else {
        echo "✗ Failed to create gallery item. HTTP Code: $httpCode\n";
        echo "Response: $response\n";
    }
    
} else {
    echo "✗ Login failed. HTTP Code: $httpCode\n";
    echo "Response: $response\n";
}

echo "\nTest completed.\n";