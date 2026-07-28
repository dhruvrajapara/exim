<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\VisionMission;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class VisionMissionController extends Controller
{
    public function index()
    {
        $items = VisionMission::all();
        return response()->json(['data' => $items]);
    }

    public function adminIndex()
    {
        $items = VisionMission::all();
        return response()->json(['data' => $items]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|in:vision,mission',
            'label' => 'required|string|max:255',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'icon' => 'nullable|string|max:500',
            'icon_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp,svg|max:20480'
        ]);

        if ($request->hasFile('icon_image')) {
            $manager = new ImageManager(new Driver());
            $image = $manager->read($request->file('icon_image'));
            $encoded = $image->toWebp(75);
            $filename = 'icons/vision_mission_' . uniqid() . '.webp';
            Storage::disk('public')->put($filename, (string) $encoded);
            $validated['icon'] = '/storage/' . $filename;
        } elseif (empty($validated['icon'])) {
            $validated['icon'] = 'fa-solid fa-eye';
        }

        unset($validated['icon_image']);
        $item = VisionMission::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Item created successfully.',
            'data' => $item
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $item = VisionMission::findOrFail($id);

        $validated = $request->validate([
            'type' => 'required|in:vision,mission',
            'label' => 'required|string|max:255',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'icon' => 'nullable|string|max:500',
            'icon_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp,svg|max:20480'
        ]);

        if ($request->hasFile('icon_image')) {
            // Delete old icon if it's a webp image in the storage
            if (!empty($item->icon) && str_contains($item->icon, '/storage/icons/')) {
                $oldPath = str_replace('/storage/', '', $item->icon);
                if (Storage::disk('public')->exists($oldPath)) {
                    Storage::disk('public')->delete($oldPath);
                }
            }

            $manager = new ImageManager(new Driver());
            $image = $manager->read($request->file('icon_image'));
            $encoded = $image->toWebp(75);
            $filename = 'icons/vision_mission_' . uniqid() . '.webp';
            Storage::disk('public')->put($filename, (string) $encoded);
            $validated['icon'] = '/storage/' . $filename;
        }

        unset($validated['icon_image']);
        $item->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Item updated successfully.',
            'data' => $item
        ]);
    }

    public function destroy($id)
    {
        $item = VisionMission::findOrFail($id);
        $item->delete();

        return response()->json([
            'success' => true,
            'message' => 'Item deleted successfully.'
        ]);
    }
}
