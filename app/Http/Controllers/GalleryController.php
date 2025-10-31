<?php

namespace App\Http\Controllers;

use App\Models\Gallery;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class GalleryController extends Controller
{
    public function index(): JsonResponse
    {
        $galleries = Gallery::with('doctor')->latest()->get();
        return response()->json($galleries);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'doctor_id' => 'required|exists:doctors,id',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'url' => 'required|string',
            'type' => 'required|in:image,video',
            'category' => 'required|string|max:255'
        ]);

        $gallery = Gallery::create($validated);
        return response()->json($gallery->load('doctor'), 201);
    }

    public function show(Gallery $gallery): JsonResponse
    {
        return response()->json($gallery->load('doctor'));
    }

    public function update(Request $request, Gallery $gallery): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'url' => 'required|string',
            'type' => 'required|in:image,video',
            'category' => 'required|string|max:255'
        ]);

        $gallery->update($validated);
        return response()->json($gallery->load('doctor'));
    }

    public function destroy(Gallery $gallery): JsonResponse
    {
        $gallery->delete();
        return response()->json(['message' => 'Gallery item deleted successfully']);
    }
}