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
        \Log::info("[Gallery Deletion Debug] Store method hit for product creation.");
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
        $debugLogs = [];
        $logAndDebug = function($msg, $context = null) use (&$debugLogs) {
            $contextStr = $context !== null ? json_encode($context) : '';
            $fullMsg = $msg . ' ' . $contextStr;
            \Log::info($msg, $context !== null ? (is_array($context) ? $context : [$context]) : []);
            $debugLogs[] = $fullMsg;
        };

        $logAndDebug("[Gallery Deletion Debug] Update method hit for product ID: " . $id);
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
        $logAndDebug("[Gallery Deletion Debug] ========================================");
        if (!$request->has('retained_gallery')) {
            $logAndDebug("[Gallery Deletion Debug] Request has NO retained_gallery key. This indicates ALL existing images should be deleted.");
        }
        
        $retainedGallery = $request->input('retained_gallery', []);
        $logAndDebug("[Gallery Deletion Debug] Retained gallery incoming array size: " . count($retainedGallery));
        $logAndDebug("[Gallery Deletion Debug] Retained gallery incoming: ", $retainedGallery);

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
        $logAndDebug("[Gallery Deletion Debug] Cleaned retained paths: ", $cleanedRetained);

        $oldGallery = is_array($product->gallery) ? $product->gallery : [];
        $logAndDebug("[Gallery Deletion Debug] Old gallery in DB: ", $oldGallery);
        
        // Delete files that are no longer in the retained gallery
        foreach ($oldGallery as $oldImage) {
            if (!in_array($oldImage, $cleanedRetained)) {
                $logAndDebug("[Gallery Deletion Debug] Image marked for deletion: " . $oldImage);
                // Use Storage facade which is more robust in production environments
                $storagePath = preg_replace('/^\/storage\//', '', $oldImage);
                $logAndDebug("[Gallery Deletion Debug] Normalized storage path: " . $storagePath);
                
                $exists = \Illuminate\Support\Facades\Storage::disk('public')->exists($storagePath);
                $logAndDebug("[Gallery Deletion Debug] Storage::disk('public')->exists() result: " . ($exists ? 'true' : 'false'));
                
                if ($exists) {
                    $deleted = \Illuminate\Support\Facades\Storage::disk('public')->delete($storagePath);
                    $logAndDebug("[Gallery Deletion Debug] Storage::disk('public')->delete() result: " . ($deleted ? 'true' : 'false'));
                } else if (file_exists(public_path($oldImage))) {
                    $logAndDebug("[Gallery Deletion Debug] Found via public_path fallback. Using unlink().");
                    $deleted = @unlink(public_path($oldImage));
                    $logAndDebug("[Gallery Deletion Debug] unlink() result: " . ($deleted ? 'true' : 'false'));
                } else if (file_exists(base_path('public_html' . $oldImage))) {
                    $logAndDebug("[Gallery Deletion Debug] Found via public_html fallback. Using unlink().");
                    $deleted = @unlink(base_path('public_html' . $oldImage));
                    $logAndDebug("[Gallery Deletion Debug] unlink() result: " . ($deleted ? 'true' : 'false'));
                } else {
                    $logAndDebug("[Gallery Deletion Debug] File does not exist in storage, public_path, or public_html. Skipping deletion. Paths checked: " . $storagePath . ", " . public_path($oldImage) . ", " . base_path('public_html' . $oldImage));
                }
            } else {
                $logAndDebug("[Gallery Deletion Debug] Retaining old image: " . $oldImage);
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
        
        $logAndDebug("[Gallery Deletion Debug] Final gallery paths assigned to validated data: ", $validated['gallery']);

        $product->update($validated);
        
        $logAndDebug("[Gallery Deletion Debug] Final product gallery from DB after update: ", is_array($product->gallery) ? $product->gallery : json_decode($product->gallery, true) ?? []);

        return response()->json([
            'data' => $product, 
            'message' => 'Product updated successfully',
            'debug' => $debugLogs
        ]);
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
