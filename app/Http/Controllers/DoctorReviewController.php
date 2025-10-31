<?php

namespace App\Http\Controllers;

use App\Models\DoctorReview;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class DoctorReviewController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = DoctorReview::with(['patient', 'doctor']);
        
        if ($request->has('doctor_id')) {
            $query->where('doctor_id', $request->doctor_id);
        }
        
        $reviews = $query->latest()->get();
        return response()->json($reviews);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'doctor_id' => 'required|exists:doctors,doctor_id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        $review = DoctorReview::updateOrCreate(
            [
                'doctor_id' => $validated['doctor_id'],
                'patient_id' => auth()->user()->patient_id ?? auth()->user()->doctor_id,
            ],
            [
                'rating' => $validated['rating'],
                'comment' => $validated['comment'],
            ]
        );

        return response()->json($review->load(['patient', 'doctor']), 201);
    }

    public function show(DoctorReview $doctorReview): JsonResponse
    {
        return response()->json($doctorReview->load(['patient', 'doctor']));
    }

    public function update(Request $request, DoctorReview $doctorReview): JsonResponse
    {
        $validated = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
            'is_approved' => 'boolean',
        ]);

        $doctorReview->update($validated);
        return response()->json($doctorReview->load(['patient', 'doctor']));
    }

    public function destroy(DoctorReview $doctorReview): JsonResponse
    {
        $doctorReview->delete();
        return response()->json(['message' => 'Review deleted successfully']);
    }
}