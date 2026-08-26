<?php

namespace App\Http\Controllers\Admin\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    private const ACTIVE_STATUSES = ['pending', 'confirmed', 'preparing', 'out_for_delivery'];

    public function index(Request $request)
    {
        $query = Order::with('items', 'user', 'rider');

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        if ($request->filled('order_type')) {
            $query->where('order_type', $request->order_type);
        }

        if ($request->input('rider_id') === 'none') {
            $query->whereNull('rider_id');
        } elseif ($request->filled('rider_id')) {
            $query->where('rider_id', $request->rider_id);
        }

        if ($request->boolean('unassigned')) {
            $query->whereNull('rider_id')
                ->where('order_type', 'delivery')
                ->whereIn('status', self::ACTIVE_STATUSES);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('order_number', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($uq) use ($search) {
                        $uq->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    });
            });
        }

        $orders = $query->orderByDesc('created_at')->get();

        return response()->json($orders);
    }

    public function show(string $id)
    {
        $order = Order::with('items', 'user', 'rider')->findOrFail($id);

        return response()->json($order);
    }

    public function updateStatus(Request $request, string $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,confirmed,preparing,out_for_delivery,delivered,cancelled',
        ]);

        $order = Order::findOrFail($id);
        $order->update(['status' => $validated['status']]);

        return response()->json($order->load('items', 'user', 'rider'));
    }

    public function assignRider(Request $request, string $id)
    {
        $validated = $request->validate([
            'rider_id' => 'nullable|exists:riders,id',
        ]);

        $order = Order::findOrFail($id);
        $order->update(['rider_id' => $validated['rider_id'] ?? null]);

        return response()->json($order->load('items', 'user', 'rider'));
    }
}
