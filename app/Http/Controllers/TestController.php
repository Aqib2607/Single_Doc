<?php

namespace App\Http\Controllers;

use App\Models\Test;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class TestController extends Controller
{
    public function index(): JsonResponse
    {
        $tests = Test::latest()->get();
        return response()->json($tests);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'nullable|string|max:255',
            'price' => 'required|numeric|min:0',
            'sample_type' => 'nullable|string|max:255',
            'duration_hours' => 'nullable|integer|min:0',
            'preparation_instructions' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $test = Test::create($validated);
        return response()->json($test, 201);
    }

    public function show(Test $test): JsonResponse
    {
        return response()->json($test);
    }

    public function update(Request $request, Test $test): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'nullable|string|max:255',
            'price' => 'required|numeric|min:0',
            'sample_type' => 'nullable|string|max:255',
            'duration_hours' => 'nullable|integer|min:0',
            'preparation_instructions' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $test->update($validated);
        return response()->json($test);
    }

    public function destroy(Test $test): JsonResponse
    {
        $test->delete();
        return response()->json(['message' => 'Test deleted successfully']);
    }
}