<?php

namespace App\Http\Controllers;

use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class ReviewController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'order_id' => 'required|exists:orders,id',
            'menu_item_id' => 'required|exists:menu_items,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        // Scoping through the user's own orders relation doubles as the
        // authorization check — a 404 here means either it doesn't exist
        // or it isn't theirs, same pattern OrderController@show/updateStatus use.
        $order = $request->user()->orders()->findOrFail($validated['order_id']);

        if ($order->status !== 'delivered') {
            throw ValidationException::withMessages([
                'order_id' => ['You can only review items from delivered orders.'],
            ]);
        }

        if (! $order->items()->where('menu_item_id', $validated['menu_item_id'])->exists()) {
            throw ValidationException::withMessages([
                'menu_item_id' => ['This item was not part of that order.'],
            ]);
        }

        if (Review::where('order_id', $order->id)->where('menu_item_id', $validated['menu_item_id'])->exists()) {
            throw ValidationException::withMessages([
                'menu_item_id' => ['You have already reviewed this item for this order.'],
            ]);
        }

        $review = Review::create([
            'order_id' => $order->id,
            'menu_item_id' => $validated['menu_item_id'],
            'user_id' => $request->user()->id,
            'rating' => $validated['rating'],
            'comment' => $validated['comment'] ?? null,
        ]);

        return response()->json($review, 201);
    }
}
