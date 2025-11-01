<?php

namespace Tests\Feature;

use App\Models\Appointment;
use App\Models\Doctor;
use App\Models\Patient;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class DoctorAppointmentsTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_doctor_can_view_their_appointments()
    {
        $doctor = Doctor::factory()->create();
        $patient = Patient::factory()->create();
        
        $appointments = Appointment::factory()->count(3)->create([
            'doctor_id' => $doctor->doctor_id,
            'patient_id' => $patient->patient_id
        ]);

        $response = $this->actingAs($doctor, 'sanctum')
                        ->getJson('/api/doctor/appointments');

        $response->assertStatus(200)
                ->assertJson(['success' => true])
                ->assertJsonCount(3, 'data')
                ->assertJsonStructure([
                    'success',
                    'data' => [
                        '*' => [
                            'appointment_id',
                            'patient_info' => ['name', 'email', 'phone', 'gender'],
                            'date_time' => ['date', 'time', 'formatted'],
                            'status',
                            'consultation_type',
                            'reason',
                            'medical_notes'
                        ]
                    ],
                    'total'
                ]);
    }

    public function test_doctor_only_sees_their_own_appointments()
    {
        $doctor1 = Doctor::factory()->create();
        $doctor2 = Doctor::factory()->create();
        $patient = Patient::factory()->create();

        Appointment::factory()->create(['doctor_id' => $doctor1->doctor_id, 'patient_id' => $patient->patient_id]);
        Appointment::factory()->count(2)->create(['doctor_id' => $doctor2->doctor_id, 'patient_id' => $patient->patient_id]);

        $response = $this->actingAs($doctor1, 'sanctum')
                        ->getJson('/api/doctor/appointments');

        $response->assertStatus(200)
                ->assertJsonCount(1, 'data');
    }

    public function test_unauthenticated_user_cannot_access_doctor_appointments()
    {
        $response = $this->getJson('/api/doctor/appointments');

        $response->assertStatus(401);
    }

    public function test_returns_404_when_doctor_has_no_appointments()
    {
        $doctor = Doctor::factory()->create();

        $response = $this->actingAs($doctor, 'sanctum')
                        ->getJson('/api/doctor/appointments');

        $response->assertStatus(404)
                ->assertJson([
                    'success' => false,
                    'message' => 'No appointments found for this doctor.'
                ]);
    }
}