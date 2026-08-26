<!DOCTYPE html>
<html>
<head>
    <title>Hot & Spice — Dashboard</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4"></script>
    <style>
        body { font-family: Arial, sans-serif; background: #f5f5f5; padding: 20px; }
        h1 { color: #E4002B; }
        h2 { color: #333; margin-top: 40px; }
        nav { margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
        nav a { color: #E4002B; font-weight: bold; text-decoration: none; margin-right: 20px; }
        nav a.active { text-decoration: underline; }
        .admin-info { font-size: 13px; color: #555; }
        .admin-info button { padding: 4px 10px; font-size: 12px; margin-left: 10px; }
        button, .btn { background: #E4002B; color: #fff; border: none; padding: 6px 14px; border-radius: 6px; cursor: pointer; font-size: 13px; text-decoration: none; display: inline-block; }
        .btn.secondary { background: #777; }
        .btn.active { background: #333; }
        .stat-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px; }
        .stat-card { background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 1px 4px rgba(0,0,0,0.1); }
        .stat-card .label { color: #777; font-size: 13px; text-transform: uppercase; margin: 0 0 8px; }
        .stat-card .value { font-size: 32px; font-weight: bold; color: #E4002B; margin: 0; }
        .card { background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 1px 4px rgba(0,0,0,0.1); margin-bottom: 24px; }
        table { width: 100%; background: #fff; border-collapse: collapse; box-shadow: 0 1px 4px rgba(0,0,0,0.1); }
        th, td { padding: 10px 12px; text-align: left; border-bottom: 1px solid #eee; }
        th { background: #E4002B; color: #fff; }
        .toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
        .period-toggle { display: flex; gap: 6px; }
    </style>
</head>
<body>
    <h1>🍔 Hot & Spice — Admin</h1>
    <nav>
        <div>
            <a href="/admin/dashboard" class="active">Dashboard</a>
            <a href="/admin/orders">Orders</a>
            <a href="/admin/menu">Menu</a>
            <a href="/admin/customers">Customers</a>
            <a href="/admin/coupons">Coupons</a>
            <a href="/admin/riders">Riders</a>
            <a href="/admin/settings">Settings</a>
            <a href="/admin/reviews">Reviews</a>
        </div>
        <div class="admin-info">
            {{ Auth::guard('admin')->user()->name }}
            <form action="/admin/logout" method="POST" style="display:inline;">
                @csrf
                <button type="submit">Logout</button>
            </form>
        </div>
    </nav>

    <div class="stat-row">
        <div class="stat-card">
            <p class="label">Today's Revenue</p>
            <p class="value">Rs. {{ number_format($todayRevenue) }}</p>
        </div>
        <div class="stat-card">
            <p class="label">Today's Orders</p>
            <p class="value">{{ $todayOrderCount }}</p>
        </div>
        <div class="stat-card">
            <p class="label">Pending Orders</p>
            <p class="value">{{ $pendingCount }}</p>
        </div>
    </div>

    <h2>Revenue — Last 7 Days</h2>
    <div class="card">
        <canvas id="revenueChart" height="80"></canvas>
    </div>

    <div class="toolbar">
        <h2 style="margin:0;">Best-Selling Items</h2>
        <div class="period-toggle">
            <a href="/admin/dashboard?period=7" class="btn {{ $days === 7 ? 'active' : 'secondary' }}">Last 7 days</a>
            <a href="/admin/dashboard?period=30" class="btn {{ $days === 30 ? 'active' : 'secondary' }}">Last 30 days</a>
        </div>
    </div>
    <table>
        <tr>
            <th>Item</th>
            <th style="width:160px">Quantity Sold</th>
        </tr>
        @forelse ($topItems as $item)
        <tr>
            <td>{{ $item->item_name }}</td>
            <td>{{ $item->total_qty }}</td>
        </tr>
        @empty
        <tr>
            <td colspan="2" style="text-align:center; color:#777;">No sales in this period.</td>
        </tr>
        @endforelse
    </table>

    <script>
        new Chart(document.getElementById('revenueChart'), {
            type: 'line',
            data: {
                labels: @json($chartLabels),
                datasets: [{
                    label: 'Revenue (Rs.)',
                    data: @json($chartData),
                    borderColor: '#E4002B',
                    backgroundColor: 'rgba(228, 0, 43, 0.1)',
                    tension: 0.2,
                    fill: true,
                }]
            },
            options: {
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true } }
            }
        });
    </script>
</body>
</html>
