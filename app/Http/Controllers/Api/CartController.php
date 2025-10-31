<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CartItem;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function index(Request $request)
    {
        $sessionId = $request->session()->getId();
        $items = CartItem::where('session_id', $sessionId)->get();
        
        return response()->json($items);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'quantity' => 'required|integer|min:1',
            'category' => 'nullable|string'
        ]);

        $sessionId = $request->session()->getId();
        
        $cartItem = CartItem::create([
            'session_id' => $sessionId,
            'name' => $validated['name'],
            'description' => $validated['description'],
            'price' => $validated['price'],
            'quantity' => $validated['quantity'],
            'category' => $validated['category']
        ]);

        return response()->json($cartItem, 201);
    }

    public function destroy($id)
    {
        $cartItem = CartItem::findOrFail($id);
        $cartItem->delete();
        
        return response()->json(['message' => 'Item removed from cart']);
    }
}