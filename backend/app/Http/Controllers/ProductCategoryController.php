<?php

namespace App\Http\Controllers;

use App\Models\ProductCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class ProductCategoryController extends Controller
{
    /**
     * Display a listing of the active resource.
     */
    public function index()
    {
        // Return all active categories ordered by display_order
        $categories = ProductCategory::active()->ordered()->get();
        return response()->json(['data' => $categories]);
    }

    public function adminIndex()
    {
        $categories = ProductCategory::orderBy('display_order', 'asc')->get();
        return response()->json(['data' => $categories]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:product_categories',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
            'display_order' => 'integer',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $manager = new ImageManager(new Driver());
            $image = $manager->read($request->file('image'));
            $encoded = $image->toWebp(75);
            $filename = 'categories/' . uniqid() . '.webp';
            Storage::disk('public')->put($filename, (string) $encoded);
            $validated['image_path'] = '/storage/' . $filename;
        }

        $category = ProductCategory::create($validated);
        return response()->json(['data' => $category, 'message' => 'Category created successfully']);
    }

    public function update(Request $request, $id)
    {
        $category = ProductCategory::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:product_categories,slug,' . $id,
            'description' => 'nullable|string',
            'is_active' => 'boolean',
            'display_order' => 'integer',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($request->hasFile('image')) {
            // Delete old image if needed
            if ($category->image_path && file_exists(public_path($category->image_path))) {
                @unlink(public_path($category->image_path));
            }
            
            $manager = new ImageManager(new Driver());
            $image = $manager->read($request->file('image'));
            $encoded = $image->toWebp(75);
            $filename = 'categories/' . uniqid() . '.webp';
            Storage::disk('public')->put($filename, (string) $encoded);
            $validated['image_path'] = '/storage/' . $filename;
        }

        $category->update($validated);
        return response()->json(['data' => $category, 'message' => 'Category updated successfully']);
    }

    public function destroy($id)
    {
        $category = ProductCategory::findOrFail($id);
        
        if ($category->image_path && file_exists(public_path($category->image_path))) {
            @unlink(public_path($category->image_path));
        }
        
        $category->delete();
        return response()->json(['message' => 'Category deleted successfully']);
    }
}
