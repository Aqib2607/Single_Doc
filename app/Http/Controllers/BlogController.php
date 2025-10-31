<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class BlogController extends Controller
{
    public function index(): JsonResponse
    {
        $blogs = Blog::where('status', 'published')->latest()->get();
        return response()->json($blogs);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'doctor_id' => 'required|exists:doctors,id',
            'title' => 'required|string|max:255',
            'excerpt' => 'required|string',
            'content' => 'required|string',
            'category' => 'required|string|max:255',
            'image' => 'nullable|string',
            'read_time' => 'nullable|string|max:255',
            'status' => 'in:published,draft'
        ]);

        $blog = Blog::create($validated);
        return response()->json($blog->load('doctor'), 201);
    }

    public function show(Blog $blog): JsonResponse
    {
        return response()->json($blog->load('doctor'));
    }

    public function update(Request $request, Blog $blog): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'excerpt' => 'required|string',
            'content' => 'required|string',
            'category' => 'required|string|max:255',
            'image' => 'nullable|string',
            'read_time' => 'nullable|string|max:255',
            'status' => 'in:published,draft'
        ]);

        $blog->update($validated);
        return response()->json($blog->load('doctor'));
    }

    public function destroy(Blog $blog): JsonResponse
    {
        $blog->delete();
        return response()->json(['message' => 'Blog deleted successfully']);
    }

    public function doctorBlogs(Request $request): JsonResponse
    {
        $doctorId = $request->user()->id;
        $blogs = Blog::where('doctor_id', $doctorId)->latest()->get();
        return response()->json($blogs);
    }
}