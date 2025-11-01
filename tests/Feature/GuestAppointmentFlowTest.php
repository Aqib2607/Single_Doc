<?php

namespace Tests\Feature;

use App\Models\Guest;
use App\Models\Doctor;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class GuestAppointmentFlowTest extends TestCase
{
    use RefreshDatabase;

    public function test_complete_guest_appointment_flow_without_authentication()
    {
        // Create a doctor
        $doctor = Doctor::factory()->create([
            'name' => 'Dr. Smith',
            'specialization' => 'Cardiology'
        ]);

        // Guest books appointment without authentication
        $appointmentData = [
            'full_name' => 'Jane Doe',
            'email' => 'jane@example.com',
            'phone_number' => '+1234567890',
            'appointment_date' => now()->addDays(2)->format('Y-m-d H:i:s'),
            'doctor_id' => $doctor->doctor_id
        ];

        $response = $this->postJson('/api/guests', $appointmentData);

        $response->assertStatus(201)
                ->assertJson([
                    'success' => true,
                    'message' => 'Guest appointment booked successfully'
                ])
                ->assertJsonStructure([
                    'data' => [
                        'id',
                        'full_name',
                        'email',
                        'phone_number',
                        'appointment_date',
                        'doctor_id',
                        'doctor' => [
                            'doctor_id',
                            'name',
                            'specialization'
                        ]
                    ]
                ]);

        // Verify appointment is stored in database
        $this->assertDatabaseHas('guests', [
            'full_name' => 'Jane Doe',
            'email' => 'jane@example.com',
            'phone_number' => '+1234567890',
            'doctor_id' => $doctor->doctor_id
        ]);

        // Guest can view their appointment details
        $guest = Guest::where('phone_number', '+1234567890')->first();
        $viewResponse = $this->getJson("/api/guests/{$guest->id}");

        $viewResponse->assertStatus(200)
                    ->assertJson([
                        'success' => true,
                        'data' => [
                            'full_name' => 'Jane Doe',
                            'doctor' => [
                                'name' => 'Dr. Smith'
                            ]
                        ]
                    ]);
    }

    public function test_guest_appointment_validation_errors()
    {
        $invalidData = [
            'full_name' => '',
            'email' => 'invalid-email',
            'phone_number' => '123',
            'appointment_date' => now()->subDay()->format('Y-m-d H:i:s'), // Past date
            'doctor_id' => 999 // Non-existent doctor
        ];

        $response = $this->postJson('/api/guests', $invalidData);

        $response->assertStatus(422)
                ->assertJsonValidationErrors([
                    'full_name',
                    'email',
                    'phone_number',
                    'appointment_date',
                    'doctor_id'
                ]);
    }

    public function test_admin_can_view_all_guest_appointments()
    {
        $doctor = Doctor::factory()->create();
        $guests = Guest::factory()->count(5)->create(['doctor_id' => $doctor->doctor_id]);

        // Admin (doctor) can view all guests
        $response = $this->actingAs($doctor, 'sanctum')
                        ->getJson('/api/guests');

        $response->assertStatus(200)
                ->assertJson(['success' => true])
                ->assertJsonCount(5, 'data');
    }

    public function test_unauthenticated_user_cannot_view_all_guests()
    {
        Guest::factory()->count(3)->create();

        $response = $this->getJson('/api/guests');

        $response->assertStatus(401);
    }
}