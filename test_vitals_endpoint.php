<?php
// Test script to verify vitals API endpoint
require_once 'vendor/autoload.php';

use App\Models\Patient;
use App\Models\Vital;

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

try {
    echo "=== Vitals API Endpoint Test ===\n\n";
    
    // Get first patient
    $patient = Patient::first();
    if (!$patient) {
        echo "No patients found in database\n";
        exit(1);
    }
    
    echo "Testing with Patient ID: {$patient->patient_id} ({$patient->name})\n";
    echo "Patient Email: {$patient->email}\n\n";
    
    // Check if patient has vitals
    $vitalsCount = Vital::where('patient_id', $patient->patient_id)->count();
    echo "Vitals count for this patient: $vitalsCount\n\n";
    
    if ($vitalsCount > 0) {
        // Show sample vitals
        $sampleVitals = Vital::where('patient_id', $patient->patient_id)
            ->orderBy('recorded_at', 'desc')
            ->limit(5)
            ->get();
        
        echo "Sample vitals for this patient:\n";
        foreach ($sampleVitals as $vital) {
            $abnormal = $vital->isAbnormal() ? ' (ABNORMAL)' : ' (Normal)';
            echo "  - {$vital->vital_type}: {$vital->value} {$vital->unit} - {$vital->recorded_at->format('Y-m-d H:i')}{$abnormal}\n";
        }
    }
    
    // Test API endpoint simulation
    echo "\n=== Simulating API Endpoint Logic ===\n";
    
    // Simulate the VitalsController logic
    $query = Vital::where('patient_id', $patient->patient_id);
    $query->orderBy('recorded_at', 'desc');
    $vitals = $query->paginate(50);
    
    echo "API would return:\n";
    echo "- Total records: {$vitals->total()}\n";
    echo "- Current page: {$vitals->currentPage()}\n";
    echo "- Per page: {$vitals->perPage()}\n";
    echo "- Last page: {$vitals->lastPage()}\n";
    
    if ($vitals->count() > 0) {
        echo "\nFirst few records:\n";
        foreach ($vitals->take(3) as $vital) {
            echo "  - ID: {$vital->id}, Type: {$vital->vital_type}, Value: {$vital->value} {$vital->unit}\n";
        }
    }
    
    echo "\n=== Test Completed ===\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    echo "Trace: " . $e->getTraceAsString() . "\n";
}