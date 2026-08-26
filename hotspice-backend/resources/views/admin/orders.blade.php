<!DOCTYPE html>
<html>
<head>
    <title>Hot & Spice — Admin</title>
    <style>
        body { font-family: Arial, sans-serif; background: #f5f5f5; padding: 20px; }
        h1 { color: #E4002B; }
        table { width: 100%; background: #fff; border-collapse: collapse; box-shadow: 0 1px 4px rgba(0,0,0,0.1); }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #eee; }
        th { background: #E4002B; color: #fff; }
        select { padding: 6px 10px; border-radius: 6px; }
        button, .btn { background: #E4002B; color: #fff; border: none; padding: 6px 14px; border-radius: 6px; cursor: pointer; font-size: 13px; text-decoration: none; display: inline-block; }
        .btn.secondary { background: #777; }
        .btn.active { background: #333; }
        .badge { padding: 4px 10px; border-radius: 12px; color: #fff; font-size: 12px; font-weight: bold; }
        .badge-new { background: #ffb300; color: #fff; padding: 2px 8px; border-radius: 10px; font-size: 11px; font-weight: bold; margin-left: 8px; }
        nav { margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
        nav a { color: #E4002B; font-weight: bold; text-decoration: none; margin-right: 20px; }
        nav a.active { text-decoration: underline; }
        .admin-info { font-size: 13px; color: #555; }
        .admin-info button { padding: 4px 10px; font-size: 12px; margin-left: 10px; }
        .toolbar { display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 10px; margin-bottom: 16px; }
        .filter-bar { background: #fff; padding: 12px 16px; border-radius: 8px; box-shadow: 0 1px 4px rgba(0,0,0,0.1); display: flex; gap: 10px; align-items: end; flex-wrap: wrap; }
        .filter-bar label { font-size: 12px; color: #555; display: block; margin-bottom: 4px; }
        .filter-bar input[type=text], .filter-bar input[type=date] { padding: 6px 8px; border: 1px solid #ccc; border-radius: 6px; }
        .refresh-bar { display: flex; gap: 6px; }
        .new-banner { background: #fff3cd; color: #856404; padding: 10px 16px; border-radius: 8px; margin-bottom: 16px; font-weight: bold; }
    </style>
    @if (request('auto'))
        <script>setTimeout(function () { window.location.reload(); }, 30000);</script>
    @endif
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

    @php
        $newCount = $lastSeenId > 0 ? $orders->where('id', '>', $lastSeenId)->count() : 0;
        $statusColors = [
            'pending' => '#ffb300',
            'confirmed' => '#1e88e5',
            'preparing' => '#8e24aa',
            'out_for_delivery' => '#00897b',
            'delivered' => '#43a047',
            'cancelled' => '#757575',
        ];
    @endphp

    @if ($newCount > 0)
        <div class="new-banner">🔔 {{ $newCount }} new order(s) since your last visit</div>
    @endif

    <div class="toolbar">
        <form method="GET" action="/admin/orders" class="filter-bar">
            <div>
                <label>Status</label>
                <select name="status">
                    <option value="">All Statuses</option>
                    @foreach (['pending','confirmed','preparing','out_for_delivery','delivered','cancelled'] as $status)
                        <option value="{{ $status }}" {{ request('status') === $status ? 'selected' : '' }}>
                            {{ ucfirst(str_replace('_', ' ', $status)) }}
                        </option>
                    @endforeach
                </select>
            </div>
            <div>
                <label>From</label>
                <input type="date" name="date_from" value="{{ request('date_from') }}">
            </div>
            <div>
                <label>To</label>
                <input type="date" name="date_to" value="{{ request('date_to') }}">
            </div>
            <div>
                <label>Search</label>
                <input type="text" name="search" placeholder="Order # or customer" value="{{ request('search') }}">
            </div>
            <div>
                <button type="submit">Filter</button>
            </div>
            @if (request('status') || request('date_from') || request('date_to') || request('search'))
                <div><a href="/admin/orders" class="btn secondary">Clear</a></div>
            @endif
        </form>

        <div class="refresh-bar">
            <a href="{{ request()->fullUrlWithQuery(['auto' => null]) }}" class="btn {{ ! request('auto') ? 'active' : 'secondary' }}">Manual</a>
            <a href="{{ request()->fullUrlWithQuery(['auto' => 1]) }}" class="btn {{ request('auto') ? 'active' : 'secondary' }}">Auto-refresh (30s)</a>
            <a href="{{ request()->fullUrlWithQuery([]) }}" class="btn secondary">Refresh Now</a>
        </div>
    </div>

    <table>
        <tr>
            <th>Order #</th>
            <th>Customer</th>
            <th>Items</th>
            <th>Total</th>
            <th>Type</th>
            <th>Status</th>
            <th>Update</th>
            <th></th>
        </tr>
        @forelse ($orders as $order)
        <tr>
            <td>
                {{ $order->order_number }}
                @if ($lastSeenId > 0 && $order->id > $lastSeenId)
                    <span class="badge-new">NEW</span>
                @endif
            </td>
            <td>{{ $order->user->name }}</td>
            <td>
                @foreach ($order->items as $item)
                    {{ $item->quantity }}x {{ $item->item_name }}<br>
                @endforeach
            </td>
            <td>Rs. {{ number_format($order->total) }}</td>
            <td>{{ ucfirst($order->order_type) }}</td>
            <td><span class="badge" style="background: {{ $statusColors[$order->status] ?? '#999' }};">{{ ucfirst(str_replace('_', ' ', $order->status)) }}</span></td>
            <td>
                <form action="/admin/orders/{{ $order->id }}/status" method="POST">
                    @csrf
                    <input type="hidden" name="return_to" value="{{ request()->getRequestUri() }}">
                    <select name="status">
                        @foreach (['pending','confirmed','preparing','out_for_delivery','delivered','cancelled'] as $status)
                            <option value="{{ $status }}" {{ $order->status === $status ? 'selected' : '' }}>
                                {{ ucfirst(str_replace('_', ' ', $status)) }}
                            </option>
                        @endforeach
                    </select>
                    <button type="submit">Update</button>
                </form>
            </td>
            <td><a href="/admin/orders/{{ $order->id }}" class="btn secondary">View</a></td>
        </tr>
        @empty
        <tr>
            <td colspan="8" style="text-align:center; color:#777;">No orders match these filters.</td>
        </tr>
        @endforelse
    </table>
</body>
</html>
