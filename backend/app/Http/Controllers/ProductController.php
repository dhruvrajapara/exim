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

    public function related($categorySlug)
    {
        $products = Product::with('category')->active()
            ->whereHas('category', function ($q) use ($categorySlug) {
                $q->where('slug', $categorySlug);
            })
            ->orderBy('display_order', 'asc')
            ->limit(4)
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
            'faqs' => 'nullable|string', // JSON string from frontend
            'seo_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:20480',
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

        if ($request->hasFile('seo_image')) {
            $manager = new ImageManager(new Driver());
            $image = $manager->read($request->file('seo_image'));
            $encoded = $image->toWebp(75);
            $filename = 'products/seo/' . uniqid() . '.webp';
            Storage::disk('public')->put($filename, (string) $encoded);
            $validated['seo_image'] = '/storage/' . $filename;
        }

        $validated['image_path'] = $validated['image_path'] ?? '';
        $validated['image_alt'] = $validated['image_alt'] ?? $validated['name'];
        $validated['image_title'] = $validated['image_title'] ?? '';

        // Handle JSON fields - enforce empty arrays if not present
        $validated['specifications'] = $request->has('specifications') ? json_decode($request->input('specifications'), true) : [];
        $validated['features'] = $request->has('features') ? json_decode($request->input('features'), true) : [];
        $validated['faqs'] = $request->has('faqs') ? json_decode($request->input('faqs'), true) : [];

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
            'faqs' => 'nullable|string',
            'seo_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:20480',
            'gallery.*' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:20480',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
            'meta_keywords' => 'nullable|string',
            'canonical_url' => 'nullable|string|max:255',
        ]);

        if ($request->hasFile('image')) {
            if ($product->image_path) {
                $storagePath = preg_replace('/^\/storage\//', '', $product->image_path);
                if (\Illuminate\Support\Facades\Storage::disk('public')->exists($storagePath)) {
                    \Illuminate\Support\Facades\Storage::disk('public')->delete($storagePath);
                } elseif (file_exists(public_path($product->image_path))) {
                    @unlink(public_path($product->image_path));
                }
            }
            
            $manager = new ImageManager(new Driver());
            $image = $manager->read($request->file('image'));
            $encoded = $image->toWebp(75);
            $filename = 'products/' . uniqid() . '.webp';
            Storage::disk('public')->put($filename, (string) $encoded);
            $validated['image_path'] = '/storage/' . $filename;
        }

        if ($request->hasFile('seo_image')) {
            if ($product->seo_image) {
                $storagePath = preg_replace('/^\/storage\//', '', $product->seo_image);
                if (\Illuminate\Support\Facades\Storage::disk('public')->exists($storagePath)) {
                    \Illuminate\Support\Facades\Storage::disk('public')->delete($storagePath);
                } elseif (file_exists(public_path($product->seo_image))) {
                    @unlink(public_path($product->seo_image));
                }
            }
            
            $manager = new ImageManager(new Driver());
            $image = $manager->read($request->file('seo_image'));
            $encoded = $image->toWebp(75);
            $filename = 'products/seo/' . uniqid() . '.webp';
            Storage::disk('public')->put($filename, (string) $encoded);
            $validated['seo_image'] = '/storage/' . $filename;
        }

        // Handle JSON fields - enforce empty arrays if not present
        $validated['specifications'] = $request->has('specifications') ? json_decode($request->input('specifications'), true) : [];
        $validated['features'] = $request->has('features') ? json_decode($request->input('features'), true) : [];
        $validated['faqs'] = $request->has('faqs') ? json_decode($request->input('faqs'), true) : [];

        // Handle Gallery images
        $retainedGallery = $request->input('retained_gallery', []);
        \Log::info("Retained gallery incoming: ", $retainedGallery);

        $cleanedRetained = [];
        foreach ($retainedGallery as $url) {
            // Robustly extract the path without domain or query strings
            $parsed = parse_url($url, PHP_URL_PATH);
            if ($parsed) {
                // Ensure it has a leading slash
                $cleanedRetained[] = '/' . ltrim($parsed, '/');
            } else {
                $cleanedRetained[] = $url;
            }
        }
        \Log::info("Cleaned retained: ", $cleanedRetained);

        $oldGallery = is_array($product->gallery) ? $product->gallery : [];
        \Log::info("Old gallery in DB: ", $oldGallery);
        
        // Delete files that are no longer in the retained gallery
        foreach ($oldGallery as $oldImage) {
            if (!in_array($oldImage, $cleanedRetained)) {
                \Log::info("Deleting old image: " . $oldImage);
                // Use Storage facade which is more robust in production environments
                $storagePath = preg_replace('/^\/storage\//', '', $oldImage);
                if (\Illuminate\Support\Facades\Storage::disk('public')->exists($storagePath)) {
                    \Illuminate\Support\Facades\Storage::disk('public')->delete($storagePath);
                } else if (file_exists(public_path($oldImage))) {
                    // Fallback just in case
                    @unlink(public_path($oldImage));
                }
            } else {
                \Log::info("Retaining old image: " . $oldImage);
            }
        }
        
        $galleryPaths = $cleanedRetained;
        
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
        
        $filesToDelete = [];
        if ($product->image_path) $filesToDelete[] = $product->image_path;
        if ($product->seo_image) $filesToDelete[] = $product->seo_image;
        if (is_array($product->gallery)) {
            foreach ($product->gallery as $img) {
                $filesToDelete[] = $img;
            }
        }
        
        foreach ($filesToDelete as $fileUrl) {
            $storagePath = preg_replace('/^\/storage\//', '', $fileUrl);
            if (\Illuminate\Support\Facades\Storage::disk('public')->exists($storagePath)) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($storagePath);
            } elseif (file_exists(public_path($fileUrl))) {
                @unlink(public_path($fileUrl));
            }
        }
        
        $product->delete();
        return response()->json(['message' => 'Product deleted successfully']);
    }
}
