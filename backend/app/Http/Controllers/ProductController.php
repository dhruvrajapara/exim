<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with('category')->active();

        if ($request->filled('category') && $request->category !== 'all') {
            $query->whereHas('category', function ($q) use ($request) {
                $q->where('slug', $request->category);
            });
        }

        if ($request->filled('search')) {
            $searchTerm = '%' . $request->search . '%';
            $query->where(function ($q) use ($searchTerm) {
                $q->where('name', 'like', $searchTerm)
                  ->orWhere('short_description', 'like', $searchTerm)
                  ->orWhere('full_description', 'like', $searchTerm);
            });
        }

        $products = $query->orderBy('display_order', 'asc')->get();

        return response()->json(['data' => $products]);
    }

    public function featured()
    {
        $products = Product::active()
            ->featured()
            ->orderBy('display_order', 'asc')
            ->limit(8)
            ->get();
            
        return response()->json(['data' => $products]);
    }

    public function show($slug)
    {
        $product = Product::with('category')->where('slug', $slug)->active()->firstOrFail();
        return response()->json(['data' => $product]);
    }

    public function adminIndex()
    {
        $products = Product::with('category')->orderBy('display_order', 'asc')->get();
        return response()->json(['data' => $products]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:products',
            'category_id' => 'nullable|exists:product_categories,id',
            'short_description' => 'nullable|string',
            'full_description' => 'nullable|string',
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
            'display_order' => 'nullable|integer',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:20480',
            'specifications' => 'nullable|string', // JSON string from frontend
            'features' => 'nullable|string', // JSON string from frontend
            'gallery.*' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:20480'
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

        // Handle JSON fields
        if (isset($validated['specifications'])) {
            $validated['specifications'] = json_decode($validated['specifications'], true);
        }
        if (isset($validated['features'])) {
            $validated['features'] = json_decode($validated['features'], true);
        }

        // Handle Gallery images
        $galleryPaths = [];
        if ($request->hasFile('gallery')) {
            $manager = new ImageManager(new Driver());
            foreach ($request->file('gallery') as $galleryImage) {
                $img = $manager->read($galleryImage);
                $encoded = $img->toWebp(75);
                $filename = 'products/gallery/' . uniqid() . '.webp';
                Storage::disk('public')->put($filename, (string) $encoded);
                $galleryPaths[] = '/storage/' . $filename;
            }
        }
        $validated['gallery'] = $galleryPaths;

        $product = Product::create($validated);
        return response()->json(['data' => $product, 'message' => 'Product created successfully']);
    }

    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:products,slug,' . $id,
            'category_id' => 'nullable|exists:product_categories,id',
            'short_description' => 'nullable|string',
            'full_description' => 'nullable|string',
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
            'display_order' => 'nullable|integer',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:20480',
            'specifications' => 'nullable|string',
            'features' => 'nullable|string',
            'gallery.*' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:20480',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
            'meta_keywords' => 'nullable|string',
            'canonical_url' => 'nullable|string|max:255',
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

        // Handle JSON fields
        if (isset($validated['specifications'])) {
            $validated['specifications'] = json_decode($validated['specifications'], true);
        }
        if (isset($validated['features'])) {
            $validated['features'] = json_decode($validated['features'], true);
        }

        // Handle Gallery images (Append new ones)
        $galleryPaths = is_array($product->gallery) ? $product->gallery : [];
        if ($request->hasFile('gallery')) {
            $manager = new ImageManager(new Driver());
            foreach ($request->file('gallery') as $galleryImage) {
                $img = $manager->read($galleryImage);
                $encoded = $img->toWebp(75);
                $filename = 'products/gallery/' . uniqid() . '.webp';
                Storage::disk('public')->put($filename, (string) $encoded);
                $galleryPaths[] = '/storage/' . $filename;
            }
        }
        $validated['gallery'] = $galleryPaths;

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
