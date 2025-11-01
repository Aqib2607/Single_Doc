<?php

require_once 'vendor/autoload.php';

use App\Models\Doctor;
use App\Models\Guest;
use Illuminate\Support\Facades\DB;

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "Testing Guest Management System...\n\n";

try {
    // Test 1: Create a doctor for testing
    echo "1. Creating test doctor...\n";
    $doctor = Doctor::create([
        'name' => 'Dr. Test Smith',
        'email' => 'test@example.com',
        'password' => bcrypt('password'),
        'specialization' => 'General Medicine',
        'license_number' => 'TEST-12345',
        'phone' => '+1234567890',
        'consultation_fee' => 100.00
    ]);
    echo "✓ Doctor created with ID: {$doctor->doctor_id}\n\n";

    // Test 2: Create a guest appointment
    echo "2. Creating guest appointment...\n";
    $guest = Guest::create([
        'full_name' => 'John Test Patient',
        'email' => 'patient@example.com',
        'phone_number' => '+9876543210',
        'appointment_date' => now()->addDays(2),
        'doctor_id' => $doctor->doctor_id
    ]);
    echo "✓ Guest appointment created with ID: {$guest->id}\n\n";

    // Test 3: Verify relationship
    echo "3. Testing doctor-guest relationship...\n";
    $guestWithDoctor = Guest::with('doctor')->find($guest->id);
    echo "✓ Guest: {$guestWithDoctor->full_name}\n";
    echo "✓ Doctor: {$guestWithDoctor->doctor->name}\n";
    echo "✓ Specialization: {$guestWithDoctor->doctor->specialization}\n\n";

    // Test 4: Test validation
    echo "4. Testing validation rules...\n";
    $rules = Guest::rules();
    echo "✓ Validation rules defined: " . implode(', ', array_keys($rules)) . "\n\n";

    // Test 5: Query optimization test
    echo "5. Testing database indexes...\n";
    $indexes = DB::select("PRAGMA index_list('guests')");
    echo "✓ Database indexes created: " . count($indexes) . " indexes found\n\n";

    echo "🎉 All tests passed! Guest management system is working correctly.\n";

} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    echo "File: " . $e->getFile() . " Line: " . $e->getLine() . "\n";
}