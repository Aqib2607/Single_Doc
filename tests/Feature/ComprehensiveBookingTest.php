<?php

namespace Tests\Feature;

use App\Models\Guest;
use App\Models\Appointment;
use App\Models\Doctor;
use App\Models\Patient;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ComprehensiveBookingTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_can_book_appointment()
    {
        $doctor = Doctor::factory()->create();
        
        $guestData = [
            'full_name' => 'John Guest',
            'email' => 'guest@example.com',
            'phone_number' => '+1234567890',
            'appointment_date' => now()->addDay()->format('Y-m-d H:i:s'),
            'doctor_id' => $doctor->doctor_id,
            'reason' => 'General consultation'
        ];

        $response = $this->postJson('/api/book-appointment', $guestData);

        $response->assertStatus(201)
                ->assertJson([
                    'success' => true,
                    'type' => 'guest'
                ]);

        $this->assertDatabaseHas('guests', [
            'full_name' => 'John Guest',
            'phone_number' => '+1234567890'
        ]);
    }

    public function test_patient_can_book_appointment()
    {
        $doctor = Doctor::factory()->create();
        $patient = Patient::factory()->create();
        
        $patientData = [
            'date' => now()->addDay()->format('Y-m-d'),
            'time' => '10:00',
            'doctor_id' => $doctor->doctor_id,
            'consultationType' => 'in-person',
            'reason' => 'Regular checkup',
            'termsAccepted' => true
        ];

        $response = $this->actingAs($patient, 'sanctum')
                        ->postJson('/api/book-appointment', $patientData);

        $response->assertStatus(201)
                ->assertJson([
                    'success' => true,
                    'type' => 'patient'
                ]);

        $this->assertDatabaseHas('appointments', [
            'patient_id' => $patient->patient_id,
            'doctor_id' => $doctor->doctor_id
        ]);
    }

    public function test_guest_booking_requires_all_fields()
    {
        $doctor = Doctor::factory()->create();
        
        $incompleteData = [
            'full_name' => 'John Guest',
            // Missing required fields
            'doctor_id' => $doctor->doctor_id
        ];

        $response = $this->postJson('/api/book-appointment', $incompleteData);

        $response->assertStatus(422)
                ->assertJsonValidationErrors(['phone_number', 'appointment_date']);
    }

    public function test_patient_booking_requires_terms_acceptance()
    {
        $doctor = Doctor::factory()->create();
        $patient = Patient::factory()->create();
        
        $dataWithoutTerms = [
            'date' => now()->addDay()->format('Y-m-d'),
            'time' => '10:00',
            'doctor_id' => $doctor->doctor_id,
            'termsAccepted' => false
        ];

        $response = $this->actingAs($patient, 'sanctum')
                        ->postJson('/api/book-appointment', $dataWithoutTerms);

        $response->assertStatus(422)
                ->assertJsonValidationErrors(['termsAccepted']);
    }

    public function test_data_separation_between_guest_and_patient()
    {
        $doctor = Doctor::factory()->create();
        $patient = Patient::factory()->create();
        
        // Book as guest
        $guestData = [
            'full_name' => 'Guest User',
            'phone_number' => '+1111111111',
            'appointment_date' => now()->addDay()->format('Y-m-d H:i:s'),
            'doctor_id' => $doctor->doctor_id
        ];
        
        $this->postJson('/api/book-appointment', $guestData);
        
        // Book as patient
        $patientData = [
            'date' => now()->addDay()->format('Y-m-d'),
            'time' => '14:00',
            'doctor_id' => $doctor->doctor_id,
            'termsAccepted' => true
        ];
        
        $this->actingAs($patient, 'sanctum')
             ->postJson('/api/book-appointment', $patientData);

        // Verify data separation
        $this->assertDatabaseHas('guests', ['full_name' => 'Guest User']);
        $this->assertDatabaseHas('appointments', ['patient_id' => $patient->patient_id]);
        $this->assertDatabaseMissing('appointments', ['name' => 'Guest User']);
        $this->assertDatabaseMissing('guests', ['full_name' => $patient->name]);
    }

    public function test_patient_data_auto_population()
    {
        $doctor = Doctor::factory()->create();
        $patient = Patient::factory()->create([
            'name' => 'Test Patient',
            'email' => 'patient@test.com',
            'phone' => '+9876543210'
        ]);
        
        $patientData = [
            'date' => now()->addDay()->format('Y-m-d'),
            'time' => '10:00',
            'doctor_id' => $doctor->doctor_id,
            'termsAccepted' => true
        ];

        $response = $this->actingAs($patient, 'sanctum')
                        ->postJson('/api/book-appointment', $patientData);

        $response->assertStatus(201);
        
        // Verify patient data was auto-populated
        $appointment = Appointment::where('patient_id', $patient->patient_id)->first();
        $this->assertEquals('Test Patient', $appointment->name);
        $this->assertEquals('patient@test.com', $appointment->email);
        $this->assertEquals('+9876543210', $appointment->phone);
    }

    public function test_invalid_doctor_id_rejected()
    {
        $guestData = [
            'full_name' => 'John Guest',
            'phone_number' => '+1234567890',
            'appointment_date' => now()->addDay()->format('Y-m-d H:i:s'),
            'doctor_id' => 999 // Non-existent doctor
        ];

        $response = $this->postJson('/api/book-appointment', $guestData);

        $response->assertStatus(422)
                ->assertJsonValidationErrors(['doctor_id']);
    }

    public function test_past_date_rejected_for_guest()
    {
        $doctor = Doctor::factory()->create();
        
        $guestData = [
            'full_name' => 'John Guest',
            'phone_number' => '+1234567890',
            'appointment_date' => now()->subDay()->format('Y-m-d H:i:s'),
            'doctor_id' => $doctor->doctor_id
        ];

        $response = $this->postJson('/api/book-appointment', $guestData);

        $response->assertStatus(422)
                ->assertJsonValidationErrors(['appointment_date']);
    }
}