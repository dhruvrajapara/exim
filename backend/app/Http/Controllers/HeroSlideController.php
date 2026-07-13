<?php

namespace App\Http\Controllers;

use App\Models\HeroSlide;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManager;

class HeroSlideController extends Controller
{
    /**
     * Display a listing of the active resource for public site.
     */
    public function index()
    {
        // Return active slides ordered by display_order
        $slides = HeroSlide::active()->ordered()->get();
        return response()->json(['data' => $slides]);
    }

    /**
     * Display a listing of all resources for admin panel.
     */
    public function adminIndex()
    {
        $slides = HeroSlide::ordered()->get();
        return response()->json(['data' => $slides]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'label' => 'nullable|string|max:255',
            'heading' => 'required|string|max:255',
            'description' => 'nullable|string',
            'primary_btn_text' => 'nullable|string|max:255',
            'primary_btn_url' => 'nullable|string|max:255',
            'secondary_btn_text' => 'nullable|string|max:255',
            'secondary_btn_url' => 'nullable|string|max:255',
            'image' => 'nullable|image|max:5120', // Max 5MB
            'image_alt' => 'nullable|string|max:255',
            'image_title' => 'nullable|string|max:255',
            'display_order' => 'nullable|integer',
            'is_active' => 'boolean',
        ]);

        if ($request->hasFile('image')) {
            $imageFile = $request->file('image');
            $manager = ImageManager::gd();
            $img = $manager->read($imageFile->getRealPath());
            
            // Resize to 75% resolution
            $newWidth = intval($img->width() * 0.75);
            $img->scale(width: $newWidth);
            
            // Convert to WebP format at 75% quality
            $encoded = $img->toWebp(75);
            
            $filename = uniqid('hero_') . '.webp';
            $path = 'hero-slides/' . $filename;
            
            Storage::disk('public')->put($path, $encoded->toString());
            $validated['image_path'] = '/storage/' . $path;
        }

        // Fix database constraints for non-nullable fields
        $validated['primary_btn_text'] = $validated['primary_btn_text'] ?? '';
        $validated['primary_btn_url'] = $validated['primary_btn_url'] ?? '';
        $validated['image_path'] = $validated['image_path'] ?? '';
        $validated['image_alt'] = $validated['image_alt'] ?? '';

        if (!isset($validated['display_order'])) {
            $maxOrder = HeroSlide::max('display_order');
            $validated['display_order'] = $maxOrder ? $maxOrder + 1 : 1;
        }

        $slide = HeroSlide::create($validated);

        return response()->json(['message' => 'Slide created successfully', 'data' => $slide], 201);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $slide = HeroSlide::findOrFail($id);

        $validated = $request->validate([
            'label' => 'nullable|string|max:255',
            'heading' => 'required|string|max:255',
            'description' => 'nullable|string',
            'primary_btn_text' => 'nullable|string|max:255',
            'primary_btn_url' => 'nullable|string|max:255',
            'secondary_btn_text' => 'nullable|string|max:255',
            'secondary_btn_url' => 'nullable|string|max:255',
            'image' => 'nullable|image|max:5120', // Max 5MB
            'image_alt' => 'nullable|string|max:255',
            'image_title' => 'nullable|string|max:255',
            'display_order' => 'nullable|integer',
            'is_active' => 'boolean',
        ]);

        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($slide->image_path && str_starts_with($slide->image_path, '/storage/')) {
                $oldPath = str_replace('/storage/', '', $slide->image_path);
                Storage::disk('public')->delete($oldPath);
            }
            $imageFile = $request->file('image');
            $manager = ImageManager::gd();
            $img = $manager->read($imageFile->getRealPath());
            
            // Resize to 75% resolution
            $newWidth = intval($img->width() * 0.75);
            $img->scale(width: $newWidth);
            
            // Convert to WebP format at 75% quality
            $encoded = $img->toWebp(75);
            
            $filename = uniqid('hero_') . '.webp';
            $path = 'hero-slides/' . $filename;
            
            Storage::disk('public')->put($path, $encoded->toString());
            $validated['image_path'] = '/storage/' . $path;
        }

        // Fix database constraints for non-nullable fields
        $validated['primary_btn_text'] = $validated['primary_btn_text'] ?? '';
        $validated['primary_btn_url'] = $validated['primary_btn_url'] ?? '';
        $validated['image_alt'] = $validated['image_alt'] ?? '';

        $slide->update($validated);

        return response()->json(['message' => 'Slide updated successfully', 'data' => $slide]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $slide = HeroSlide::findOrFail($id);
        
        if ($slide->image_path && str_starts_with($slide->image_path, '/storage/')) {
            $oldPath = str_replace('/storage/', '', $slide->image_path);
            Storage::disk('public')->delete($oldPath);
        }

        $slide->delete();

        return response()->json(['message' => 'Slide deleted successfully']);
    }
}
