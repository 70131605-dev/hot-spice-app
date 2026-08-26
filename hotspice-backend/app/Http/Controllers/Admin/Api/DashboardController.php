<?php

namespace App\Http\Controllers\Admin\Api;

use App\Http\Controllers\Controller;
use App\Models\MenuItem;
use App\Models\Order;
use App\Models\Reservation;
use App\Models\Review;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;

class DashboardController extends Controller
{
    public function stats()
    {
        $today = Carbon::today();
        $yesterday = $today->copy()->subDay();

        $todayRevenue = (float) Order::whereDate('created_at', $today)
            ->where('status', '!=', 'cancelled')
            ->sum('total');
        $yesterdayRevenue = (float) Order::whereDate('created_at', $yesterday)
            ->where('status', '!=', 'cancelled')
            ->sum('total');

        $totalOrders = Order::count();
        $thisMonthOrders = Order::whereYear('created_at', now()->year)
            ->whereMonth('created_at', now()->month)
            ->count();
        $lastMonth = now()->subMonthNoOverflow();
        $lastMonthOrders = Order::whereYear('created_at', $lastMonth->year)
            ->whereMonth('created_at', $lastMonth->month)
            ->count();

        $activeReservations = Reservation::whereDate('date', '>=', $today)
            ->whereIn('status', ['pending', 'confirmed'])
            ->count();
        $reservationsToday = Reservation::whereDate('created_at', $today)->count();

        [$avgRating, $ratingCount] = $this->averageRating();

        return response()->json([
            'today_revenue' => $todayRevenue,
            'today_revenue_change_pct' => $this->percentChange($todayRevenue, $yesterdayRevenue),
            'total_orders' => $totalOrders,
            'orders_change_pct' => $this->percentChange($thisMonthOrders, $lastMonthOrders),
            'active_reservations' => $activeReservations,
            'reservations_today' => $reservationsToday,
            'avg_rating' => $avgRating,
            'avg_rating_count' => $ratingCount,
            'revenue_trend' => $this->revenueTrend(),
            'category_breakdown' => $this->categoryBreakdown(),
            'recent_reservations' => Reservation::orderByDesc('date')->orderByDesc('created_at')->limit(4)->get(),
        ]);
    }

    private function percentChange(float $current, float $previous): ?float
    {
        if ($previous == 0.0) {
            return $current > 0 ? 100.0 : 0.0;
        }

        return round((($current - $previous) / $previous) * 100, 1);
    }

    private function averageRating(): array
    {
        $reviewCount = Review::count();

        if ($reviewCount > 0) {
            return [round((float) Review::avg('rating'), 1), $reviewCount];
        }

        // No reviews logged yet — fall back to the ratings already recorded
        // against each menu item so the dashboard doesn't show a fake number.
        $weighted = MenuItem::selectRaw('SUM(rating * rating_count) as weighted_sum, SUM(rating_count) as total_count')->first();
        $totalCount = (int) ($weighted->total_count ?? 0);

        if ($totalCount === 0) {
            return [0.0, 0];
        }

        return [round($weighted->weighted_sum / $totalCount, 1), $totalCount];
    }

    private function revenueTrend(): array
    {
        $trend = [];

        for ($i = 6; $i >= 0; $i--) {
            $month = now()->subMonthsNoOverflow($i);

            $revenue = (float) Order::whereYear('created_at', $month->year)
                ->whereMonth('created_at', $month->month)
                ->where('status', '!=', 'cancelled')
                ->sum('total');

            $orders = Order::whereYear('created_at', $month->year)
                ->whereMonth('created_at', $month->month)
                ->count();

            $trend[] = [
                'month' => $month->format('M'),
                'revenue' => $revenue,
                'orders' => $orders,
            ];
        }

        return $trend;
    }

    private function categoryBreakdown(): array
    {
        $rows = DB::table('order_items')
            ->join('menu_items', 'order_items.menu_item_id', '=', 'menu_items.id')
            ->join('categories', 'menu_items.category_id', '=', 'categories.id')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->where('orders.status', '!=', 'cancelled')
            ->select('categories.name as name', DB::raw('SUM(order_items.line_total) as total'))
            ->groupBy('categories.name')
            ->orderByDesc('total')
            ->get();

        $grandTotal = (float) $rows->sum('total');

        if ($grandTotal <= 0) {
            return [];
        }

        $palette = ['#0D5969', '#F77F00', '#2ECC71', '#3498DB', '#8B7355', '#E74C3C', '#9B59B6'];

        $top = $rows->take(4);
        $rest = $rows->slice(4);

        $breakdown = $top->values()->map(function ($row, $i) use ($grandTotal, $palette) {
            return [
                'name' => $row->name,
                'value' => round(((float) $row->total / $grandTotal) * 100, 1),
                'color' => $palette[$i % count($palette)],
            ];
        })->all();

        if ($rest->count() > 0) {
            $restTotal = (float) $rest->sum('total');
            $breakdown[] = [
                'name' => 'Others',
                'value' => round(($restTotal / $grandTotal) * 100, 1),
                'color' => $palette[4 % count($palette)],
            ];
        }

        return $breakdown;
    }
}
