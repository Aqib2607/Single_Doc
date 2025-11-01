<?php

namespace Tests\Feature;

use App\Models\Doctor;
use App\Models\Patient;
use App\Models\Prescription;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class PrescriptionEndToEndTest extends TestCase
{
    use RefreshDatabase;

    private $doctor;
    private $patient;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->doctor = Doctor::factory()->create();
        $this->patient = Patient::factory()->create();
    }

    public function test_complete_prescription_workflow()
    {
        Sanctum::actingAs($this->doctor);

        // Step 1: Create a prescription
        $prescriptionData = [
            'patient_id' => $this->patient->patient_id,
            'medication_name' => 'Aspirin',
            'dosage' => '100mg',
            'frequency' => 'Once daily',
            'instructions' => 'Take with food',
            'start_date' => '2024-01-01',
            'end_date' => '2024-01-31',
            'is_active' => true,
            'refills_remaining' => 2
        ];

        $createResponse = $this->postJson('/api/prescriptions', $prescriptionData);
        $createResponse->assertStatus(201);
        $prescriptionId = $createResponse->json('id');

        // Step 2: Verify prescription appears in list
        $listResponse = $this->getJson('/api/prescriptions');
        $listResponse->assertStatus(200);
        $prescriptions = $listResponse->json('data') ?? $listResponse->json();
        $this->assertCount(1, $prescriptions);
        $this->assertEquals('Aspirin', $prescriptions[0]['medication_name']);

        // Step 3: Delete the prescription
        $deleteResponse = $this->deleteJson("/api/prescriptions/{$prescriptionId}");
        $deleteResponse->assertStatus(200);

        // Step 4: Verify prescription is deleted
        $this->assertDatabaseMissing('prescriptions', ['id' => $prescriptionId]);
    }

    public function test_authorization_workflow()
    {
        // Create another doctor
        $otherDoctor = Doctor::factory()->create();

        // Create prescription for first doctor
        Sanctum::actingAs($this->doctor);
        $prescription = Prescription::factory()->create([
            'doctor_id' => $this->doctor->doctor_id,
            'patient_id' => $this->patient->patient_id
        ]);

        // Switch to second doctor
        Sanctum::actingAs($otherDoctor);

        // Try to access first doctor's prescription
        $showResponse = $this->getJson("/api/prescriptions/{$prescription->id}");
        $showResponse->assertStatus(403);
    }

    public function test_validation_workflow()
    {
        Sanctum::actingAs($this->doctor);

        // Test missing required fields
        $response = $this->postJson('/api/prescriptions', []);
        $response->assertStatus(422)
                ->assertJsonValidationErrors([
                    'patient_id',
                    'medication_name',
                    'dosage',
                    'frequency',
                    'start_date'
                ]);
    }
}