<!DOCTYPE html>
<html>
<head>
    <title>Hot & Spice — Settings</title>
    <style>
        body { font-family: Arial, sans-serif; background: #f5f5f5; padding: 20px; }
        h1 { color: #E4002B; }
        nav { margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
        nav a { color: #E4002B; font-weight: bold; text-decoration: none; margin-right: 20px; }
        nav a.active { text-decoration: underline; }
        .admin-info { font-size: 13px; color: #555; }
        .admin-info button { padding: 4px 10px; font-size: 12px; margin-left: 10px; }
        .card { background: #fff; padding: 24px; border-radius: 8px; box-shadow: 0 1px 4px rgba(0,0,0,0.1); max-width: 560px; }
        label { font-size: 13px; color: #555; display: block; margin-bottom: 4px; margin-top: 16px; }
        input[type=text], input[type=time], input[type=number] { width: 100%; padding: 8px 10px; border: 1px solid #ccc; border-radius: 6px; box-sizing: border-box; }
        .hours-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        button { background: #E4002B; color: #fff; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; margin-top: 24px; font-size: 15px; }
        .field-errors { background: #ffe3e3; color: #b3001b; padding: 10px 16px; border-radius: 8px; margin-bottom: 16px; }
        .field-errors ul { margin: 0; padding-left: 20px; }
        .status-toggle { margin-top: 16px; padding: 16px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center; }
        .status-toggle.open { background: #e8f5e9; border: 2px solid #43a047; }
        .status-toggle.closed { background: #ffe3e3; border: 2px solid #b3001b; }
        .status-toggle .label { font-size: 16px; font-weight: bold; }
        .status-toggle.open .label { color: #2e7d32; }
        .status-toggle.closed .label { color: #b3001b; }
        .switch { position: relative; display: inline-block; width: 50px; height: 28px; }
        .switch input { opacity: 0; width: 0; height: 0; }
        .slider { position: absolute; cursor: pointer; inset: 0; background-color: #ccc; transition: .2s; border-radius: 28px; }
        .slider:before { position: absolute; content: ""; height: 20px; width: 20px; left: 4px; bottom: 4px; background-color: #fff; transition: .2s; border-radius: 50%; }
        input:checked + .slider { background-color: #43a047; }
        input:checked + .slider:before { transform: translateX(22px); }
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
            <a href="/admin/riders">Riders</a>
            <a href="/admin/settings" class="active">Settings</a>
        </div>
        <div class="admin-info">
            {{ Auth::guard('admin')->user()->name }}
            <form action="/admin/logout" method="POST" style="display:inline;">
                @csrf
                <button type="submit">Logout</button>
            </form>
        </div>
    </nav>

    @if ($errors->any())
        <div class="field-errors">
            <ul>
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    <div class="card">
        <form action="/admin/settings" method="POST">
            @csrf

            <div class="status-toggle {{ $settings->is_accepting_orders ? 'open' : 'closed' }}">
                <span class="label">{{ $settings->is_accepting_orders ? '🟢 Currently Accepting Orders' : '🔴 Currently Closed' }}</span>
                <label class="switch">
                    <input type="checkbox" name="is_accepting_orders" {{ $settings->is_accepting_orders ? 'checked' : '' }}>
                    <span class="slider"></span>
                </label>
            </div>

            <label>Store Name</label>
            <input type="text" name="store_name" value="{{ old('store_name', $settings->store_name) }}" required>

            <label>Hours (for display only — does not auto-close the store)</label>
            <div class="hours-row">
                <input type="time" name="opening_time" value="{{ old('opening_time', $settings->opening_time ? \Carbon\Carbon::parse($settings->opening_time)->format('H:i') : '') }}">
                <input type="time" name="closing_time" value="{{ old('closing_time', $settings->closing_time ? \Carbon\Carbon::parse($settings->closing_time)->format('H:i') : '') }}">
            </div>

            <label>Delivery Fee (Rs.)</label>
            <input type="number" step="0.01" name="delivery_fee" value="{{ old('delivery_fee', $settings->delivery_fee) }}" required>

            <label>Minimum Order Value (Rs.)</label>
            <input type="number" step="0.01" name="min_order_value" value="{{ old('min_order_value', $settings->min_order_value) }}" required>

            <button type="submit">Save Settings</button>
        </form>
    </div>
</body>
</html>
