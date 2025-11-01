<?php

namespace Tests\Unit;

use App\Models\Guest;
use App\Models\Doctor;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Validator;

class GuestModelTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_validation_rules()
    {
        $rules = Guest::rules();
        
        $this->assertArrayHasKey('full_name', $rules);
        $this->assertArrayHasKey('phone_number', $rules);
        $this->assertArrayHasKey('appointment_date', $rules);
        $this->assertArrayHasKey('doctor_id', $rules);
    }

    public function test_valid_guest_data_passes_validation()
    {
        $doctor = Doctor::factory()->create();
        
        $data = [
            'full_name' => 'John Doe',
            'email' => 'john@example.com',
            'phone_number' => '+1234567890',
            'appointment_date' => now()->addDay()->format('Y-m-d H:i:s'),
            'doctor_id' => $doctor->doctor_id
        ];

        $validator = Validator::make($data, Guest::rules());
        $this->assertTrue($validator->passes());
    }

    public function test_invalid_email_fails_validation()
    {
        $data = [
            'full_name' => 'John Doe',
            'email' => 'invalid-email',
            'phone_number' => '+1234567890',
            'appointment_date' => now()->addDay()->format('Y-m-d H:i:s'),
            'doctor_id' => 1
        ];

        $validator = Validator::make($data, Guest::rules());
        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('email', $validator->errors()->toArray());
    }

    public function test_past_appointment_date_fails_validation()
    {
        $data = [
            'full_name' => 'John Doe',
            'phone_number' => '+1234567890',
            'appointment_date' => now()->subDay()->format('Y-m-d H:i:s'),
            'doctor_id' => 1
        ];

        $validator = Validator::make($data, Guest::rules());
        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('appointment_date', $validator->errors()->toArray());
    }

    public function test_guest_belongs_to_doctor()
    {
        $doctor = Doctor::factory()->create();
        $guest = Guest::factory()->create(['doctor_id' => $doctor->doctor_id]);

        $this->assertInstanceOf(Doctor::class, $guest->doctor);
        $this->assertEquals($doctor->doctor_id, $guest->doctor->doctor_id);
    }
}