<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Doctor;
use App\Models\Appointment;
use App\Models\DoctorReview;
use Carbon\Carbon;

class RefreshDashboardMetrics extends Command
{
    protected $signature = 'dashboard:refresh {doctor_id?}';
    protected $description = 'Refresh dashboard metrics for doctors';

    public function handle()
    {
        $doctorId = $this->argument('doctor_id');
        
        if ($doctorId) {
            $doctors = Doctor::where('doctor_id', $doctorId)->get();
        } else {
            $doctors = Doctor::all();
        }

        if ($doctors->isEmpty()) {
            $this->error('No doctors found.');
            return 1;
        }

        foreach ($doctors as $doctor) {
            $this->info("Refreshing metrics for Dr. {$doctor->name} (ID: {$doctor->doctor_id})");
            
            // Get review statistics
            $reviews = DoctorReview::where('doctor_id', $doctor->doctor_id)->where('is_approved', true);
            $totalReviews = $reviews->count();
            $averageRating = $totalReviews > 0 ? round($reviews->avg('rating'), 1) : 0;
            
            // Calculate satisfaction percentage
            $satisfiedReviews = DoctorReview::where('doctor_id', $doctor->doctor_id)
                ->where('is_approved', true)
                ->whereIn('rating', [4, 5])
                ->count();
            $satisfactionRate = $totalReviews > 0 ? round(($satisfiedReviews / $totalReviews) * 100) : 0;
            
            // Get today's appointments count
            $today = Carbon::now()->format('Y-m-d');
            $todayAppointments = Appointment::where(function($query) use ($doctor) {
                    $query->where('doctor_id', $doctor->doctor_id)
                          ->orWhere('doctor', $doctor->name);
                })
                ->whereDate('appointment_date', $today)
                ->count();
            
            // Get total unique patients count
            $registeredPatients = Appointment::where(function($query) use ($doctor) {
                    $query->where('doctor_id', $doctor->doctor_id)
                          ->orWhere('doctor', $doctor->name);
                })
                ->whereNotNull('patient_id')
                ->distinct('patient_id')
                ->count('patient_id');
                
            $guestPatients = Appointment::where(function($query) use ($doctor) {
                    $query->where('doctor_id', $doctor->doctor_id)
                          ->orWhere('doctor', $doctor->name);
                })
                ->whereNull('patient_id')
                ->whereNotNull('email')
                ->distinct('email')
                ->count('email');
                
            $totalPatients = $registeredPatients + $guestPatients;

            $this->table(
                ['Metric', 'Value'],
                [
                    ['Total Reviews', $totalReviews],
                    ['Average Rating', $averageRating],
                    ['Satisfaction Rate', $satisfactionRate . '%'],
                    ['Today\'s Appointments', $todayAppointments],
                    ['Total Patients', $totalPatients],
                    ['Registered Patients', $registeredPatients],
                    ['Guest Patients', $guestPatients],
                ]
            );
        }

        $this->info('Dashboard metrics refreshed successfully!');
        return 0;
    }
}