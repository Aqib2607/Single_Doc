<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Blog;
use App\Models\Doctor;

class BlogSeeder extends Seeder
{
    public function run(): void
    {
        // First, ensure we have at least one doctor
        $doctor = Doctor::first();
        
        if (!$doctor) {
            // Create a sample doctor if none exists
            $doctor = Doctor::create([
                'name' => 'Dr. Sarah Mitchell',
                'email' => 'sarah@example.com',
                'password' => bcrypt('password'),
                'specialization' => 'General Medicine',
                'license_number' => 'MD12345',
                'phone' => '123-456-7890',
                'bio' => 'Experienced general practitioner with focus on preventive care.',
                'consultation_fee' => 150.00,
            ]);
        }

        $blogs = [
            [
                'title' => '10 Essential Health Tips for a Better Life',
                'excerpt' => 'Discover simple yet effective ways to improve your overall health and wellbeing.',
                'content' => 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                'category' => 'Wellness',
                'image' => '/src/assets/blog-wellness.jpg',
                'read_time' => '5 min read',
                'status' => 'published',
            ],
            [
                'title' => 'Understanding Mental Health in Modern Times',
                'excerpt' => 'Mental health awareness and practical strategies for maintaining psychological wellbeing.',
                'content' => 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                'category' => 'Mental Health',
                'image' => '/src/assets/blog-mental-health.jpg',
                'read_time' => '7 min read',
                'status' => 'published',
            ],
            [
                'title' => 'Nutrition Guidelines for Optimal Health',
                'excerpt' => 'Evidence-based nutrition advice to help you make informed dietary choices.',
                'content' => 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                'category' => 'Nutrition',
                'image' => '/src/assets/blog-nutrition.jpg',
                'read_time' => '6 min read',
                'status' => 'published',
            ],
        ];

        foreach ($blogs as $blogData) {
            Blog::create(array_merge($blogData, ['doctor_id' => $doctor->id]));
        }
    }
}