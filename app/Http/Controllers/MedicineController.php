<?php

namespace App\Http\Controllers;

use App\Models\Medicine;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class MedicineController extends Controller
{
    public function index(): JsonResponse
    {
        $medicines = Medicine::latest()->get();
        return response()->json($medicines);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'manufacturer' => 'nullable|string|max:255',
            'price' => 'required|numeric|min:0',
            'stock_quantity' => 'required|integer|min:0',
            'dosage_form' => 'nullable|string|max:255',
            'strength' => 'nullable|string|max:255',
            'is_active' => 'boolean',
        ]);

        $medicine = Medicine::create($validated);
        return response()->json($medicine, 201);
    }

    public function show(Medicine $medicine): JsonResponse
    {
        return response()->json($medicine);
    }

    public function update(Request $request, Medicine $medicine): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'manufacturer' => 'nullable|string|max:255',
            'price' => 'required|numeric|min:0',
            'stock_quantity' => 'required|integer|min:0',
            'dosage_form' => 'nullable|string|max:255',
            'strength' => 'nullable|string|max:255',
            'is_active' => 'boolean',
        ]);

        $medicine->update($validated);
        return response()->json($medicine);
    }

    public function destroy(Medicine $medicine): JsonResponse
    {
        $medicine->delete();
        return response()->json(['message' => 'Medicine deleted successfully']);
    }
}