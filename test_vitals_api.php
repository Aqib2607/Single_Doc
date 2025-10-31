<?php
// Test script to verify vitals API functionality
require_once 'vendor/autoload.php';

use App\Models\Vital;
use App\Models\Patient;

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

try {
    echo "=== Vitals API Functionality Test ===\n\n";
    
    // Test 1: Check total vitals records
    $totalVitals = Vital::count();
    echo "1. Total vitals records in database: $totalVitals\n";
    
    // Test 2: Check vitals per patient
    echo "\n2. Vitals per patient:\n";
    for ($patientId = 1; $patientId <= 5; $patientId++) {
        $count = Vital::where('patient_id', $patientId)->count();
        $patient = Patient::where('patient_id', $patientId)->first();
        $patientName = $patient ? $patient->name : 'Unknown';
        echo "   Patient $patientId ($patientName): $count vitals\n";
        
        if ($count > 0) {
            $latestVitals = Vital::where('patient_id', $patientId)
                ->orderBy('recorded_at', 'desc')
                ->limit(3)
                ->get(['vital_type', 'value', 'unit', 'recorded_at']);
            
            foreach ($latestVitals as $vital) {
                $abnormal = $vital->isAbnormal() ? ' (ABNORMAL)' : ' (Normal)';
                echo "     - {$vital->vital_type}: {$vital->value} {$vital->unit}{$abnormal}\n";
            }
        }
    }
    
    // Test 3: Test abnormal detection
    echo "\n3. Testing abnormal vital detection:\n";
    $abnormalVitals = Vital::all()->filter(function($vital) {
        return $vital->isAbnormal();
    });
    
    echo "   Found " . $abnormalVitals->count() . " abnormal readings\n";
    foreach ($abnormalVitals->take(5) as $vital) {
        echo "     - Patient {$vital->patient_id}: {$vital->vital_type} = {$vital->value} {$vital->unit}\n";
    }
    
    // Test 4: Test API endpoint simulation
    echo "\n4. Testing API endpoint logic:\n";
    $patient = Patient::first();
    if ($patient) {
        $vitals = Vital::where('patient_id', $patient->patient_id)
            ->orderBy('recorded_at', 'desc')
            ->limit(10)
            ->get();
        
        echo "   Latest 10 vitals for {$patient->name}:\n";
        foreach ($vitals as $vital) {
            $status = $vital->isAbnormal() ? 'ABNORMAL' : 'Normal';
            echo "     - {$vital->recorded_at->format('Y-m-d H:i')}: {$vital->vital_type} = {$vital->value} {$vital->unit} ({$status})\n";
        }
    }
    
    echo "\n=== Vitals Test Completed Successfully ===\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    echo "Trace: " . $e->getTraceAsString() . "\n";
}