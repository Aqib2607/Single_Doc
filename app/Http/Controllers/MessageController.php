<?php

namespace App\Http\Controllers;

use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class MessageController extends Controller
{
    public function index(): JsonResponse
    {
        $messages = Message::with(['sender', 'receiver'])
            ->latest()
            ->get();

        return response()->json($messages);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'receiver_id' => 'required|integer',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        $message = Message::create([
            ...$validated,
            'sender_id' => 1, // Default sender
        ]);

        return response()->json($message->load(['sender', 'receiver']), 201);
    }

    public function show(Message $message): JsonResponse
    {
        if (!$message->is_read) {
            $message->update([
                'is_read' => true,
                'read_at' => now(),
            ]);
        }

        return response()->json($message->load(['sender', 'receiver']));
    }

    public function update(Request $request, Message $message): JsonResponse
    {
        $validated = $request->validate([
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        $message->update($validated);

        return response()->json($message->load(['sender', 'receiver']));
    }

    public function destroy(Message $message): JsonResponse
    {
        $message->delete();
        return response()->json(['message' => 'Message deleted successfully']);
    }
}