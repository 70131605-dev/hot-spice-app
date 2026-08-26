<?php

namespace App\Http\Controllers;

use App\Models\Coupon;
use App\Models\MenuItem;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Settings;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $orders = $request->user()
            ->orders()
            ->with('items')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($orders);
    }

    public function store(Request $request)
    {
        $settings = Settings::current();

        if (! $settings->is_accepting_orders) {
            abort(403, 'The store is currently closed and not accepting orders. Please check back later.');
        }

        $validated = $request->validate([
            'order_type' => 'required|in:delivery,pickup',
            'delivery_address' => 'required_if:order_type,delivery|string|nullable',
            'notes' => 'nullable|string',
            'coupon_code' => 'nullable|string|max:50',
            'items' => 'required|array|min:1',
            'items.*.menu_item_id' => 'required|exists:menu_items,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        $order = DB::transaction(function () use ($validated, $request, $settings) {
            $subtotal = 0;
            $orderItemsData = [];

            foreach ($validated['items'] as $item) {
                $menuItem = MenuItem::findOrFail($item['menu_item_id']);
                $lineTotal = $menuItem->price * $item['quantity'];
                $subtotal += $lineTotal;

                $orderItemsData[] = [
                    'menu_item_id' => $menuItem->id,
                    'item_name' => $menuItem->name,
                    'item_price' => $menuItem->price,
                    'quantity' => $item['quantity'],
                    'line_total' => $lineTotal,
                ];
            }

            if ($subtotal < (float) $settings->min_order_value) {
                throw ValidationException::withMessages([
                    'items' => ['Minimum order value is Rs. '.number_format((float) $settings->min_order_value, 2).'.'],
                ]);
            }

            $couponCode = null;
            $discountAmount = 0;

            if (! empty($validated['coupon_code'])) {
                // Lock the row so two concurrent orders can't both squeeze past
                // a coupon's last remaining use.
                $coupon = Coupon::whereRaw('UPPER(code) = ?', [strtoupper(trim($validated['coupon_code']))])
                    ->lockForUpdate()
                    ->first();

                if (! $coupon) {
                    throw ValidationException::withMessages([
                        'coupon_code' => ['Invalid coupon code.'],
                    ]);
                }

                if ($reason = $coupon->invalidReason($subtotal)) {
                    throw ValidationException::withMessages([
                        'coupon_code' => [$reason],
                    ]);
                }

                $discountAmount = $coupon->calculateDiscount($subtotal);
                $couponCode = $coupon->code;
                $coupon->increment('times_used');
            }

            $deliveryFee = $validated['order_type'] === 'delivery' ? (float) $settings->delivery_fee : 0;
            $total = max(0, $subtotal - $discountAmount) + $deliveryFee;

            $order = Order::create([
                'user_id' => $request->user()->id,
                'order_number' => 'HS-'.strtoupper(Str::random(8)),
                'order_type' => $validated['order_type'],
                'status' => 'pending',
                'subtotal' => $subtotal,
                'delivery_fee' => $deliveryFee,
                'coupon_code' => $couponCode,
                'discount_amount' => $discountAmount,
                'total' => $total,
                'delivery_address' => $validated['delivery_address'] ?? null,
                'notes' => $validated['notes'] ?? null,
            ]);

            foreach ($orderItemsData as $itemData) {
                $order->items()->create($itemData);
            }

            return $order;
        });

        return response()->json($order->load('items'), 201);
    }

    public function show(Request $request, string $id)
    {
        $order = $request->user()
            ->orders()
            ->with('items')
            ->findOrFail($id);

        return response()->json($order);
    }

    public function updateStatus(Request $request, string $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,confirmed,preparing,out_for_delivery,delivered,cancelled',
        ]);

        $order = $request->user()->orders()->findOrFail($id);
        $order->update(['status' => $validated['status']]);

        return response()->json($order->load('items'));
    }
}