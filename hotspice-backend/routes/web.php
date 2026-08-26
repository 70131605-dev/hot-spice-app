<?php

use App\Http\Controllers\Admin\AdminAuthController;
use App\Models\Category;
use App\Models\Coupon;
use App\Models\MenuItem;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Review;
use App\Models\Rider;
use App\Models\Settings;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

/**
 * Slugify $source and, if it collides with another row, append -2, -3, ...
 * until it's unique. Pass $ignoreId when updating a row so it doesn't
 * collide with its own current slug.
 */
function unique_slug(string $modelClass, string $source, ?int $ignoreId = null): string
{
    $base = Str::slug($source);
    $slug = $base;
    $i = 1;

    while ($modelClass::where('slug', $slug)->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))->exists()) {
        $slug = $base . '-' . $i++;
    }

    return $slug;
}

Route::get('/', function () {
    return view('welcome');
});

Route::get('/admin/login', [AdminAuthController::class, 'showLogin']);
Route::post('/admin/login', [AdminAuthController::class, 'login'])->middleware('throttle:5,1');
Route::post('/admin/logout', [AdminAuthController::class, 'logout']);

Route::middleware('admin.auth')->group(function () {
    Route::get('/admin/dashboard', function (Request $request) {
        $todayStart = now()->startOfDay();

        $todayRevenue = Order::where('created_at', '>=', $todayStart)
            ->where('status', '!=', 'cancelled')
            ->sum('total');

        $todayOrderCount = Order::where('created_at', '>=', $todayStart)->count();

        $pendingCount = Order::where('status', 'pending')->count();

        $days = (int) $request->input('period', 7) === 30 ? 30 : 7;

        $topItems = OrderItem::join('orders', 'orders.id', '=', 'order_items.order_id')
            ->where('orders.status', '!=', 'cancelled')
            ->where('orders.created_at', '>=', now()->subDays($days))
            ->groupBy('order_items.item_name')
            ->selectRaw('order_items.item_name, SUM(order_items.quantity) as total_qty')
            ->orderByDesc('total_qty')
            ->limit(10)
            ->get();

        $dailyRevenue = Order::where('created_at', '>=', now()->subDays(6)->startOfDay())
            ->where('status', '!=', 'cancelled')
            ->selectRaw('DATE(created_at) as day, SUM(total) as revenue')
            ->groupBy('day')
            ->pluck('revenue', 'day');

        $chartLabels = [];
        $chartData = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i);
            $chartLabels[] = $date->format('D, M j');
            $chartData[] = (float) ($dailyRevenue[$date->format('Y-m-d')] ?? 0);
        }

        return view('admin.dashboard', compact(
            'todayRevenue', 'todayOrderCount', 'pendingCount',
            'topItems', 'days', 'chartLabels', 'chartData'
        ));
    });

    Route::get('/admin/orders', function (Request $request) {
        $query = Order::with('items', 'user');

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('order_number', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($uq) use ($search) {
                        $uq->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    });
            });
        }

        $orders = $query->orderByDesc('created_at')->get();

        $lastSeenId = (int) session('admin.last_seen_order_id', 0);
        session(['admin.last_seen_order_id' => (int) (Order::max('id') ?? 0)]);

        return view('admin.orders', compact('orders', 'lastSeenId'));
    });

    Route::get('/admin/orders/{id}', function ($id) {
        $order = Order::with('items', 'user', 'rider')->findOrFail($id);
        $riders = Rider::where('is_active', true)->orderBy('name')->get();
        return view('admin.order-detail', compact('order', 'riders'));
    });

    Route::post('/admin/orders/{id}/status', function (Request $request, $id) {
        $order = Order::findOrFail($id);
        $order->update(['status' => $request->status]);

        $returnTo = $request->input('return_to');
        if (! $returnTo || ! str_starts_with($returnTo, '/admin/')) {
            $returnTo = '/admin/orders';
        }

        return redirect($returnTo);
    });

    Route::post('/admin/orders/{id}/rider', function (Request $request, $id) {
        $order = Order::findOrFail($id);

        $order->update([
            'rider_id' => $request->filled('rider_id') ? $request->rider_id : null,
        ]);

        return redirect("/admin/orders/{$id}");
    });

    Route::get('/admin/menu', function () {
        $categories = Category::orderBy('sort_order')->get();
        $menuItems = MenuItem::with('category')->orderByDesc('created_at')->get();
        return view('admin.menu', compact('categories', 'menuItems'));
    });

    Route::post('/admin/menu/categories', function (Request $request) {
        $request->merge([
            'sort_order' => $request->filled('sort_order')
                ? (int) $request->sort_order
                : (int) (Category::max('sort_order') ?? -1) + 1,
        ]);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255',
            'sort_order' => 'required|integer|unique:categories,sort_order',
            'description' => 'nullable|string',
        ]);

        Category::create([
            'name' => $validated['name'],
            'slug' => unique_slug(Category::class, $validated['slug'] ?? $validated['name']),
            'description' => $validated['description'] ?? null,
            'sort_order' => $validated['sort_order'],
            'is_active' => true,
        ]);

        return redirect('/admin/menu');
    });

    Route::post('/admin/menu/categories/{id}', function (Request $request, $id) {
        $category = Category::findOrFail($id);

        $request->merge([
            'sort_order' => $request->filled('sort_order') ? (int) $request->sort_order : $category->sort_order,
        ]);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255',
            'sort_order' => ['required', 'integer', Rule::unique('categories', 'sort_order')->ignore($category->id)],
        ]);

        $category->update([
            'name' => $validated['name'],
            'slug' => unique_slug(Category::class, $validated['slug'] ?? $validated['name'], $category->id),
            'sort_order' => $validated['sort_order'],
            'is_active' => $request->has('is_active'),
        ]);

        return redirect('/admin/menu');
    });

    Route::post('/admin/menu/categories/{id}/delete', function ($id) {
        $category = Category::findOrFail($id);

        if ($category->menuItems()->exists()) {
            return redirect('/admin/menu')->with('error', "Can't delete \"{$category->name}\" — it still has menu items. Move or delete them first.");
        }

        $category->delete();
        return redirect('/admin/menu');
    });

    Route::post('/admin/menu/items', function (Request $request) {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'image' => 'nullable|url|max:2048',
            'calories' => 'nullable|integer|min:0',
        ]);

        MenuItem::create([
            'category_id' => $validated['category_id'],
            'name' => $validated['name'],
            'slug' => unique_slug(MenuItem::class, $validated['name']),
            'description' => $validated['description'] ?? null,
            'price' => $validated['price'],
            'image' => $validated['image'] ?? null,
            'calories' => $validated['calories'] ?? null,
            'is_available' => true,
            'is_featured' => false,
        ]);

        return redirect('/admin/menu');
    });

    Route::post('/admin/menu/items/{id}', function (Request $request, $id) {
        $item = MenuItem::findOrFail($id);

        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'image' => 'nullable|url|max:2048',
            'calories' => 'nullable|integer|min:0',
        ]);

        $item->update([
            'category_id' => $validated['category_id'],
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'price' => $validated['price'],
            'image' => $validated['image'] ?? null,
            'calories' => $validated['calories'] ?? null,
            'is_available' => $request->has('is_available'),
            'is_featured' => $request->has('is_featured'),
        ]);

        return redirect('/admin/menu');
    });

    Route::post('/admin/menu/items/{id}/delete', function ($id) {
        $item = MenuItem::findOrFail($id);

        if ($item->orderItems()->exists()) {
            return redirect('/admin/menu')->with('error', "Can't delete \"{$item->name}\" — it appears in past orders. Mark it unavailable instead to hide it from customers.");
        }

        $item->delete();
        return redirect('/admin/menu');
    });

    Route::get('/admin/customers', function (Request $request) {
        $query = User::withCount(['orders as orders_count' => function ($q) {
            $q->where('status', '!=', 'cancelled');
        }])->withSum(['orders as total_spent' => function ($q) {
            $q->where('status', '!=', 'cancelled');
        }], 'total');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $customers = $query->orderByDesc('created_at')->get();

        return view('admin.customers', compact('customers'));
    });

    Route::get('/admin/customers/{id}', function ($id) {
        $customer = User::withCount(['orders as orders_count' => function ($q) {
            $q->where('status', '!=', 'cancelled');
        }])->withSum(['orders as total_spent' => function ($q) {
            $q->where('status', '!=', 'cancelled');
        }], 'total')->findOrFail($id);

        $orders = Order::where('user_id', $id)->orderByDesc('created_at')->get();

        return view('admin.customer-detail', compact('customer', 'orders'));
    });

    Route::post('/admin/customers/{id}/status', function (Request $request, $id) {
        $customer = User::findOrFail($id);
        $newStatus = $request->status === 'banned' ? 'banned' : 'active';

        $customer->update(['status' => $newStatus]);

        if ($newStatus === 'banned') {
            $customer->tokens()->delete();
        }

        $returnTo = $request->input('return_to');
        if (! $returnTo || ! str_starts_with($returnTo, '/admin/')) {
            $returnTo = '/admin/customers';
        }

        return redirect($returnTo);
    });

    Route::get('/admin/coupons', function () {
        $coupons = Coupon::orderByDesc('created_at')->get();
        return view('admin.coupons', compact('coupons'));
    });

    Route::post('/admin/coupons', function (Request $request) {
        $validated = $request->validate([
            'code' => 'required|string|max:50|unique:coupons,code',
            'discount_type' => 'required|in:fixed,percentage',
            'discount_value' => 'required|numeric|min:0.01|max:1000000',
            'min_order_value' => 'nullable|numeric|min:0',
            'expires_at' => 'nullable|date',
            'usage_limit' => 'nullable|integer|min:1',
        ]);

        if ($validated['discount_type'] === 'percentage' && $validated['discount_value'] > 100) {
            return back()->withErrors(['discount_value' => 'A percentage discount cannot exceed 100.'])->withInput();
        }

        Coupon::create([
            'code' => strtoupper(trim($validated['code'])),
            'discount_type' => $validated['discount_type'],
            'discount_value' => $validated['discount_value'],
            'min_order_value' => $validated['min_order_value'] ?? 0,
            'expires_at' => $validated['expires_at'] ?? null,
            'usage_limit' => $validated['usage_limit'] ?? null,
            'is_active' => true,
        ]);

        return redirect('/admin/coupons');
    });

    Route::post('/admin/coupons/{id}', function (Request $request, $id) {
        $coupon = Coupon::findOrFail($id);

        $validated = $request->validate([
            'code' => ['required', 'string', 'max:50', Rule::unique('coupons', 'code')->ignore($coupon->id)],
            'discount_type' => 'required|in:fixed,percentage',
            'discount_value' => 'required|numeric|min:0.01|max:1000000',
            'min_order_value' => 'nullable|numeric|min:0',
            'expires_at' => 'nullable|date',
            'usage_limit' => 'nullable|integer|min:1',
        ]);

        if ($validated['discount_type'] === 'percentage' && $validated['discount_value'] > 100) {
            return back()->withErrors(['discount_value' => 'A percentage discount cannot exceed 100.'])->withInput();
        }

        $coupon->update([
            'code' => strtoupper(trim($validated['code'])),
            'discount_type' => $validated['discount_type'],
            'discount_value' => $validated['discount_value'],
            'min_order_value' => $validated['min_order_value'] ?? 0,
            'expires_at' => $validated['expires_at'] ?? null,
            'usage_limit' => $validated['usage_limit'] ?? null,
            'is_active' => $request->has('is_active'),
        ]);

        return redirect('/admin/coupons');
    });

    Route::post('/admin/coupons/{id}/delete', function ($id) {
        Coupon::findOrFail($id)->delete();
        return redirect('/admin/coupons');
    });

    Route::get('/admin/riders', function () {
        $riders = Rider::withCount(['orders as active_orders_count' => function ($q) {
            $q->whereNotIn('status', ['delivered', 'cancelled']);
        }])->orderBy('name')->get();

        $activeDeliveries = Order::with('user', 'rider')
            ->whereNotNull('rider_id')
            ->whereNotIn('status', ['delivered', 'cancelled'])
            ->orderBy('rider_id')
            ->get()
            ->groupBy('rider_id');

        $unassigned = Order::with('user')
            ->where('order_type', 'delivery')
            ->whereNull('rider_id')
            ->whereNotIn('status', ['delivered', 'cancelled'])
            ->orderByDesc('created_at')
            ->get();

        return view('admin.riders', compact('riders', 'activeDeliveries', 'unassigned'));
    });

    Route::post('/admin/riders', function (Request $request) {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:30',
        ]);

        Rider::create([
            'name' => $validated['name'],
            'phone' => $validated['phone'],
            'is_active' => true,
        ]);

        return redirect('/admin/riders');
    });

    Route::post('/admin/riders/{id}', function (Request $request, $id) {
        $rider = Rider::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:30',
        ]);

        $rider->update([
            'name' => $validated['name'],
            'phone' => $validated['phone'],
            'is_active' => $request->has('is_active'),
        ]);

        return redirect('/admin/riders');
    });

    Route::post('/admin/riders/{id}/delete', function ($id) {
        $rider = Rider::findOrFail($id);

        if ($rider->orders()->exists()) {
            return redirect('/admin/riders')->with('error', "Can't delete \"{$rider->name}\" — they still have orders assigned to them. Deactivate them instead.");
        }

        $rider->delete();
        return redirect('/admin/riders');
    });

    Route::get('/admin/settings', function () {
        $settings = Settings::current();
        return view('admin.settings', compact('settings'));
    });

    Route::post('/admin/settings', function (Request $request) {
        $validated = $request->validate([
            'store_name' => 'required|string|max:255',
            'opening_time' => 'nullable|date_format:H:i',
            'closing_time' => 'nullable|date_format:H:i',
            'delivery_fee' => 'required|numeric|min:0',
            'min_order_value' => 'required|numeric|min:0',
        ]);

        Settings::current()->update([
            'store_name' => $validated['store_name'],
            'opening_time' => $validated['opening_time'] ?? null,
            'closing_time' => $validated['closing_time'] ?? null,
            'delivery_fee' => $validated['delivery_fee'],
            'min_order_value' => $validated['min_order_value'],
            'is_accepting_orders' => $request->has('is_accepting_orders'),
        ]);

        return redirect('/admin/settings');
    });

    Route::get('/admin/reviews', function (Request $request) {
        $query = Review::with('menuItem', 'user', 'order');

        if ($request->input('filter') === 'hidden') {
            $query->where('is_hidden', true);
        } elseif ($request->input('filter') !== 'all') {
            $query->where('is_hidden', false);
        }

        $reviews = $query->orderByDesc('created_at')->get();

        return view('admin.reviews', compact('reviews'));
    });

    Route::post('/admin/reviews/{id}/toggle-hidden', function ($id) {
        $review = Review::findOrFail($id);
        $review->update(['is_hidden' => ! $review->is_hidden]);
        return redirect('/admin/reviews');
    });

    Route::post('/admin/reviews/{id}/delete', function ($id) {
        Review::findOrFail($id)->delete();
        return redirect('/admin/reviews');
    });
});
