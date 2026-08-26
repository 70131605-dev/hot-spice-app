<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ReservationController extends Controller
{
    public function index(Request $request)
    {
        $reservations = $request->user()
            ->reservations()
            ->orderByDesc('date')
            ->orderByDesc('created_at')
            ->get();

        return response()->json($reservations);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:30',
            'email' => 'required|string|email|max:255',
            'date' => 'required|date|after_or_equal:today',
            'time' => 'required|string|max:20',
            'guests' => 'required|integer|min:1|max:20',
            'notes' => 'nullable|string|max:1000',
        ]);

        // Guests can book without an account; if they're signed in we still
        // link the reservation to their profile so it shows up in "My Reservations".
        $user = $request->bearerToken() ? auth('sanctum')->user() : null;

        $reservation = Reservation::create([
            'user_id' => $user?->id,
            'reservation_number' => 'RF-'.strtoupper(Str::random(6)),
            'name' => $validated['name'],
            'phone' => $validated['phone'],
            'email' => $validated['email'],
            'date' => $validated['date'],
            'time' => $validated['time'],
            'guests' => $validated['guests'],
            'notes' => $validated['notes'] ?? null,
            'status' => 'pending',
        ]);

        return response()->json($reservation, 201);
    }
}
