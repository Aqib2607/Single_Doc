<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Patient;
use App\Models\Vital;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

class VitalsControllerTest extends TestCase
{
    use RefreshDatabase;

    private Patient $patient;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->patient = Patient::factory()->create();
        
        // Create sample vitals
        Vital::factory()->count(5)->create([
            'patient_id' => $this->patient->patient_id,
            'vital_type' => 'heart_rate',
            'value' => 72,
            'unit' => 'bpm'
        ]);
    }

    public function test_authenticated_patient_can_fetch_own_vitals()
    {
        Sanctum::actingAs($this->patient);

        $response = $this->getJson("/api/patients/{$this->patient->patient_id}/vitals");

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'data' => [
                        '*' => [
                            'id',
                            'vital_type',
                            'value',
                            'unit',
                            'recorded_at',
                            'recorded_by',
                            'notes',
                            'is_abnormal'
                        ]
                    ],
                    'pagination',
                    'last_updated'
                ]);
    }

    public function test_patient_cannot_access_other_patient_vitals()
    {
        $otherPatient = Patient::factory()->create();
        Sanctum::actingAs($otherPatient);

        $response = $this->getJson("/api/patients/{$this->patient->patient_id}/vitals");

        $response->assertStatus(403);
    }

    public function test_vitals_can_be_filtered_by_vital_type()
    {
        Sanctum::actingAs($this->patient);

        $response = $this->getJson("/api/patients/{$this->patient->patient_id}/vitals?vital_type=heart_rate");

        $response->assertStatus(200);
        
        $vitals = $response->json('data');
        foreach ($vitals as $vital) {
            $this->assertEquals('heart_rate', $vital['vital_type']);
        }
    }

    public function test_vitals_can_be_sorted()
    {
        Sanctum::actingAs($this->patient);

        $response = $this->getJson("/api/patients/{$this->patient->patient_id}/vitals?sort_by=vital_type&sort_order=asc");

        $response->assertStatus(200);
    }

    public function test_vitals_pagination_works()
    {
        Sanctum::actingAs($this->patient);

        $response = $this->getJson("/api/patients/{$this->patient->patient_id}/vitals?limit=2");

        $response->assertStatus(200)
                ->assertJsonPath('pagination.per_page', 2);
    }

    public function test_unauthenticated_request_returns_401()
    {
        $response = $this->getJson("/api/patients/{$this->patient->patient_id}/vitals");

        $response->assertStatus(401);
    }
}