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
    public function index(Request $request)
    {
        $query = ProductCategory::active()->ordered();

        if ($request->query('home') == '1') {
            $setting = \App\Models\SectionSetting::where('section_key', 'home_categories')->first();
            if ($setting && $setting->extra_data) {
                if (isset($setting->extra_data['selected_categories']) && is_array($setting->extra_data['selected_categories']) && count($setting->extra_data['selected_categories']) > 0) {
                    $query->whereIn('id', $setting->extra_data['selected_categories']);
                }
                
                if (isset($setting->extra_data['limit']) && $setting->extra_data['limit'] !== 'All') {
                    $limit = intval($setting->extra_data['limit']);
                    if ($limit > 0) {
                        $query->limit($limit);
                    }
                }
            }
        }

        $categories = $query->get();
        return response()->json(['data' => $categories]);
    }

    public function adminIndex()
    {
        $categories = ProductCategory::with('parent')->orderBy('display_order', 'asc')->get();
        return response()->json(['data' => $categories]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:product_categories',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
            'display_order' => 'nullable|integer',
            'parent_id' => 'nullable|exists:product_categories,id',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
        ]);

        if ($request->hasFile('image')) {
            $manager = new ImageManager(new Driver());
            $image = $manager->read($request->file('image'));
            $encoded = $image->toWebp(75);
            $filename = 'categories/' . uniqid() . '.webp';
            Storage::disk('public')->put($filename, (string) $encoded);
            $validated['image_path'] = '/storage/' . $filename;
        }

        $validated['image_path'] = $validated['image_path'] ?? '';
        $validated['image_alt'] = $validated['image_alt'] ?? $validated['name'];
        $validated['image_title'] = $validated['image_title'] ?? '';

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
            'display_order' => 'nullable|integer',
            'parent_id' => 'nullable|exists:product_categories,id',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
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
