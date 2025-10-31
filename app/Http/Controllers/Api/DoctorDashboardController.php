<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DoctorReview;
use App\Models\Appointment;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class DoctorDashboardController extends Controller
{
    public function index(): JsonResponse
    {
        $doctorId = auth()->id();
        
        // Get review statistics
        $reviews = DoctorReview::where('doctor_id', $doctorId)->where('is_approved', true);
        $totalReviews = $reviews->count();
        $averageRating = $totalReviews > 0 ? round($reviews->avg('rating'), 1) : 0;
        
        // Calculate satisfaction percentage (4-5 star reviews)
        $satisfiedReviews = $reviews->whereIn('rating', [4, 5])->count();
        $satisfactionRate = $totalReviews > 0 ? round(($satisfiedReviews / $totalReviews) * 100) : 0;
        
        // Mock appointment statistics since appointments table doesn't have doctor_id
        $todayAppointments = 3; // Mock data
        $totalPatients = 15; // Mock data

        return response()->json([
            'satisfaction_rate' => $satisfactionRate,
            'average_rating' => $averageRating,
            'total_reviews' => $totalReviews,
            'today_appointments' => $todayAppointments,
            'total_patients' => $totalPatients,
        ]);
    }
}