<!DOCTYPE html>
<html>
<head>
    <title>Hot & Spice — Order {{ $order->order_number }}</title>
    <style>
        body { font-family: Arial, sans-serif; background: #f5f5f5; padding: 20px; }
        h1 { color: #E4002B; }
        h3 { color: #333; margin-bottom: 6px; }
        nav { margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
        nav a { color: #E4002B; font-weight: bold; text-decoration: none; margin-right: 20px; }
        nav a.active { text-decoration: underline; }
        .admin-info { font-size: 13px; color: #555; }
        .admin-info button { padding: 4px 10px; font-size: 12px; margin-left: 10px; }
        button, .btn { background: #E4002B; color: #fff; border: none; padding: 6px 14px; border-radius: 6px; cursor: pointer; font-size: 13px; text-decoration: none; display: inline-block; }
        .btn.secondary { background: #777; }
        select { padding: 6px 10px; border-radius: 6px; }
        .badge { padding: 4px 10px; border-radius: 12px; color: #fff; font-size: 12px; font-weight: bold; }
        .back-link { margin-bottom: 16px; display: inline-block; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; }
        .card { background: #fff; padding: 16px 20px; border-radius: 8px; box-shadow: 0 1px 4px rgba(0,0,0,0.1); }
        .card p { margin: 6px 0; }
        .card .label { color: #777; font-size: 12px; text-transform: uppercase; }
        table { width: 100%; background: #fff; border-collapse: collapse; box-shadow: 0 1px 4px rgba(0,0,0,0.1); }
        th, td { padding: 10px 12px; text-align: left; border-bottom: 1px solid #eee; }
        th { background: #E4002B; color: #fff; }
        .totals { margin-top: 12px; text-align: right; }
        .totals div { margin: 4px 0; }
        .totals .grand { font-size: 18px; font-weight: bold; color: #E4002B; }
        .status-form { display: flex; gap: 10px; align-items: center; margin-top: 10px; }
    </style>
</head>
<body>
    <h1>🍔 Hot & Spice — Admin</h1>
    <nav>
        <div>
            <a href="/admin/dashboard">Dashboard</a>
            <a href="/admin/orders" class="active">Orders</a>
            <a href="/admin/menu">Menu</a>
            <a href="/admin/customers">Customers</a>
            <a href="/admin/coupons">Coupons</a>
            <a href="/admin/riders">Riders</a>
            <a href="/admin/settings">Settings</a>
        </div>
        <div class="admin-info">
            {{ Auth::guard('admin')->user()->name }}
            <form action="/admin/logout" method="POST" style="display:inline;">
                @csrf
                <button type="submit">Logout</button>
            </form>
        </div>
    </nav>

    <a href="/admin/orders" class="back-link">&larr; Back to Orders</a>

    @php
        $statusColors = [
            'pending' => '#ffb300',
            'confirmed' => '#1e88e5',
            'preparing' => '#8e24aa',
            'out_for_delivery' => '#00897b',
            'delivered' => '#43a047',
            'cancelled' => '#757575',
        ];
    @endphp

    <h3>Order {{ $order->order_number }}
        <span class="badge" style="background: {{ $statusColors[$order->status] ?? '#999' }};">
            {{ ucfirst(str_replace('_', ' ', $order->status)) }}
        </span>
    </h3>
    <p style="color:#777;">Placed {{ $order->created_at->format('d M Y, h:i A') }}</p>

    <div class="grid">
        <div class="card">
            <p class="label">Customer</p>
            <p><strong>{{ $order->user->name }}</strong></p>
            <p>{{ $order->user->email }}</p>
        </div>
        <div class="card">
            <p class="label">Delivery</p>
            <p><strong>{{ ucfirst($order->order_type) }}</strong></p>
            @if ($order->order_type === 'delivery')
                <p>{{ $order->delivery_address ?: 'No address on file' }}</p>
                <p class="label" style="margin-top:10px;">Rider</p>
                <form action="/admin/orders/{{ $order->id }}/rider" method="POST" style="display:flex; gap:10px; align-items:center;">
                    @csrf
                    <select name="rider_id">
                        <option value="">Unassigned</option>
                        @foreach ($riders as $rider)
                            <option value="{{ $rider->id }}" {{ $order->rider_id === $rider->id ? 'selected' : '' }}>
                                {{ $rider->name }}
                            </option>
                        @endforeach
                    </select>
                    <button type="submit">Assign</button>
                </form>
            @endif
            @if ($order->notes)
                <p class="label" style="margin-top:10px;">Notes</p>
                <p>{{ $order->notes }}</p>
            @endif
        </div>
    </div>

    <table>
        <tr>
            <th>Item</th>
            <th>Price</th>
            <th>Qty</th>
            <th>Line Total</th>
        </tr>
        @foreach ($order->items as $item)
        <tr>
            <td>{{ $item->item_name }}</td>
            <td>Rs. {{ number_format($item->item_price, 2) }}</td>
            <td>{{ $item->quantity }}</td>
            <td>Rs. {{ number_format($item->line_total, 2) }}</td>
        </tr>
        @endforeach
    </table>

    <div class="totals">
        <div>Subtotal: Rs. {{ number_format($order->subtotal, 2) }}</div>
        @if ($order->discount_amount > 0)
            <div>Discount ({{ $order->coupon_code }}): -Rs. {{ number_format($order->discount_amount, 2) }}</div>
        @endif
        <div>Delivery Fee: Rs. {{ number_format($order->delivery_fee, 2) }}</div>
        <div class="grand">Total: Rs. {{ number_format($order->total, 2) }}</div>
    </div>

    <div class="card" style="margin-top:20px;">
        <p class="label">Update Status</p>
        <form action="/admin/orders/{{ $order->id }}/status" method="POST" class="status-form">
            @csrf
            <input type="hidden" name="return_to" value="{{ request()->getRequestUri() }}">
            <select name="status">
                @foreach (['pending','confirmed','preparing','out_for_delivery','delivered','cancelled'] as $status)
                    <option value="{{ $status }}" {{ $order->status === $status ? 'selected' : '' }}>
                        {{ ucfirst(str_replace('_', ' ', $status)) }}
                    </option>
                @endforeach
            </select>
            <button type="submit">Update Status</button>
        </form>
    </div>
</body>
</html>
