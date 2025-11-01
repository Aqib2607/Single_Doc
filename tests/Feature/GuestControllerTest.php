<?php

namespace Tests\Feature;

use App\Models\Guest;
use App\Models\Doctor;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class GuestControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_can_book_appointment()
    {
        $doctor = Doctor::factory()->create();
        
        $data = [
            'full_name' => 'John Doe',
            'email' => 'john@example.com',
            'phone_number' => '+1234567890',
            'appointment_date' => now()->addDay()->format('Y-m-d H:i:s'),
            'doctor_id' => $doctor->doctor_id
        ];

        $response = $this->postJson('/api/guests', $data);

        $response->assertStatus(201)
                ->assertJson([
                    'success' => true,
                    'message' => 'Guest appointment booked successfully'
                ]);

        $this->assertDatabaseHas('guests', [
            'full_name' => 'John Doe',
            'phone_number' => '+1234567890'
        ]);
    }

    public function test_guest_booking_fails_with_invalid_data()
    {
        $data = [
            'full_name' => '',
            'phone_number' => 'invalid',
            'appointment_date' => 'invalid-date',
            'doctor_id' => 999
        ];

        $response = $this->postJson('/api/guests', $data);

        $response->assertStatus(422)
                ->assertJsonValidationErrors(['full_name', 'phone_number', 'appointment_date', 'doctor_id']);
    }

    public function test_can_show_specific_guest()
    {
        $doctor = Doctor::factory()->create();
        $guest = Guest::factory()->create(['doctor_id' => $doctor->doctor_id]);

        $response = $this->getJson("/api/guests/{$guest->id}");

        $response->assertStatus(200)
                ->assertJson([
                    'success' => true,
                    'data' => [
                        'id' => $guest->id,
                        'full_name' => $guest->full_name
                    ]
                ]);
    }

    public function test_show_returns_404_for_nonexistent_guest()
    {
        $response = $this->getJson('/api/guests/999');

        $response->assertStatus(404)
                ->assertJson([
                    'success' => false,
                    'message' => 'Guest not found'
                ]);
    }

    public function test_authenticated_user_can_list_all_guests()
    {
        $doctor = Doctor::factory()->create();
        $guests = Guest::factory()->count(3)->create(['doctor_id' => $doctor->doctor_id]);

        $response = $this->actingAs($doctor, 'sanctum')
                        ->getJson('/api/guests');

        $response->assertStatus(200)
                ->assertJson(['success' => true])
                ->assertJsonCount(3, 'data');
    }
}