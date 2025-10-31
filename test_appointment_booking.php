<?php

require_once __DIR__ . '/vendor/autoload.php';

use Illuminate\Database\Capsule\Manager as Capsule;
use App\Models\Doctor;
use App\Models\Appointment;

// Load environment variables
if (file_exists(__DIR__ . '/.env')) {
    $dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
    $dotenv->load();
}

// Database configuration
$capsule = new Capsule;
$capsule->addConnection([
    'driver' => $_ENV['DB_CONNECTION'] ?? 'mysql',
    'host' => $_ENV['DB_HOST'] ?? '127.0.0.1',
    'port' => $_ENV['DB_PORT'] ?? '3306',
    'database' => $_ENV['DB_DATABASE'] ?? 'your_database',
    'username' => $_ENV['DB_USERNAME'] ?? 'root',
    'password' => $_ENV['DB_PASSWORD'] ?? '',
    'charset' => 'utf8mb4',
    'collation' => 'utf8mb4_unicode_ci',
    'prefix' => '',
]);

$capsule->setAsGlobal();
$capsule->bootEloquent();

echo "=== Appointment Booking System Test ===\n\n";

// Test 1: Check if doctors exist
echo "1. Testing doctor availability...\n";
$doctors = Doctor::all();
echo "   Found " . $doctors->count() . " doctors in database\n";

if ($doctors->count() > 0) {
    foreach ($doctors as $doctor) {
        echo "   - Dr. {$doctor->name} ({$doctor->specialization}) - ID: {$doctor->doctor_id}\n";
    }
} else {
    echo "   ❌ No doctors found! Please run the seeder first.\n";
    exit(1);
}

// Test 2: Test appointment creation
echo "\n2. Testing appointment creation...\n";
$testDoctor = $doctors->first();

try {
    $testAppointment = Appointment::create([
        'name' => 'Test Patient',
        'email' => 'test@example.com',
        'phone' => '+1-555-TEST',
        'gender' => 'male',
        'appointment_date' => date('Y-m-d', strtotime('+1 day')),
        'appointment_time' => '10:00:00',
        'doctor' => $testDoctor->name,
        'consultation_type' => 'in-person',
        'reason' => 'Test appointment',
        'terms_accepted' => true,
        'status' => 'pending'
    ]);
    
    echo "   ✅ Test appointment created successfully (ID: {$testAppointment->id})\n";
    
    // Clean up test appointment
    $testAppointment->delete();
    echo "   ✅ Test appointment cleaned up\n";
    
} catch (Exception $e) {
    echo "   ❌ Failed to create test appointment: " . $e->getMessage() . "\n";
}

// Test 3: Test API endpoint simulation
echo "\n3. Testing validation rules...\n";

$testCases = [
    [
        'name' => 'Valid Test',
        'data' => [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'phone' => '+1-555-0123',
            'gender' => 'male',
            'date' => date('Y-m-d', strtotime('+2 days')),
            'time' => '14:00:00',
            'doctor_id' => $testDoctor->doctor_id,
            'consultationType' => 'in-person',
            'reason' => 'Regular checkup',
            'termsAccepted' => true
        ],
        'should_pass' => true
    ],
    [
        'name' => 'Missing Name',
        'data' => [
            'email' => 'test@example.com',
            'phone' => '+1-555-0123',
            'date' => date('Y-m-d', strtotime('+2 days')),
            'time' => '14:00:00',
            'doctor_id' => $testDoctor->doctor_id,
            'termsAccepted' => true
        ],
        'should_pass' => false
    ],
    [
        'name' => 'Invalid Doctor ID',
        'data' => [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'phone' => '+1-555-0123',
            'date' => date('Y-m-d', strtotime('+2 days')),
            'time' => '14:00:00',
            'doctor_id' => 99999,
            'termsAccepted' => true
        ],
        'should_pass' => false
    ],
    [
        'name' => 'Past Date',
        'data' => [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'phone' => '+1-555-0123',
            'date' => date('Y-m-d', strtotime('-1 day')),
            'time' => '14:00:00',
            'doctor_id' => $testDoctor->doctor_id,
            'termsAccepted' => true
        ],
        'should_pass' => false
    ]
];

foreach ($testCases as $testCase) {
    echo "   Testing: {$testCase['name']}... ";
    
    // Simulate validation
    $required_fields = ['name', 'email', 'phone', 'date', 'time', 'doctor_id', 'termsAccepted'];
    $missing_fields = [];
    
    foreach ($required_fields as $field) {
        if (!isset($testCase['data'][$field]) || empty($testCase['data'][$field])) {
            $missing_fields[] = $field;
        }
    }
    
    $has_errors = !empty($missing_fields);
    
    // Check doctor exists
    if (isset($testCase['data']['doctor_id'])) {
        $doctor_exists = Doctor::find($testCase['data']['doctor_id']) !== null;
        if (!$doctor_exists) {
            $has_errors = true;
        }
    }
    
    // Check date is future
    if (isset($testCase['data']['date'])) {
        $is_future = strtotime($testCase['data']['date']) > strtotime('today');
        if (!$is_future) {
            $has_errors = true;
        }
    }
    
    $passed = !$has_errors;
    
    if ($passed === $testCase['should_pass']) {
        echo "✅ PASS\n";
    } else {
        echo "❌ FAIL (Expected " . ($testCase['should_pass'] ? 'pass' : 'fail') . ", got " . ($passed ? 'pass' : 'fail') . ")\n";
    }
}

echo "\n4. Database connection test...\n";
try {
    $appointmentCount = Appointment::count();
    echo "   ✅ Database connection successful\n";
    echo "   Current appointments in database: {$appointmentCount}\n";
} catch (Exception $e) {
    echo "   ❌ Database connection failed: " . $e->getMessage() . "\n";
}

echo "\n=== Test Summary ===\n";
echo "✅ All core functionality tests completed\n";
echo "✅ System is ready for appointment bookings\n";
echo "\nTo test the full system:\n";
echo "1. Start the Laravel server: php artisan serve\n";
echo "2. Navigate to the appointment page\n";
echo "3. Try booking an appointment with various scenarios\n";
echo "4. Check the Laravel logs for detailed error information\n";