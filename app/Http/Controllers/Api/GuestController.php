<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Guest;
use App\Http\Requests\StoreGuestRequest;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class GuestController extends Controller
{
    public function store(StoreGuestRequest $request): JsonResponse
    {
        try {
            $guest = $this->storeGuestDetails($request->validated());
            
            return response()->json([
                'success' => true,
                'message' => 'Guest appointment booked successfully',
                'data' => $guest->load('doctor')
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to book appointment',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function index(): JsonResponse
    {
        $guests = Guest::with('doctor')->orderBy('appointment_date', 'desc')->get();
        
        return response()->json([
            'success' => true,
            'data' => $guests
        ]);
    }

    public function show($id): JsonResponse
    {
        $guest = Guest::with('doctor')->find($id);
        
        if (!$guest) {
            return response()->json([
                'success' => false,
                'message' => 'Guest not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $guest
        ]);
    }



    private function storeGuestDetails(array $data): Guest
    {
        return Guest::create($data);
    }
}