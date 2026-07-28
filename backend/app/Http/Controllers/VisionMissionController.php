<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\VisionMission;

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
            'icon_image' => 'nullable|image|max:2048'
        ]);

        if ($request->hasFile('icon_image')) {
            $path = $request->file('icon_image')->store('icons', 'public');
            $validated['icon'] = '/storage/' . $path;
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
            'icon_image' => 'nullable|image|max:2048'
        ]);

        if ($request->hasFile('icon_image')) {
            $path = $request->file('icon_image')->store('icons', 'public');
            $validated['icon'] = '/storage/' . $path;
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
