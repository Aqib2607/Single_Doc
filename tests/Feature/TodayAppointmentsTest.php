<?php

namespace Tests\Feature;

use App\Models\Appointment;
use App\Models\Doctor;
use App\Models\Patient;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Carbon\Carbon;

class TodayAppointmentsTest extends TestCase
{
    use RefreshDatabase;

    public function test_doctor_can_view_today_appointments_only()
    {
        $doctor = Doctor::factory()->create();
        $patient = Patient::factory()->create();
        
        // Create today's appointments
        $todayAppointments = Appointment::factory()->count(2)->create([
            'doctor_id' => $doctor->doctor_id,
            'patient_id' => $patient->patient_id,
            'appointment_date' => now()->format('Y-m-d')
        ]);

        // Create tomorrow's appointment (should not appear)
        Appointment::factory()->create([
            'doctor_id' => $doctor->doctor_id,
            'patient_id' => $patient->patient_id,
            'appointment_date' => now()->addDay()->format('Y-m-d')
        ]);

        $response = $this->actingAs($doctor, 'sanctum')
                        ->getJson('/api/doctor/today-appointments');

        $response->assertStatus(200)
                ->assertJson(['success' => true])
                ->assertJsonCount(2, 'data')
                ->assertJsonStructure([
                    'success',
                    'data' => [
                        '*' => [
                            'id',
                            'patient_name',
                            'patient_phone',
                            'time',
                            'formatted_time',
                            'purpose',
                            'status',
                            'consultation_type'
                        ]
                    ],
                    'total'
                ]);
    }

    public function test_doctor_only_sees_their_own_today_appointments()
    {
        $doctor1 = Doctor::factory()->create();
        $doctor2 = Doctor::factory()->create();
        $patient = Patient::factory()->create();

        // Create appointments for doctor1
        Appointment::factory()->create([
            'doctor_id' => $doctor1->doctor_id,
            'patient_id' => $patient->patient_id,
            'appointment_date' => now()->format('Y-m-d')
        ]);

        // Create appointments for doctor2
        Appointment::factory()->count(2)->create([
            'doctor_id' => $doctor2->doctor_id,
            'patient_id' => $patient->patient_id,
            'appointment_date' => now()->format('Y-m-d')
        ]);

        $response = $this->actingAs($doctor1, 'sanctum')
                        ->getJson('/api/doctor/today-appointments');

        $response->assertStatus(200)
                ->assertJsonCount(1, 'data');
    }

    public function test_returns_empty_when_no_today_appointments()
    {
        $doctor = Doctor::factory()->create();

        $response = $this->actingAs($doctor, 'sanctum')
                        ->getJson('/api/doctor/today-appointments');

        $response->assertStatus(200)
                ->assertJson([
                    'success' => true,
                    'data' => [],
                    'total' => 0
                ]);
    }

    public function test_appointments_ordered_by_time()
    {
        $doctor = Doctor::factory()->create();
        $patient = Patient::factory()->create();
        
        // Create appointments with different times
        $appointment1 = Appointment::factory()->create([
            'doctor_id' => $doctor->doctor_id,
            'patient_id' => $patient->patient_id,
            'appointment_date' => now()->format('Y-m-d'),
            'appointment_time' => '14:00'
        ]);

        $appointment2 = Appointment::factory()->create([
            'doctor_id' => $doctor->doctor_id,
            'patient_id' => $patient->patient_id,
            'appointment_date' => now()->format('Y-m-d'),
            'appointment_time' => '09:00'
        ]);

        $response = $this->actingAs($doctor, 'sanctum')
                        ->getJson('/api/doctor/today-appointments');

        $response->assertStatus(200);
        
        $data = $response->json('data');
        $this->assertEquals('09:00', $data[0]['time']);
        $this->assertEquals('14:00', $data[1]['time']);
    }

    public function test_unauthenticated_user_cannot_access()
    {
        $response = $this->getJson('/api/doctor/today-appointments');
        $response->assertStatus(401);
    }
}