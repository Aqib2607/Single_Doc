<?php
// Test script to verify medical records modal data
require_once 'vendor/autoload.php';

use App\Models\MedicalRecord;
use App\Models\Patient;

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

try {
    echo "=== Medical Records Modal Test ===\n\n";
    
    $patient = Patient::first();
    if (!$patient) {
        echo "No patients found\n";
        exit(1);
    }
    
    echo "Testing with Patient: {$patient->name} (ID: {$patient->patient_id})\n";
    echo str_repeat('-', 60) . "\n\n";
    
    // Fetch all medical records for the patient
    $records = MedicalRecord::where('patient_id', $patient->patient_id)
                           ->orderBy('record_date', 'desc')
                           ->get();
    
    echo "Total Medical Records: {$records->count()}\n\n";
    
    if ($records->isEmpty()) {
        echo "No medical records found for this patient\n";
        exit(0);
    }
    
    // Group records by status
    $statusGroups = $records->groupBy('status');
    echo "Records by Status:\n";
    foreach ($statusGroups as $status => $statusRecords) {
        echo "  {$status}: {$statusRecords->count()} records\n";
    }
    echo "\n";
    
    // Group records by type
    $typeGroups = $records->groupBy('record_type');
    echo "Records by Type:\n";
    foreach ($typeGroups as $type => $typeRecords) {
        echo "  {$type}: {$typeRecords->count()} records\n";
    }
    echo "\n";
    
    // Show sample records with all fields
    echo "Sample Records (Latest 5):\n";
    echo str_repeat('-', 60) . "\n";
    
    foreach ($records->take(5) as $index => $record) {
        echo ($index + 1) . ". {$record->title}\n";
        echo "   Type: {$record->record_type}\n";
        echo "   Status: {$record->status}\n";
        echo "   Date: {$record->record_date->format('Y-m-d H:i')}\n";
        
        if ($record->description) {
            $description = strlen($record->description) > 100 
                ? substr($record->description, 0, 100) . '...' 
                : $record->description;
            echo "   Description: {$description}\n";
        }
        
        // Check for critical flags (simulate)
        $isCritical = in_array(strtolower($record->status), ['urgent', 'critical', 'emergency']);
        if ($isCritical) {
            echo "   ⚠️  CRITICAL FLAG\n";
        }
        
        echo "\n";
    }
    
    // Test API response structure
    echo "API Response Structure Test:\n";
    echo str_repeat('-', 60) . "\n";
    
    $apiResponse = $records->map(function($record) {
        return [
            'id' => $record->id,
            'title' => $record->title,
            'record_type' => $record->record_type,
            'description' => $record->description,
            'record_date' => $record->record_date->toISOString(),
            'status' => $record->status,
            'critical_flag' => in_array(strtolower($record->status), ['urgent', 'critical', 'emergency']),
            'doctor_name' => 'Dr. ' . ['Smith', 'Johnson', 'Williams', 'Brown'][rand(0, 3)] // Simulated
        ];
    });
    
    echo "Sample API Response (First Record):\n";
    echo json_encode($apiResponse->first(), JSON_PRETTY_PRINT) . "\n\n";
    
    // Performance test
    echo "Performance Metrics:\n";
    echo "  Records fetched: {$records->count()}\n";
    echo "  Memory usage: " . round(memory_get_usage() / 1024 / 1024, 2) . " MB\n";
    echo "  Unique record types: " . $records->pluck('record_type')->unique()->count() . "\n";
    echo "  Date range: {$records->last()->record_date->format('Y-m-d')} to {$records->first()->record_date->format('Y-m-d')}\n";
    
    echo "\n=== Test Complete ===\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    echo "Trace: " . $e->getTraceAsString() . "\n";
}