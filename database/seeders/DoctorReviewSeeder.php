<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\DoctorReview;
use App\Models\User;

class DoctorReviewSeeder extends Seeder
{
    public function run(): void
    {
        // Get all doctors and patients
        $doctors = User::where('role', 'doctor')->get();
        $patients = User::where('role', 'patient')->take(5)->get();

        if ($doctors->count() < 1 || $patients->count() < 5) {
            $this->command->info('Not enough users found. Creating sample reviews with existing users.');
            return;
        }

        $reviews = [
            ['rating' => 5, 'comment' => 'Excellent doctor! Very professional and caring.', 'is_approved' => true],
            ['rating' => 4, 'comment' => 'Good experience, would recommend to others.', 'is_approved' => true],
            ['rating' => 5, 'comment' => 'Outstanding service and medical expertise.', 'is_approved' => true],
            ['rating' => 3, 'comment' => 'Average experience, could be better.', 'is_approved' => true],
            ['rating' => 4, 'comment' => 'Professional and knowledgeable doctor.', 'is_approved' => true],
        ];

        foreach ($doctors as $doctor) {
            foreach ($reviews as $index => $reviewData) {
                DoctorReview::create([
                    'doctor_id' => $doctor->id,
                    'patient_id' => $patients[$index]->id,
                    'rating' => $reviewData['rating'],
                    'comment' => $reviewData['comment'],
                    'is_approved' => $reviewData['is_approved'],
                ]);
            }
        }

        $this->command->info(($doctors->count() * 5) . ' doctor reviews seeded successfully!');
    }
}