<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Doctor;
use App\Models\Patient;
use App\Models\Guest;
use Illuminate\Foundation\Testing\RefreshDatabase;

class PatientsAndGuestsTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_fetch_combined_patients_and_guests()
    {
        $doctor = Doctor::factory()->create();
        $patient = Patient::factory()->create(['name' => 'John Patient']);
        $guest = Guest::factory()->create([
            'doctor_id' => $doctor->doctor_id,
            'full_name' => 'Jane Guest'
        ]);

        $response = $this->actingAs($doctor, 'sanctum')->getJson('/api/patients-and-guests');

        $response->assertStatus(200);
        $data = $response->json();
        
        $this->assertCount(2, $data);
        
        // Check patient data
        $patientData = collect($data)->firstWhere('type', 'patient');
        $this->assertEquals('John Patient (Patient)', $patientData['display_name']);
        $this->assertEquals('patient', $patientData['type']);
        
        // Check guest data
        $guestData = collect($data)->firstWhere('type', 'guest');
        $this->assertEquals('Jane Guest (Guest)', $guestData['display_name']);
        $this->assertEquals('guest', $guestData['type']);
        $this->assertEquals('guest_' . $guest->id, $guestData['id']);
    }

    public function test_can_create_prescription_for_guest()
    {
        $doctor = Doctor::factory()->create();
        $guest = Guest::factory()->create(['doctor_id' => $doctor->doctor_id]);

        $response = $this->actingAs($doctor, 'sanctum')->postJson('/api/prescriptions', [
            'patient_id' => 'guest_' . $guest->id,
            'medicines' => [
                [
                    'medicine_name' => 'Test Medicine',
                    'dosage' => '100mg',
                    'frequency' => 'Once daily',
                    'start_date' => '2025-11-06',
                    'end_date' => '2025-11-13',
                    'refills_remaining' => 2
                ]
            ]
        ]);

        $response->assertStatus(201);
        
        $prescription = $response->json();
        $this->assertNull($prescription['patient_id']);
        $this->assertEquals($guest->id, $prescription['guest_id']);
        $this->assertCount(1, $prescription['medicines']);
    }
}