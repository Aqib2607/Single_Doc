<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Doctor;
use App\Models\Patient;
use App\Models\Prescription;
use Illuminate\Foundation\Testing\RefreshDatabase;

class MultiplePrescriptionEntriesTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_create_prescription_with_multiple_medicines_and_tests()
    {
        $doctor = Doctor::factory()->create();
        $patient = Patient::factory()->create();

        $response = $this->actingAs($doctor, 'sanctum')->postJson('/api/prescriptions', [
            'patient_id' => $patient->patient_id,
            'medicines' => [
                [
                    'medicine_name' => 'Paracetamol',
                    'dosage' => '500mg',
                    'frequency' => 'Twice daily',
                    'start_date' => '2025-01-22',
                    'end_date' => '2025-01-29',
                    'refills_remaining' => 2,
                    'instructions' => 'Take after meals'
                ],
                [
                    'medicine_name' => 'Ibuprofen',
                    'dosage' => '200mg',
                    'frequency' => 'Three times daily',
                    'start_date' => '2025-01-22',
                    'end_date' => '2025-01-27',
                    'refills_remaining' => 1,
                    'instructions' => 'Take with water'
                ]
            ],
            'tests' => [
                [
                    'test_name' => 'Blood Test',
                    'description' => 'Complete blood count',
                    'instructions' => 'Fasting required'
                ],
                [
                    'test_name' => 'X-Ray',
                    'description' => 'Chest X-Ray',
                    'instructions' => 'Remove metal objects'
                ]
            ]
        ]);

        $response->assertStatus(201);
        
        $prescription = Prescription::first();
        $this->assertCount(2, $prescription->medicines);
        $this->assertCount(2, $prescription->tests);
        
        $this->assertEquals('Paracetamol', $prescription->medicines[0]->medicine_name);
        $this->assertEquals('Blood Test', $prescription->tests[0]->test_name);
    }

    public function test_can_update_prescription_with_multiple_entries()
    {
        $doctor = Doctor::factory()->create();
        $patient = Patient::factory()->create();
        
        $prescription = Prescription::factory()->create([
            'doctor_id' => $doctor->doctor_id,
            'patient_id' => $patient->patient_id
        ]);

        $response = $this->actingAs($doctor, 'sanctum')->putJson("/api/prescriptions/{$prescription->id}", [
            'patient_id' => $patient->patient_id,
            'medicines' => [
                [
                    'medicine_name' => 'Updated Medicine',
                    'dosage' => '100mg',
                    'frequency' => 'Once daily',
                    'start_date' => '2025-01-22',
                    'end_date' => '2025-02-01',
                    'refills_remaining' => 3
                ]
            ],
            'tests' => [
                [
                    'test_name' => 'Updated Test',
                    'description' => 'Updated description'
                ]
            ]
        ]);

        $response->assertStatus(200);
        
        $prescription->refresh();
        $this->assertCount(1, $prescription->medicines);
        $this->assertCount(1, $prescription->tests);
        $this->assertEquals('Updated Medicine', $prescription->medicines[0]->medicine_name);
    }
}