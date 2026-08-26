<?php

namespace App\Http\Controllers\Admin\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Support\Slugger;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::withCount('menuItems')->orderBy('sort_order')->get();

        return response()->json($categories);
    }

    public function store(Request $request)
    {
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
            'icon' => 'nullable|string|max:16',
            'image' => 'nullable|string|max:2048',
        ]);

        $category = Category::create([
            'name' => $validated['name'],
            'slug' => Slugger::unique(Category::class, $validated['slug'] ?? $validated['name']),
            'description' => $validated['description'] ?? null,
            'icon' => $validated['icon'] ?? null,
            'image' => $validated['image'] ?? null,
            'sort_order' => $validated['sort_order'],
            'is_active' => true,
        ]);

        return response()->json($category, 201);
    }

    public function update(Request $request, string $id)
    {
        $category = Category::findOrFail($id);

        $request->merge([
            'sort_order' => $request->filled('sort_order') ? (int) $request->sort_order : $category->sort_order,
        ]);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255',
            'sort_order' => ['required', 'integer', Rule::unique('categories', 'sort_order')->ignore($category->id)],
            'description' => 'nullable|string',
            'icon' => 'nullable|string|max:16',
            'image' => 'nullable|string|max:2048',
            'is_active' => 'boolean',
        ]);

        $category->update([
            'name' => $validated['name'],
            'slug' => Slugger::unique(Category::class, $validated['slug'] ?? $validated['name'], $category->id),
            'description' => $validated['description'] ?? $category->description,
            'icon' => $validated['icon'] ?? $category->icon,
            'image' => $validated['image'] ?? $category->image,
            'sort_order' => $validated['sort_order'],
            'is_active' => $validated['is_active'] ?? $category->is_active,
        ]);

        return response()->json($category);
    }

    public function destroy(string $id)
    {
        $category = Category::findOrFail($id);

        if ($category->menuItems()->exists()) {
            return response()->json([
                'message' => "Can't delete \"{$category->name}\" — it still has menu items. Move or delete them first.",
            ], 422);
        }

        $category->delete();

        return response()->json(['message' => 'Category deleted.']);
    }
}
