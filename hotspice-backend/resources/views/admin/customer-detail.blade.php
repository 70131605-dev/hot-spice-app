<!DOCTYPE html>
<html>
<head>
    <title>Hot & Spice — {{ $customer->name }}</title>
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
        .btn.danger { background: #b3001b; }
        .badge { padding: 4px 10px; border-radius: 12px; color: #fff; font-size: 12px; font-weight: bold; }
        .back-link { margin-bottom: 16px; display: inline-block; }
        .grid { display: grid; grid-template-columns: 2fr 1fr; gap: 16px; margin-bottom: 20px; }
        .card { background: #fff; padding: 16px 20px; border-radius: 8px; box-shadow: 0 1px 4px rgba(0,0,0,0.1); }
        .card p { margin: 6px 0; }
        .card .label { color: #777; font-size: 12px; text-transform: uppercase; }
        .stat { font-size: 26px; font-weight: bold; color: #E4002B; }
        table { width: 100%; background: #fff; border-collapse: collapse; box-shadow: 0 1px 4px rgba(0,0,0,0.1); }
        th, td { padding: 10px 12px; text-align: left; border-bottom: 1px solid #eee; }
        th { background: #E4002B; color: #fff; }
    </style>
</head>
<body>
    <h1>🍔 Hot & Spice — Admin</h1>
    <nav>
        <div>
            <a href="/admin/dashboard">Dashboard</a>
            <a href="/admin/orders">Orders</a>
            <a href="/admin/menu">Menu</a>
            <a href="/admin/customers" class="active">Customers</a>
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

    <a href="/admin/customers" class="back-link">&larr; Back to Customers</a>

    <div class="grid">
        <div class="card">
            <p class="label">Customer</p>
            <h3>{{ $customer->name }}
                <span class="badge" style="background: {{ $customer->status === 'banned' ? '#b3001b' : '#43a047' }};">
                    {{ ucfirst($customer->status) }}
                </span>
            </h3>
            <p>{{ $customer->email }}</p>
            <p style="color:#777;">Joined {{ $customer->created_at->format('d M Y') }}</p>

            <form action="/admin/customers/{{ $customer->id }}/status" method="POST" style="margin-top:14px;" onsubmit="return confirm('{{ $customer->status === 'banned' ? 'Unban' : 'Ban' }} {{ $customer->name }}?');">
                @csrf
                <input type="hidden" name="return_to" value="{{ request()->getRequestUri() }}">
                <input type="hidden" name="status" value="{{ $customer->status === 'banned' ? 'active' : 'banned' }}">
                <button type="submit" class="{{ $customer->status === 'banned' ? '' : 'danger' }}">
                    {{ $customer->status === 'banned' ? 'Unban this customer' : 'Ban this customer' }}
                </button>
            </form>
        </div>
        <div class="card">
            <p class="label">Orders (excl. cancelled)</p>
            <p class="stat">{{ $customer->orders_count }}</p>
            <p class="label" style="margin-top:14px;">Total Spent</p>
            <p class="stat">Rs. {{ number_format($customer->total_spent ?? 0) }}</p>
        </div>
    </div>

    <h3>Order History</h3>
    <table>
        <tr>
            <th>Order #</th>
            <th>Date</th>
            <th>Status</th>
            <th>Total</th>
            <th></th>
        </tr>
        @forelse ($orders as $order)
        <tr>
            <td>{{ $order->order_number }}</td>
            <td>{{ $order->created_at->format('d M Y, h:i A') }}</td>
            <td>{{ ucfirst(str_replace('_', ' ', $order->status)) }}</td>
            <td>Rs. {{ number_format($order->total, 2) }}</td>
            <td><a href="/admin/orders/{{ $order->id }}" class="btn secondary">View</a></td>
        </tr>
        @empty
        <tr>
            <td colspan="5" style="text-align:center; color:#777;">No orders yet.</td>
        </tr>
        @endforelse
    </table>
</body>
</html>
