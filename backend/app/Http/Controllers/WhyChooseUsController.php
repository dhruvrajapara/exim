<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\WhyChooseUs;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class WhyChooseUsController extends Controller
{
    public function index()
    {
        $items = WhyChooseUs::all();
        return response()->json(['data' => $items]);
    }

    public function adminIndex()
    {
        $items = WhyChooseUs::all();
        return response()->json(['data' => $items]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'short_description' => 'required|string',
            'icon' => 'nullable|string|max:500',
            'icon_image' => 'nullable|file|mimes:jpeg,png,jpg,gif,webp,svg,ico|max:20480'
        ]);

        if ($request->hasFile('icon_image')) {
            $file = $request->file('icon_image');
            $ext = strtolower($file->getClientOriginalExtension());
            if (in_array($ext, ['svg', 'ico', 'pdf'])) {
                $name = 'why_choose_us_' . uniqid() . '.' . $ext;
                $file->storeAs('icons', $name, 'public');
                $filename = 'icons/' . $name;
            } else {
                $manager = new ImageManager(new Driver());
                $image = $manager->read($file);
                $encoded = $image->toWebp(75);
                $filename = 'icons/why_choose_us_' . uniqid() . '.webp';
                Storage::disk('public')->put($filename, (string) $encoded);
            }
            $validated['icon'] = '/storage/' . $filename;
        } elseif (empty($validated['icon'])) {
            $validated['icon'] = 'fa-solid fa-star';
        }

        unset($validated['icon_image']);
        $item = WhyChooseUs::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Item created successfully.',
            'data' => $item
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $item = WhyChooseUs::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'short_description' => 'required|string',
            'icon' => 'nullable|string|max:500',
            'icon_image' => 'nullable|file|mimes:jpeg,png,jpg,gif,webp,svg,ico|max:20480'
        ]);

        if ($request->hasFile('icon_image')) {
            // Delete old icon if it's a webp image in the storage
            if (!empty($item->icon) && str_contains($item->icon, '/storage/icons/')) {
                $oldPath = str_replace('/storage/', '', $item->icon);
                if (Storage::disk('public')->exists($oldPath)) {
                    Storage::disk('public')->delete($oldPath);
                }
            }

            $file = $request->file('icon_image');
            $ext = strtolower($file->getClientOriginalExtension());
            if (in_array($ext, ['svg', 'ico', 'pdf'])) {
                $name = 'why_choose_us_' . uniqid() . '.' . $ext;
                $file->storeAs('icons', $name, 'public');
                $filename = 'icons/' . $name;
            } else {
                $manager = new ImageManager(new Driver());
                $image = $manager->read($file);
                $encoded = $image->toWebp(75);
                $filename = 'icons/why_choose_us_' . uniqid() . '.webp';
                Storage::disk('public')->put($filename, (string) $encoded);
            }
            
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
        $item = WhyChooseUs::findOrFail($id);
        $item->delete();

        return response()->json([
            'success' => true,
            'message' => 'Item deleted successfully.'
        ]);
    }
}
