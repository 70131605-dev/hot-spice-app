<!DOCTYPE html>
<html>
<head>
    <title>Hot & Spice — Riders</title>
    <style>
        body { font-family: Arial, sans-serif; background: #f5f5f5; padding: 20px; }
        h1 { color: #E4002B; }
        h2 { color: #333; margin-top: 40px; }
        h3 { color: #333; margin: 0 0 8px; }
        nav { margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
        nav a { color: #E4002B; font-weight: bold; text-decoration: none; margin-right: 20px; }
        nav a.active { text-decoration: underline; }
        .admin-info { font-size: 13px; color: #555; }
        .admin-info button { padding: 4px 10px; font-size: 12px; margin-left: 10px; }
        table { width: 100%; background: #fff; border-collapse: collapse; box-shadow: 0 1px 4px rgba(0,0,0,0.1); margin-bottom: 20px; }
        th, td { padding: 10px 12px; text-align: left; border-bottom: 1px solid #eee; vertical-align: middle; }
        th { background: #E4002B; color: #fff; }
        input[type=text] { padding: 6px 8px; border: 1px solid #ccc; border-radius: 6px; width: 100%; box-sizing: border-box; }
        button, .btn { background: #E4002B; color: #fff; border: none; padding: 6px 14px; border-radius: 6px; cursor: pointer; font-size: 13px; text-decoration: none; display: inline-block; }
        button.danger { background: #b3001b; }
        .row-actions { display: flex; gap: 6px; }
        .add-card { background: #fff; padding: 16px; border-radius: 8px; box-shadow: 0 1px 4px rgba(0,0,0,0.1); margin-bottom: 30px; }
        .add-card h3 { margin-top: 0; }
        .add-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 10px; align-items: end; }
        .add-grid label { font-size: 12px; color: #555; display: block; margin-bottom: 4px; }
        .inactive { opacity: 0.5; }
        .flash-error { background: #ffe3e3; color: #b3001b; padding: 10px 16px; border-radius: 8px; margin-bottom: 16px; font-weight: bold; }
        .field-errors { background: #ffe3e3; color: #b3001b; padding: 10px 16px; border-radius: 8px; margin-bottom: 16px; }
        .field-errors ul { margin: 0; padding-left: 20px; }
        .board { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px; }
        .board-card { background: #fff; padding: 16px; border-radius: 8px; box-shadow: 0 1px 4px rgba(0,0,0,0.1); }
        .board-card ul { list-style: none; padding: 0; margin: 0; }
        .board-card li { padding: 8px 0; border-bottom: 1px solid #eee; font-size: 13px; }
        .board-card li:last-child { border-bottom: none; }
        .board-card li a { color: #E4002B; font-weight: bold; text-decoration: none; }
        .badge { padding: 2px 8px; border-radius: 10px; color: #fff; font-size: 11px; font-weight: bold; }
        .empty { color: #999; font-size: 13px; }
        .unassigned-card { border: 2px solid #ffb300; }
    </style>
</head>
<body>
    <h1>🍔 Hot & Spice — Admin</h1>
    <nav>
        <div>
            <a href="/admin/dashboard">Dashboard</a>
            <a href="/admin/orders">Orders</a>
            <a href="/admin/menu">Menu</a>
            <a href="/admin/customers">Customers</a>
            <a href="/admin/coupons">Coupons</a>
            <a href="/admin/riders" class="active">Riders</a>
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

    @if (session('error'))
        <div class="flash-error">{{ session('error') }}</div>
    @endif

    @if ($errors->any())
        <div class="field-errors">
            <ul>
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    <div class="add-card">
        <h3>Add Rider</h3>
        <form action="/admin/riders" method="POST" class="add-grid">
            @csrf
            <div>
                <label>Name</label>
                <input type="text" name="name" value="{{ old('name') }}" required>
            </div>
            <div>
                <label>Phone</label>
                <input type="text" name="phone" value="{{ old('phone') }}" required>
            </div>
            <div>
                <button type="submit">Add Rider</button>
            </div>
        </form>
    </div>

    @foreach ($riders as $rider)
        <form id="rider-form-{{ $rider->id }}" action="/admin/riders/{{ $rider->id }}" method="POST" style="display:none;">
            @csrf
        </form>
        <form id="rider-delete-{{ $rider->id }}" action="/admin/riders/{{ $rider->id }}/delete" method="POST" style="display:none;" onsubmit="return confirm('Delete {{ $rider->name }}?');">
            @csrf
        </form>
    @endforeach

    <table>
        <tr>
            <th>Name</th>
            <th>Phone</th>
            <th style="width:120px">Active Orders</th>
            <th style="width:70px">Active</th>
            <th style="width:150px">Actions</th>
        </tr>
        @forelse ($riders as $rider)
        @php $fid = 'rider-form-' . $rider->id; @endphp
        <tr class="{{ $rider->is_active ? '' : 'inactive' }}">
            <td><input type="text" name="name" value="{{ $rider->name }}" form="{{ $fid }}" required></td>
            <td><input type="text" name="phone" value="{{ $rider->phone }}" form="{{ $fid }}" required></td>
            <td>{{ $rider->active_orders_count }}</td>
            <td><input type="checkbox" name="is_active" form="{{ $fid }}" {{ $rider->is_active ? 'checked' : '' }}></td>
            <td class="row-actions">
                <button type="submit" form="{{ $fid }}">Save</button>
                <button type="submit" form="rider-delete-{{ $rider->id }}" class="danger">Delete</button>
            </td>
        </tr>
        @empty
        <tr>
            <td colspan="5" style="text-align:center; color:#777;">No riders yet.</td>
        </tr>
        @endforelse
    </table>

    <h2>Active Deliveries</h2>
    <div class="board">
        @forelse ($activeDeliveries as $riderId => $orders)
        <div class="board-card">
            <h3>{{ $orders->first()->rider->name }}</h3>
            <ul>
                @foreach ($orders as $order)
                <li>
                    <a href="/admin/orders/{{ $order->id }}">{{ $order->order_number }}</a> — {{ $order->user->name }}<br>
                    <span class="badge" style="background:#00897b;">{{ ucfirst(str_replace('_', ' ', $order->status)) }}</span>
                </li>
                @endforeach
            </ul>
        </div>
        @empty
        <p class="empty">No riders currently have active deliveries.</p>
        @endforelse

        @if ($unassigned->isNotEmpty())
        <div class="board-card unassigned-card">
            <h3>⚠️ Unassigned</h3>
            <ul>
                @foreach ($unassigned as $order)
                <li>
                    <a href="/admin/orders/{{ $order->id }}">{{ $order->order_number }}</a> — {{ $order->user->name }}<br>
                    <span class="badge" style="background:#ffb300;">{{ ucfirst(str_replace('_', ' ', $order->status)) }}</span>
                </li>
                @endforeach
            </ul>
        </div>
        @endif
    </div>
</body>
</html>
