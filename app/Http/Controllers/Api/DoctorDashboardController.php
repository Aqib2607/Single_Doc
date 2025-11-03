<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DoctorReview;
use App\Models\Appointment;
use App\Models\Doctor;
use Illuminate\Http\JsonResponse;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DoctorDashboardController extends Controller
{
    public function index(): JsonResponse
    {
        $user = auth()->user();
        $doctorId = $user->doctor_id;
        
        // Get doctor info
        $doctor = Doctor::find($doctorId);
        if (!$doctor) {
            return response()->json([
                'satisfaction_rate' => 0,
                'average_rating' => 0,
                'total_reviews' => 0,
                'today_appointments' => 0,
                'total_patients' => 0,
            ]);
        }
        
        // Get review statistics
        $reviews = DoctorReview::where('doctor_id', $doctorId)->where('is_approved', true);
        $totalReviews = $reviews->count();
        $averageRating = $totalReviews > 0 ? round($reviews->avg('rating'), 1) : 0;
        
        // Calculate satisfaction percentage (4-5 star reviews)
        $satisfiedReviews = DoctorReview::where('doctor_id', $doctorId)
            ->where('is_approved', true)
            ->whereIn('rating', [4, 5])
            ->count();
        $satisfactionRate = $totalReviews > 0 ? round(($satisfiedReviews / $totalReviews) * 100) : 0;
        
        // Get today's appointments count with timezone handling
        $today = Carbon::now()->format('Y-m-d');
        $todayAppointments = Appointment::where(function($query) use ($doctor) {
                $query->where('doctor_id', $doctor->doctor_id)
                      ->orWhere('doctor', $doctor->name);
            })
            ->whereDate('appointment_date', $today)
            ->count();
        
        // Get total unique patients count (fallback to doctor name if doctor_id is null)
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

        return response()->json([
            'satisfaction_rate' => $satisfactionRate,
            'average_rating' => $averageRating,
            'total_reviews' => $totalReviews,
            'today_appointments' => $todayAppointments,
            'total_patients' => $totalPatients,
        ]);
    }
}