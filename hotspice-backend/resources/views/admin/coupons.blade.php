<!DOCTYPE html>
<html>
<head>
    <title>Hot & Spice — Coupons</title>
    <style>
        body { font-family: Arial, sans-serif; background: #f5f5f5; padding: 20px; }
        h1 { color: #E4002B; }
        nav { margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
        nav a { color: #E4002B; font-weight: bold; text-decoration: none; margin-right: 20px; }
        nav a.active { text-decoration: underline; }
        .admin-info { font-size: 13px; color: #555; }
        .admin-info button { padding: 4px 10px; font-size: 12px; margin-left: 10px; }
        table { width: 100%; background: #fff; border-collapse: collapse; box-shadow: 0 1px 4px rgba(0,0,0,0.1); }
        th, td { padding: 10px 12px; text-align: left; border-bottom: 1px solid #eee; vertical-align: middle; }
        th { background: #E4002B; color: #fff; }
        input[type=text], input[type=number], input[type=date], select { padding: 6px 8px; border: 1px solid #ccc; border-radius: 6px; width: 100%; box-sizing: border-box; }
        button, .btn { background: #E4002B; color: #fff; border: none; padding: 6px 14px; border-radius: 6px; cursor: pointer; font-size: 13px; }
        button.danger { background: #b3001b; }
        .row-actions { display: flex; gap: 6px; }
        .add-card { background: #fff; padding: 16px; border-radius: 8px; box-shadow: 0 1px 4px rgba(0,0,0,0.1); margin-bottom: 30px; }
        .add-card h3 { margin-top: 0; }
        .add-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 10px; align-items: end; }
        .add-grid label { font-size: 12px; color: #555; display: block; margin-bottom: 4px; }
        .inactive { opacity: 0.5; }
        .flash-error { background: #ffe3e3; color: #b3001b; padding: 10px 16px; border-radius: 8px; margin-bottom: 16px; font-weight: bold; }
        .field-errors { background: #ffe3e3; color: #b3001b; padding: 10px 16px; border-radius: 8px; margin-bottom: 16px; }
        .field-errors ul { margin: 0; padding-left: 20px; }
        code { background: #f0f0f0; padding: 2px 6px; border-radius: 4px; }
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
            <a href="/admin/coupons" class="active">Coupons</a>
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
        <h3>Add Coupon</h3>
        <form action="/admin/coupons" method="POST" class="add-grid">
            @csrf
            <div>
                <label>Code</label>
                <input type="text" name="code" value="{{ old('code') }}" placeholder="SAVE20" required>
            </div>
            <div>
                <label>Type</label>
                <select name="discount_type">
                    <option value="percentage" {{ old('discount_type') === 'percentage' ? 'selected' : '' }}>Percentage</option>
                    <option value="fixed" {{ old('discount_type') === 'fixed' ? 'selected' : '' }}>Fixed (Rs.)</option>
                </select>
            </div>
            <div>
                <label>Value</label>
                <input type="number" step="0.01" name="discount_value" value="{{ old('discount_value') }}" required>
            </div>
            <div>
                <label>Min Order (Rs.)</label>
                <input type="number" step="0.01" name="min_order_value" value="{{ old('min_order_value', 0) }}">
            </div>
            <div>
                <label>Expires</label>
                <input type="date" name="expires_at" value="{{ old('expires_at') }}">
            </div>
            <div>
                <label>Usage Limit</label>
                <input type="number" name="usage_limit" value="{{ old('usage_limit') }}" placeholder="Unlimited">
            </div>
            <div>
                <button type="submit">Add Coupon</button>
            </div>
        </form>
    </div>

    @foreach ($coupons as $coupon)
        <form id="coupon-form-{{ $coupon->id }}" action="/admin/coupons/{{ $coupon->id }}" method="POST" style="display:none;">
            @csrf
        </form>
        <form id="coupon-delete-{{ $coupon->id }}" action="/admin/coupons/{{ $coupon->id }}/delete" method="POST" style="display:none;" onsubmit="return confirm('Delete coupon {{ $coupon->code }}?');">
            @csrf
        </form>
    @endforeach

    <table>
        <tr>
            <th>Code</th>
            <th style="width:110px">Type</th>
            <th style="width:100px">Value</th>
            <th style="width:110px">Min Order</th>
            <th style="width:130px">Expires</th>
            <th style="width:110px">Usage</th>
            <th style="width:70px">Active</th>
            <th style="width:150px">Actions</th>
        </tr>
        @forelse ($coupons as $coupon)
        @php $fid = 'coupon-form-' . $coupon->id; @endphp
        <tr class="{{ $coupon->is_active ? '' : 'inactive' }}">
            <td><input type="text" name="code" value="{{ $coupon->code }}" form="{{ $fid }}" required></td>
            <td>
                <select name="discount_type" form="{{ $fid }}">
                    <option value="percentage" {{ $coupon->discount_type === 'percentage' ? 'selected' : '' }}>Percentage</option>
                    <option value="fixed" {{ $coupon->discount_type === 'fixed' ? 'selected' : '' }}>Fixed (Rs.)</option>
                </select>
            </td>
            <td><input type="number" step="0.01" name="discount_value" value="{{ $coupon->discount_value }}" form="{{ $fid }}"></td>
            <td><input type="number" step="0.01" name="min_order_value" value="{{ $coupon->min_order_value }}" form="{{ $fid }}"></td>
            <td><input type="date" name="expires_at" value="{{ $coupon->expires_at?->format('Y-m-d') }}" form="{{ $fid }}"></td>
            <td>
                <input type="number" name="usage_limit" value="{{ $coupon->usage_limit }}" placeholder="Unlimited" form="{{ $fid }}">
                <div style="font-size:11px; color:#777; margin-top:2px;">{{ $coupon->times_used }} used</div>
            </td>
            <td><input type="checkbox" name="is_active" form="{{ $fid }}" {{ $coupon->is_active ? 'checked' : '' }}></td>
            <td class="row-actions">
                <button type="submit" form="{{ $fid }}">Save</button>
                <button type="submit" form="coupon-delete-{{ $coupon->id }}" class="danger">Delete</button>
            </td>
        </tr>
        @empty
        <tr>
            <td colspan="8" style="text-align:center; color:#777;">No coupons yet.</td>
        </tr>
        @endforelse
    </table>
</body>
</html>
