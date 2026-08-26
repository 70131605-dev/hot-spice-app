<!DOCTYPE html>
<html>
<head>
    <title>Hot & Spice — Reviews</title>
    <style>
        body { font-family: Arial, sans-serif; background: #f5f5f5; padding: 20px; }
        h1 { color: #E4002B; }
        nav { margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
        nav a { color: #E4002B; font-weight: bold; text-decoration: none; margin-right: 20px; }
        nav a.active { text-decoration: underline; }
        .admin-info { font-size: 13px; color: #555; }
        .admin-info button { padding: 4px 10px; font-size: 12px; margin-left: 10px; }
        table { width: 100%; background: #fff; border-collapse: collapse; box-shadow: 0 1px 4px rgba(0,0,0,0.1); }
        th, td { padding: 10px 12px; text-align: left; border-bottom: 1px solid #eee; vertical-align: top; }
        th { background: #E4002B; color: #fff; }
        button, .btn { background: #E4002B; color: #fff; border: none; padding: 6px 14px; border-radius: 6px; cursor: pointer; font-size: 13px; text-decoration: none; display: inline-block; }
        .btn.secondary { background: #777; }
        .btn.active { background: #333; }
        button.danger { background: #b3001b; }
        .row-actions { display: flex; gap: 6px; }
        .filter-tabs { margin-bottom: 16px; display: flex; gap: 6px; }
        .hidden-row { opacity: 0.5; }
        .stars { color: #ffb300; letter-spacing: 1px; }
        .comment { max-width: 320px; color: #333; }
        .meta { font-size: 12px; color: #777; }
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
            <a href="/admin/settings">Settings</a>
            <a href="/admin/reviews" class="active">Reviews</a>
        </div>
        <div class="admin-info">
            {{ Auth::guard('admin')->user()->name }}
            <form action="/admin/logout" method="POST" style="display:inline;">
                @csrf
                <button type="submit">Logout</button>
            </form>
        </div>
    </nav>

    <div class="filter-tabs">
        <a href="/admin/reviews?filter=visible" class="btn {{ request('filter', 'visible') === 'visible' ? 'active' : 'secondary' }}">Visible</a>
        <a href="/admin/reviews?filter=hidden" class="btn {{ request('filter') === 'hidden' ? 'active' : 'secondary' }}">Hidden</a>
        <a href="/admin/reviews?filter=all" class="btn {{ request('filter') === 'all' ? 'active' : 'secondary' }}">All</a>
    </div>

    <table>
        <tr>
            <th style="width:100px">Rating</th>
            <th style="width:160px">Item</th>
            <th>Comment</th>
            <th style="width:160px">Customer / Order</th>
            <th style="width:70px">Status</th>
            <th style="width:150px">Actions</th>
        </tr>
        @forelse ($reviews as $review)
        <tr class="{{ $review->is_hidden ? 'hidden-row' : '' }}">
            <td><span class="stars">{{ str_repeat('★', $review->rating) }}{{ str_repeat('☆', 5 - $review->rating) }}</span></td>
            <td>{{ $review->menuItem->name }}</td>
            <td class="comment">{{ $review->comment ?: '—' }}</td>
            <td>
                {{ $review->user->name ?? 'Deleted user' }}<br>
                <a href="/admin/orders/{{ $review->order_id }}" class="meta">{{ $review->order->order_number }}</a>
                <div class="meta">{{ $review->created_at->format('d M Y') }}</div>
            </td>
            <td>{{ $review->is_hidden ? 'Hidden' : 'Visible' }}</td>
            <td class="row-actions">
                <form action="/admin/reviews/{{ $review->id }}/toggle-hidden" method="POST">
                    @csrf
                    <button type="submit" class="secondary">{{ $review->is_hidden ? 'Unhide' : 'Hide' }}</button>
                </form>
                <form action="/admin/reviews/{{ $review->id }}/delete" method="POST" onsubmit="return confirm('Permanently delete this review?');">
                    @csrf
                    <button type="submit" class="danger">Delete</button>
                </form>
            </td>
        </tr>
        @empty
        <tr>
            <td colspan="6" style="text-align:center; color:#777;">No reviews in this view.</td>
        </tr>
        @endforelse
    </table>
</body>
</html>
