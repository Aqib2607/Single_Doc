<?php

namespace Tests\Feature;

use App\Models\Doctor;
use App\Models\Patient;
use App\Models\Prescription;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class PrescriptionControllerTest extends TestCase
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

    public function test_can_list_prescriptions_with_pagination()
    {
        Sanctum::actingAs($this->doctor);
        
        Prescription::factory()->count(15)->create([
            'doctor_id' => $this->doctor->doctor_id,
            'patient_id' => $this->patient->patient_id
        ]);

        $response = $this->getJson('/api/prescriptions?per_page=10');

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'data' => [
                        '*' => [
                            'id',
                            'doctor_id',
                            'patient_id',
                            'medication_name',
                            'dosage',
                            'frequency',
                            'is_active'
                        ]
                    ],
                    'current_page',
                    'last_page',
                    'per_page',
                    'total'
                ]);
        
        $this->assertEquals(10, count($response->json('data')));
    }

    public function test_can_create_prescription()
    {
        Sanctum::actingAs($this->doctor);

        $prescriptionData = [
            'patient_id' => $this->patient->patient_id,
            'medication_name' => 'Test Medication',
            'dosage' => '100mg',
            'frequency' => 'Twice daily',
            'instructions' => 'Take with food',
            'start_date' => '2024-01-01',
            'end_date' => '2024-01-31',
            'is_active' => true,
            'refills_remaining' => 3
        ];

        $response = $this->postJson('/api/prescriptions', $prescriptionData);

        $response->assertStatus(201)
                ->assertJsonFragment([
                    'medication_name' => 'Test Medication',
                    'dosage' => '100mg',
                    'doctor_id' => $this->doctor->doctor_id
                ]);

        $this->assertDatabaseHas('prescriptions', [
            'medication_name' => 'Test Medication',
            'doctor_id' => $this->doctor->doctor_id,
            'patient_id' => $this->patient->patient_id
        ]);
    }

    public function test_can_update_prescription()
    {
        Sanctum::actingAs($this->doctor);

        $prescription = Prescription::factory()->create([
            'doctor_id' => $this->doctor->doctor_id,
            'patient_id' => $this->patient->patient_id,
            'medication_name' => 'Old Medication'
        ]);

        $updateData = [
            'patient_id' => $this->patient->patient_id,
            'medication_name' => 'Updated Medication',
            'dosage' => '200mg',
            'frequency' => 'Once daily',
            'start_date' => '2024-01-01',
            'is_active' => true
        ];

        $response = $this->putJson("/api/prescriptions/{$prescription->id}", $updateData);

        $response->assertStatus(200)
                ->assertJsonFragment([
                    'medication_name' => 'Updated Medication',
                    'dosage' => '200mg'
                ]);

        $this->assertDatabaseHas('prescriptions', [
            'id' => $prescription->id,
            'medication_name' => 'Updated Medication'
        ]);
    }

    public function test_can_delete_prescription()
    {
        Sanctum::actingAs($this->doctor);

        $prescription = Prescription::factory()->create([
            'doctor_id' => $this->doctor->doctor_id,
            'patient_id' => $this->patient->patient_id
        ]);

        $response = $this->deleteJson("/api/prescriptions/{$prescription->id}");

        $response->assertStatus(200)
                ->assertJson(['message' => 'Prescription deleted successfully']);

        $this->assertDatabaseMissing('prescriptions', ['id' => $prescription->id]);
    }

    public function test_can_perform_bulk_operations()
    {
        Sanctum::actingAs($this->doctor);

        $prescriptions = Prescription::factory()->count(3)->create([
            'doctor_id' => $this->doctor->doctor_id,
            'patient_id' => $this->patient->patient_id,
            'is_active' => true
        ]);

        $prescriptionIds = $prescriptions->pluck('id')->toArray();

        $response = $this->postJson('/api/prescriptions/bulk-update', [
            'prescription_ids' => $prescriptionIds,
            'action' => 'deactivate'
        ]);

        $response->assertStatus(200)
                ->assertJson(['message' => 'Bulk operation completed successfully']);

        foreach ($prescriptionIds as $id) {
            $this->assertDatabaseHas('prescriptions', [
                'id' => $id,
                'is_active' => false
            ]);
        }
    }

    public function test_requires_authentication()
    {
        $response = $this->getJson('/api/prescriptions');
        $response->assertStatus(401);

        $response = $this->postJson('/api/prescriptions', []);
        $response->assertStatus(401);
    }
}