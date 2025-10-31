<?php
// Comprehensive debug script for vitals loading issue
require_once 'vendor/autoload.php';

use App\Models\Patient;
use App\Models\Vital;
use Illuminate\Support\Facades\Hash;

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

try {
    echo "=== Comprehensive Vitals Debug ===\n\n";
    
    // 1. Check database connection
    echo "1. Database Connection Test:\n";
    try {
        DB::connection()->getPdo();
        echo "   ✓ Database connection successful\n";
    } catch (Exception $e) {
        echo "   ✗ Database connection failed: " . $e->getMessage() . "\n";
        exit(1);
    }
    
    // 2. Check if vitals table exists
    echo "\n2. Vitals Table Check:\n";
    $vitalsTableExists = Schema::hasTable('vitals');
    echo "   Vitals table exists: " . ($vitalsTableExists ? "✓ Yes" : "✗ No") . "\n";
    
    if ($vitalsTableExists) {
        $totalVitals = Vital::count();
        echo "   Total vitals records: $totalVitals\n";
    }
    
    // 3. Check patients and their vitals
    echo "\n3. Patient Data Check:\n";
    $patients = Patient::limit(3)->get();
    foreach ($patients as $patient) {
        echo "   Patient ID: {$patient->patient_id} ({$patient->name})\n";
        echo "   Email: {$patient->email}\n";
        
        $vitalsCount = Vital::where('patient_id', $patient->patient_id)->count();
        echo "   Vitals count: $vitalsCount\n";
        
        if ($vitalsCount > 0) {
            $latestVital = Vital::where('patient_id', $patient->patient_id)
                ->orderBy('recorded_at', 'desc')
                ->first();
            echo "   Latest vital: {$latestVital->vital_type} = {$latestVital->value} {$latestVital->unit}\n";
        }
        echo "\n";
    }
    
    // 4. Test authentication flow
    echo "4. Authentication Test:\n";
    $testPatient = Patient::first();
    if ($testPatient) {
        echo "   Test patient: {$testPatient->name} ({$testPatient->email})\n";
        
        // Check if password is set correctly (assuming default password)
        $passwordCheck = Hash::check('password123', $testPatient->password);
        echo "   Password check (password123): " . ($passwordCheck ? "✓ Valid" : "✗ Invalid") . "\n";
        
        // Create a token for testing
        $token = $testPatient->createToken('test_token')->plainTextToken;
        echo "   Test token created: " . substr($token, 0, 20) . "...\n";
        
        // Test the user data structure
        $userData = array_merge($testPatient->toArray(), ['role' => 'patient', 'id' => $testPatient->patient_id]);
        echo "   User data structure:\n";
        echo "     - ID: " . $userData['id'] . "\n";
        echo "     - Role: " . $userData['role'] . "\n";
        echo "     - Patient ID: " . $userData['patient_id'] . "\n";
    }
    
    // 5. Test VitalsController logic
    echo "\n5. VitalsController Logic Test:\n";
    if ($testPatient) {
        $patientId = $testPatient->patient_id;
        
        // Simulate the controller query
        $query = Vital::where('patient_id', $patientId);
        $query->orderBy('recorded_at', 'desc');
        $vitals = $query->paginate(50);
        
        echo "   Query for patient ID $patientId:\n";
        echo "     - Total records: {$vitals->total()}\n";
        echo "     - Current page: {$vitals->currentPage()}\n";
        echo "     - Per page: {$vitals->perPage()}\n";
        echo "     - Last page: {$vitals->lastPage()}\n";
        
        if ($vitals->count() > 0) {
            echo "   Sample transformed data:\n";
            $sampleVital = $vitals->first();
            $transformed = [
                'id' => $sampleVital->id,
                'vital_type' => $sampleVital->vital_type,
                'value' => $sampleVital->value,
                'unit' => $sampleVital->unit,
                'recorded_at' => $sampleVital->recorded_at->toISOString(),
                'recorded_by' => $sampleVital->recorded_by,
                'notes' => $sampleVital->notes,
                'is_abnormal' => $sampleVital->isAbnormal()
            ];
            echo "     " . json_encode($transformed, JSON_PRETTY_PRINT) . "\n";
        }
    }
    
    // 6. Check route registration
    echo "\n6. Route Check:\n";
    $routes = Route::getRoutes();
    $vitalsRouteFound = false;
    foreach ($routes as $route) {
        if (strpos($route->uri(), 'patients/{patientId}/vitals') !== false) {
            $vitalsRouteFound = true;
            echo "   ✓ Vitals route found: " . $route->uri() . "\n";
            echo "     Methods: " . implode(', ', $route->methods()) . "\n";
            echo "     Middleware: " . implode(', ', $route->middleware()) . "\n";
            break;
        }
    }
    
    if (!$vitalsRouteFound) {
        echo "   ✗ Vitals route not found\n";
    }
    
    echo "\n=== Debug Complete ===\n";
    
} catch (Exception $e) {
    echo "Error during debug: " . $e->getMessage() . "\n";
    echo "Trace: " . $e->getTraceAsString() . "\n";
}