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
        button, .btn { background: #E4002B; color: #fff; border: none; padding: 6px 14px; border-radius: 6px; cursor: pointer; font-size: 13px; text-decoration: none; display: inline-block; }
        .btn.secondary { background: #777; }
        .btn.danger { background: #b3001b; }
        .badge { padding: 4px 10px; border-radius: 12px; color: #fff; font-size: 12px; font-weight: bold; }
        nav { margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
        nav a { color: #E4002B; font-weight: bold; text-decoration: none; margin-right: 20px; }
        nav a.active { text-decoration: underline; }
        .admin-info { font-size: 13px; color: #555; }
        .admin-info button { padding: 4px 10px; font-size: 12px; margin-left: 10px; }
        .toolbar { margin-bottom: 16px; }
        .filter-bar { background: #fff; padding: 12px 16px; border-radius: 8px; box-shadow: 0 1px 4px rgba(0,0,0,0.1); display: flex; gap: 10px; align-items: end; }
        .filter-bar label { font-size: 12px; color: #555; display: block; margin-bottom: 4px; }
        .filter-bar input[type=text] { padding: 6px 8px; border: 1px solid #ccc; border-radius: 6px; }
        .row-actions { display: flex; gap: 6px; }
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

    <div class="toolbar">
        <form method="GET" action="/admin/customers" class="filter-bar">
            <div>
                <label>Search</label>
                <input type="text" name="search" placeholder="Name or email" value="{{ request('search') }}">
            </div>
            <div>
                <button type="submit">Search</button>
            </div>
            @if (request('search'))
                <div><a href="/admin/customers" class="btn secondary">Clear</a></div>
            @endif
        </form>
    </div>

    <table>
        <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Joined</th>
            <th>Orders</th>
            <th>Total Spent</th>
            <th>Status</th>
            <th></th>
        </tr>
        @forelse ($customers as $customer)
        <tr>
            <td>{{ $customer->name }}</td>
            <td>{{ $customer->email }}</td>
            <td>{{ $customer->created_at->format('d M Y') }}</td>
            <td>{{ $customer->orders_count }}</td>
            <td>Rs. {{ number_format($customer->total_spent ?? 0) }}</td>
            <td>
                <span class="badge" style="background: {{ $customer->status === 'banned' ? '#b3001b' : '#43a047' }};">
                    {{ ucfirst($customer->status) }}
                </span>
            </td>
            <td class="row-actions">
                <a href="/admin/customers/{{ $customer->id }}" class="btn secondary">View</a>
                <form action="/admin/customers/{{ $customer->id }}/status" method="POST" onsubmit="return confirm('{{ $customer->status === 'banned' ? 'Unban' : 'Ban' }} {{ $customer->name }}?');">
                    @csrf
                    <input type="hidden" name="return_to" value="{{ request()->getRequestUri() }}">
                    <input type="hidden" name="status" value="{{ $customer->status === 'banned' ? 'active' : 'banned' }}">
                    <button type="submit" class="{{ $customer->status === 'banned' ? '' : 'danger' }}">
                        {{ $customer->status === 'banned' ? 'Unban' : 'Ban' }}
                    </button>
                </form>
            </td>
        </tr>
        @empty
        <tr>
            <td colspan="7" style="text-align:center; color:#777;">No customers found.</td>
        </tr>
        @endforelse
    </table>
</body>
</html>
