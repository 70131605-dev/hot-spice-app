<?php

namespace App\Http\Controllers;

use App\Models\Address;
use Illuminate\Http\Request;

class AddressController extends Controller
{
    public function index(Request $request)
    {
        return response()->json(
            $request->user()->addresses()->orderByDesc('is_default')->get()
        );
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'label' => 'nullable|string|max:50',
            'address_line' => 'required|string',
            'city' => 'nullable|string|max:100',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'is_default' => 'boolean',
        ]);

        if ($validated['is_default'] ?? false) {
            $request->user()->addresses()->update(['is_default' => false]);
        }

        $address = $request->user()->addresses()->create($validated);

        return response()->json($address, 201);
    }

    public function destroy(Request $request, string $id)
    {
        $address = $request->user()->addresses()->findOrFail($id);
        $address->delete();

        return response()->json(['message' => 'Address deleted']);
    }

    public function setDefault(Request $request, string $id)
    {
        $request->user()->addresses()->update(['is_default' => false]);
        $address = $request->user()->addresses()->findOrFail($id);
        $address->update(['is_default' => true]);

        return response()->json($address);
    }
}