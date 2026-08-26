<?php

namespace App\Http\Controllers\Admin\Api;

use App\Http\Controllers\Controller;
use App\Models\MenuItem;
use App\Support\Slugger;
use Illuminate\Http\Request;

class MenuItemController extends Controller
{
    public function index()
    {
        $items = MenuItem::with('category')->orderByDesc('created_at')->get();

        return response()->json($items);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'image' => 'nullable|string|max:2048',
            'calories' => 'nullable|integer|min:0',
            'prep_time' => 'nullable|integer|min:0',
            'is_special' => 'boolean',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:50',
        ]);

        $item = MenuItem::create([
            'category_id' => $validated['category_id'],
            'name' => $validated['name'],
            'slug' => Slugger::unique(MenuItem::class, $validated['name']),
            'description' => $validated['description'] ?? null,
            'price' => $validated['price'],
            'image' => $validated['image'] ?? null,
            'calories' => $validated['calories'] ?? null,
            'prep_time' => $validated['prep_time'] ?? null,
            'tags' => $validated['tags'] ?? [],
            'is_special' => $validated['is_special'] ?? false,
            'is_available' => true,
            'is_featured' => false,
        ]);

        return response()->json($item->load('category'), 201);
    }

    public function update(Request $request, string $id)
    {
        $item = MenuItem::findOrFail($id);

        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'image' => 'nullable|string|max:2048',
            'calories' => 'nullable|integer|min:0',
            'prep_time' => 'nullable|integer|min:0',
            'is_available' => 'boolean',
            'is_featured' => 'boolean',
            'is_special' => 'boolean',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:50',
        ]);

        $item->update([
            'category_id' => $validated['category_id'],
            'name' => $validated['name'],
            'description' => $validated['description'] ?? $item->description,
            'price' => $validated['price'],
            'image' => $validated['image'] ?? $item->image,
            'calories' => $validated['calories'] ?? $item->calories,
            'prep_time' => $validated['prep_time'] ?? $item->prep_time,
            'tags' => $validated['tags'] ?? $item->tags,
            'is_available' => $validated['is_available'] ?? $item->is_available,
            'is_featured' => $validated['is_featured'] ?? $item->is_featured,
            'is_special' => $validated['is_special'] ?? $item->is_special,
        ]);

        return response()->json($item->load('category'));
    }

    public function destroy(string $id)
    {
        $item = MenuItem::findOrFail($id);

        if ($item->orderItems()->exists()) {
            return response()->json([
                'message' => "Can't delete \"{$item->name}\" — it appears in past orders. Mark it unavailable instead to hide it from customers.",
            ], 422);
        }

        $item->delete();

        return response()->json(['message' => 'Menu item deleted.']);
    }
}
