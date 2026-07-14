<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class ProductController extends Controller
{
    public function featured()
    {
        $products = Product::active()
            ->featured()
            ->orderBy('display_order', 'asc')
            ->limit(8)
            ->get();
            
        return response()->json(['data' => $products]);
    }

    public function adminIndex()
    {
        $products = Product::orderBy('display_order', 'asc')->get();
        return response()->json(['data' => $products]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:products',
            'short_description' => 'nullable|string',
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
            'display_order' => 'nullable|integer',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
        ]);

        if ($request->hasFile('image')) {
            $manager = new ImageManager(new Driver());
            $image = $manager->read($request->file('image'));
            $encoded = $image->toWebp(75);
            $filename = 'products/' . uniqid() . '.webp';
            Storage::disk('public')->put($filename, (string) $encoded);
            $validated['image_path'] = '/storage/' . $filename;
        }

        $validated['image_path'] = $validated['image_path'] ?? '';
        $validated['image_alt'] = $validated['image_alt'] ?? $validated['name'];
        $validated['image_title'] = $validated['image_title'] ?? '';

        $product = Product::create($validated);
        return response()->json(['data' => $product, 'message' => 'Product created successfully']);
    }

    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:products,slug,' . $id,
            'short_description' => 'nullable|string',
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
            'display_order' => 'nullable|integer',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
        ]);

        if ($request->hasFile('image')) {
            if ($product->image_path && file_exists(public_path($product->image_path))) {
                @unlink(public_path($product->image_path));
            }
            
            $manager = new ImageManager(new Driver());
            $image = $manager->read($request->file('image'));
            $encoded = $image->toWebp(75);
            $filename = 'products/' . uniqid() . '.webp';
            Storage::disk('public')->put($filename, (string) $encoded);
            $validated['image_path'] = '/storage/' . $filename;
        }

        $product->update($validated);
        return response()->json(['data' => $product, 'message' => 'Product updated successfully']);
    }

    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        
        if ($product->image_path && file_exists(public_path($product->image_path))) {
            @unlink(public_path($product->image_path));
        }
        
        $product->delete();
        return response()->json(['message' => 'Product deleted successfully']);
    }
}
