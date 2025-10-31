<?php
// Test script to verify health score calculation
require_once 'vendor/autoload.php';

use App\Models\Vital;
use App\Models\Patient;

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

function calculateHealthScore($vitals) {
    $getLatestVital = function($type) use ($vitals) {
        return $vitals->where('vital_type', $type)
                     ->sortByDesc('recorded_at')
                     ->first();
    };

    $heartRate = $getLatestVital('heart_rate');
    $systolic = $getLatestVital('blood_pressure_systolic');
    $diastolic = $getLatestVital('blood_pressure_diastolic');
    $temp = $getLatestVital('temperature');
    $respiratory = $getLatestVital('respiratory_rate');
    $oxygen = $getLatestVital('oxygen_saturation');

    $scoreVital = function($vital, $optimalRange, $weight) {
        if (!$vital) return 0;
        
        [$min, $max] = $optimalRange;
        $value = $vital->value;
        
        if ($value >= $min && $value <= $max) return $weight;
        
        $deviation = min(
            abs($value - $min) / $min,
            abs($value - $max) / $max
        );
        
        return max(0, $weight * (1 - $deviation * 2));
    };

    $scores = [
        'heartRate' => $scoreVital($heartRate, [60, 100], 20),
        'bloodPressure' => min(
            $scoreVital($systolic, [90, 140], 15),
            $scoreVital($diastolic, [60, 90], 15)
        ),
        'temperature' => $scoreVital($temp, [97.0, 99.5], 20),
        'respiratory' => $scoreVital($respiratory, [12, 20], 15),
        'oxygenSat' => $scoreVital($oxygen, [95, 100], 30)
    ];

    return [
        'total' => round(array_sum($scores)),
        'breakdown' => $scores,
        'vitals' => [
            'heart_rate' => $heartRate ? "{$heartRate->value} {$heartRate->unit}" : 'N/A',
            'bp_systolic' => $systolic ? "{$systolic->value} {$systolic->unit}" : 'N/A',
            'bp_diastolic' => $diastolic ? "{$diastolic->value} {$diastolic->unit}" : 'N/A',
            'temperature' => $temp ? "{$temp->value} {$temp->unit}" : 'N/A',
            'respiratory' => $respiratory ? "{$respiratory->value} {$respiratory->unit}" : 'N/A',
            'oxygen_sat' => $oxygen ? "{$oxygen->value} {$oxygen->unit}" : 'N/A'
        ]
    ];
}

try {
    echo "=== Health Score Calculation Test ===\n\n";
    
    $patients = Patient::limit(3)->get();
    
    foreach ($patients as $patient) {
        echo "Patient: {$patient->name} (ID: {$patient->patient_id})\n";
        echo str_repeat('-', 50) . "\n";
        
        $vitals = Vital::where('patient_id', $patient->patient_id)
                      ->orderBy('recorded_at', 'desc')
                      ->limit(50)
                      ->get();
        
        if ($vitals->isEmpty()) {
            echo "No vitals data available\n\n";
            continue;
        }
        
        $healthScore = calculateHealthScore($vitals);
        
        echo "Current Vitals:\n";
        foreach ($healthScore['vitals'] as $type => $value) {
            echo "  {$type}: {$value}\n";
        }
        
        echo "\nScore Breakdown:\n";
        echo "  Heart Rate: {$healthScore['breakdown']['heartRate']}/20\n";
        echo "  Blood Pressure: {$healthScore['breakdown']['bloodPressure']}/15\n";
        echo "  Temperature: {$healthScore['breakdown']['temperature']}/20\n";
        echo "  Respiratory: {$healthScore['breakdown']['respiratory']}/15\n";
        echo "  Oxygen Saturation: {$healthScore['breakdown']['oxygenSat']}/30\n";
        
        echo "\nTotal Health Score: {$healthScore['total']}/100\n";
        
        $label = 'Needs Attention';
        if ($healthScore['total'] >= 80) $label = 'Excellent';
        elseif ($healthScore['total'] >= 60) $label = 'Good';
        elseif ($healthScore['total'] >= 40) $label = 'Fair';
        
        echo "Status: {$label}\n\n";
    }
    
    echo "=== Algorithm Details ===\n";
    echo "Scoring Formula:\n";
    echo "- Heart Rate (20%): Optimal 60-100 bpm\n";
    echo "- Blood Pressure (15%): Optimal 90-140/60-90 mmHg\n";
    echo "- Temperature (20%): Optimal 97.0-99.5°F\n";
    echo "- Respiratory Rate (15%): Optimal 12-20 /min\n";
    echo "- Oxygen Saturation (30%): Optimal 95-100%\n\n";
    echo "Deviation penalty: 2x deviation ratio from optimal range\n";
    echo "Total possible score: 100 points\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}