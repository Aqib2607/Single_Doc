<?php

require_once 'vendor/autoload.php';

use App\Models\Doctor;

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "Existing doctors:\n";
$doctors = Doctor::select('doctor_id', 'name', 'email')->get();
foreach($doctors as $doctor) {
    echo "ID: {$doctor->doctor_id}, Name: {$doctor->name}, Email: {$doctor->email}\n";
}