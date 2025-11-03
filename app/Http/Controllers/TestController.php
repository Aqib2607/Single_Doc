<?php

namespace App\Http\Controllers;

use App\Models\Test;
use Illuminate\Http\Request;

class TestController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum')->except(['index', 'categories']);
    }
    public function index(Request $request)
    {
        $query = Test::query();

        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($request->has('category') && $request->get('category') !== 'all') {
            $query->where('category', $request->get('category'));
        }

        $tests = $query->where('is_active', true)->get();

        return response()->json($tests);
    }

    public function categories()
    {
        $categories = Test::where('is_active', true)
            ->whereNotNull('category')
            ->distinct()
            ->pluck('category');

        return response()->json($categories);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'category' => 'nullable|string|max:255',
            'sample_type' => 'nullable|string|max:255',
            'duration_hours' => 'nullable|integer|min:0',
        ]);

        $test = Test::create($request->all());
        return response()->json($test, 201);
    }

    public function show(Test $test)
    {
        return response()->json($test);
    }

    public function update(Request $request, Test $test)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'category' => 'nullable|string|max:255',
            'sample_type' => 'nullable|string|max:255',
            'duration_hours' => 'nullable|integer|min:0',
        ]);

        $test->update($request->all());
        return response()->json($test);
    }

    public function destroy(Test $test)
    {
        $test->delete();
        return response()->json(['message' => 'Test deleted successfully']);
    }
}