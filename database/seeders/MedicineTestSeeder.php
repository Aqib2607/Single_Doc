<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Medicine;
use App\Models\Test;

class MedicineTestSeeder extends Seeder
{
    public function run(): void
    {
        // Medicines
        Medicine::create([
            'name' => 'Aspirin 100mg',
            'description' => 'Pain relief and anti-inflammatory medication',
            'category' => 'Pain Relief',
            'price' => 5.99,
            'stock_quantity' => 100,
            'is_active' => true,
        ]);

        Medicine::create([
            'name' => 'Vitamin D3',
            'description' => 'Essential vitamin supplement for bone health',
            'category' => 'Vitamins',
            'price' => 12.99,
            'stock_quantity' => 50,
            'is_active' => true,
        ]);

        Medicine::create([
            'name' => 'Amoxicillin 500mg',
            'description' => 'Antibiotic for bacterial infections',
            'category' => 'Antibiotics',
            'price' => 15.99,
            'stock_quantity' => 30,
            'is_active' => true,
        ]);

        Medicine::create([
            'name' => 'Ibuprofen 400mg',
            'description' => 'Pain and fever reducer',
            'category' => 'Pain Relief',
            'price' => 7.99,
            'stock_quantity' => 75,
            'is_active' => true,
        ]);

        Medicine::create([
            'name' => 'Omeprazole 20mg',
            'description' => 'Reduces stomach acid production',
            'category' => 'Digestive',
            'price' => 18.99,
            'stock_quantity' => 0,
            'is_active' => true,
        ]);

        Medicine::create([
            'name' => 'Metformin 850mg',
            'description' => 'Diabetes management medication',
            'category' => 'Diabetes',
            'price' => 22.99,
            'stock_quantity' => 40,
            'is_active' => true,
        ]);

        // Tests
        Test::create([
            'name' => 'Complete Blood Count',
            'description' => 'Comprehensive blood analysis including RBC, WBC, platelets',
            'category' => 'Blood Tests',
            'price' => 35.00,
            'is_active' => true,
        ]);

        Test::create([
            'name' => 'Lipid Profile',
            'description' => 'Cholesterol and triglycerides screening',
            'category' => 'Heart Health',
            'price' => 45.00,
            'is_active' => true,
        ]);

        Test::create([
            'name' => 'Thyroid Function Test',
            'description' => 'TSH, T3, T4 hormone levels',
            'category' => 'Hormone Tests',
            'price' => 55.00,
            'is_active' => true,
        ]);

        Test::create([
            'name' => 'Liver Function Test',
            'description' => 'Assess liver health and enzyme levels',
            'category' => 'Organ Function',
            'price' => 42.00,
            'is_active' => true,
        ]);

        Test::create([
            'name' => 'Vitamin D Test',
            'description' => 'Measure vitamin D levels in blood',
            'category' => 'Vitamin Tests',
            'price' => 38.00,
            'is_active' => true,
        ]);

        Test::create([
            'name' => 'HbA1c Test',
            'description' => 'Blood sugar control over past 3 months',
            'category' => 'Diabetes Tests',
            'price' => 32.00,
            'is_active' => false,
        ]);
    }
}