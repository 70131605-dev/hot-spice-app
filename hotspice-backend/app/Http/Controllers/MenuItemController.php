<?php

namespace App\Http\Controllers;

use App\Models\MenuItem;
use Illuminate\Http\Request;

class MenuItemController extends Controller
{
    public function index(Request $request)
    {
        $query = MenuItem::with('category');

        if ($request->filled('category')) {
            $query->whereHas('category', function ($q) use ($request) {
                $q->where('slug', $request->category);
            });
        } elseif ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%'.$request->search.'%')
                  ->orWhere('description', 'like', '%'.$request->search.'%');
            });
        }

        if ($request->filled('available')) {
            $available = filter_var($request->available, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
            if (! is_null($available)) {
                $query->where('is_available', $available);
            }
        }

        if ($request->filled('sort')) {
            match ($request->sort) {
                'price-asc' => $query->orderBy('price', 'asc'),
                'price-desc' => $query->orderBy('price', 'desc'),
                'rating' => $query->orderBy('rating', 'desc'),
                'time' => $query->orderBy('prep_time', 'asc'),
                default => $query->orderByDesc('rating_count'),
            };
        } else {
            $query->orderByDesc('rating_count');
        }

        return response()->json($query->get());
    }
}