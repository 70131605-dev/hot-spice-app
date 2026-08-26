<?php

namespace App\Http\Controllers\Admin\Api;

use App\Http\Controllers\Controller;
use App\Models\Rider;
use Illuminate\Http\Request;

class RiderController extends Controller
{
    private const ACTIVE_STATUSES = ['pending', 'confirmed', 'preparing', 'out_for_delivery'];

    public function index()
    {
        $riders = Rider::withCount(['orders as active_orders_count' => function ($q) {
            $q->whereIn('status', self::ACTIVE_STATUSES);
        }])->with(['orders' => function ($q) {
            $q->whereIn('status', self::ACTIVE_STATUSES)
                ->with('user')
                ->orderByDesc('created_at');
        }])->orderBy('name')->get();

        return response()->json($riders);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:30',
        ]);

        $rider = Rider::create([
            'name' => $validated['name'],
            'phone' => $validated['phone'],
            'is_active' => true,
        ]);

        return response()->json($rider, 201);
    }

    public function update(Request $request, string $id)
    {
        $rider = Rider::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:30',
            'is_active' => 'boolean',
        ]);

        $rider->update([
            'name' => $validated['name'],
            'phone' => $validated['phone'],
            'is_active' => $validated['is_active'] ?? $rider->is_active,
        ]);

        return response()->json($rider);
    }

    public function destroy(string $id)
    {
        $rider = Rider::findOrFail($id);

        if ($rider->orders()->exists()) {
            return response()->json([
                'message' => "Can't delete \"{$rider->name}\" — they still have orders assigned to them. Deactivate them instead.",
            ], 422);
        }

        $rider->delete();

        return response()->json(['message' => 'Rider deleted.']);
    }
}
