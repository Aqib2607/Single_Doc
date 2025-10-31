<?php
// Test script to verify VitalsOverview component data requirements
require_once 'vendor/autoload.php';

use App\Models\Vital;
use App\Models\Patient;

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

try {
    echo "=== VitalsOverview Component Test ===\n\n";
    
    $patient = Patient::first();
    if (!$patient) {
        echo "No patients found\n";
        exit(1);
    }
    
    echo "Testing with Patient: {$patient->name} (ID: {$patient->patient_id})\n\n";
    
    // Priority vital types for the 5-card display
    $priorityVitals = ['heart_rate', 'blood_pressure_systolic', 'temperature', 'respiratory_rate', 'oxygen_saturation'];
    
    echo "1. Priority Vitals (Top 5 Display):\n";
    foreach ($priorityVitals as $type) {
        $latestVital = Vital::where('patient_id', $patient->patient_id)
            ->where('vital_type', $type)
            ->orderBy('recorded_at', 'desc')
            ->first();
        
        if ($latestVital) {
            $status = $latestVital->isAbnormal() ? 'ABNORMAL' : 'Normal';
            echo "   ✓ {$type}: {$latestVital->value} {$latestVital->unit} ({$status})\n";
            echo "     Recorded: {$latestVital->recorded_at->format('Y-m-d H:i')}\n";
        } else {
            echo "   ✗ {$type}: No data available\n";
        }
    }
    
    echo "\n2. All Vital Types (Modal Display):\n";
    $allVitalTypes = Vital::where('patient_id', $patient->patient_id)
        ->select('vital_type')
        ->distinct()
        ->pluck('vital_type')
        ->sort();
    
    foreach ($allVitalTypes as $type) {
        $count = Vital::where('patient_id', $patient->patient_id)
            ->where('vital_type', $type)
            ->count();
        
        $latest = Vital::where('patient_id', $patient->patient_id)
            ->where('vital_type', $type)
            ->orderBy('recorded_at', 'desc')
            ->first();
        
        echo "   - {$type}: {$count} records";
        if ($latest) {
            echo " (Latest: {$latest->value} {$latest->unit} on {$latest->recorded_at->format('Y-m-d')})";
        }
        echo "\n";
    }
    
    echo "\n3. API Response Simulation:\n";
    $vitals = Vital::where('patient_id', $patient->patient_id)
        ->orderBy('recorded_at', 'desc')
        ->limit(100)
        ->get();
    
    echo "   Total vitals returned: {$vitals->count()}\n";
    echo "   Unique vital types: " . $vitals->pluck('vital_type')->unique()->count() . "\n";
    
    // Group by type for modal display
    $groupedVitals = $vitals->groupBy('vital_type');
    echo "   Grouped data structure:\n";
    foreach ($groupedVitals as $type => $typeVitals) {
        echo "     - {$type}: {$typeVitals->count()} records\n";
    }
    
    echo "\n=== Test Complete ===\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}