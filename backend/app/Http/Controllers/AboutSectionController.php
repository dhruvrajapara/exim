<?php

namespace App\Http\Controllers;

use App\Models\AboutSection;
use Illuminate\Http\Request;

class AboutSectionController extends Controller
{
    public function index()
    {
        // Return the first active about section with its active statistics
        $aboutSection = AboutSection::with('activeStatistics')->active()->first();
        
        return response()->json(['data' => $aboutSection]);
    }

    public function adminIndex()
    {
        $aboutSection = AboutSection::with(['statistics' => function ($query) {
            $query->orderBy('display_order', 'asc');
        }])->first();
        
        return response()->json(['data' => $aboutSection]);
    }

    public function update(Request $request, $id)
    {
        $aboutSection = AboutSection::findOrFail($id);

        $validated = $request->validate([
            'label' => 'nullable|string|max:255',
            'heading' => 'required|string|max:255',
            'description' => 'required|string',
            'btn_text' => 'nullable|string|max:255',
            'btn_url' => 'nullable|string|max:255',
            'image' => 'nullable|image|max:5120', // Max 5MB
            'image_alt' => 'nullable|string|max:255',
            'image_title' => 'nullable|string|max:255',
            'is_active' => 'boolean',
            'statistics' => 'nullable|string', // JSON string
        ]);

        if ($request->hasFile('image')) {
            if ($aboutSection->image_path && str_starts_with($aboutSection->image_path, '/storage/')) {
                $oldPath = str_replace('/storage/', '', $aboutSection->image_path);
                \Illuminate\Support\Facades\Storage::disk('public')->delete($oldPath);
            }
            
            $imageFile = $request->file('image');
            $manager = \Intervention\Image\ImageManager::gd();
            $img = $manager->read($imageFile->getRealPath());
            
            // Resize to 75% resolution
            $newWidth = intval($img->width() * 0.75);
            $img->scale(width: $newWidth);
            
            // Convert to WebP format at 75% quality
            $encoded = $img->toWebp(75);
            
            $filename = uniqid('about_') . '.webp';
            $path = 'about-section/' . $filename;
            
            \Illuminate\Support\Facades\Storage::disk('public')->put($path, $encoded->toString());
            $validated['image_path'] = '/storage/' . $path;
        }

        $validated['label'] = $validated['label'] ?? '';
        $validated['btn_text'] = $validated['btn_text'] ?? '';
        $validated['btn_url'] = $validated['btn_url'] ?? '';
        $validated['image_alt'] = $validated['image_alt'] ?? '';
        $validated['image_title'] = $validated['image_title'] ?? '';

        $aboutSection->update($validated);

        if ($request->has('statistics')) {
            $statsData = json_decode($request->input('statistics'), true) ?? [];
            
            $existingStatIds = $aboutSection->statistics()->pluck('id')->toArray();
            $updatedStatIds = [];

            foreach ($statsData as $index => $stat) {
                if (isset($stat['id']) && in_array($stat['id'], $existingStatIds)) {
                    $aboutSection->statistics()->where('id', $stat['id'])->update([
                        'number_value' => $stat['number_value'],
                        'title' => $stat['title'],
                        'display_order' => $stat['display_order'] ?? $index,
                    ]);
                    $updatedStatIds[] = $stat['id'];
                } else {
                    $newStat = $aboutSection->statistics()->create([
                        'number_value' => $stat['number_value'],
                        'title' => $stat['title'],
                        'display_order' => $stat['display_order'] ?? $index,
                    ]);
                    $updatedStatIds[] = $newStat->id;
                }
            }

            $statsToDelete = array_diff($existingStatIds, $updatedStatIds);
            if (!empty($statsToDelete)) {
                $aboutSection->statistics()->whereIn('id', $statsToDelete)->delete();
            }
        }

        return response()->json(['message' => 'About section updated successfully']);
    }
}
