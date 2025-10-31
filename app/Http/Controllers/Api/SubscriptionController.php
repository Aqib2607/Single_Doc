<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Subscription;
use Illuminate\Http\Request;

class SubscriptionController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email|unique:subscriptions,email'
        ]);

        $subscription = Subscription::create([
            'email' => $validated['email']
        ]);

        return response()->json([
            'message' => 'Successfully subscribed to newsletter!',
            'subscription' => $subscription
        ], 201);
    }
}
