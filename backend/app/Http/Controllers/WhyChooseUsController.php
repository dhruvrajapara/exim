<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\WhyChooseUs;

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
            'icon_image' => 'nullable|image|max:2048'
        ]);

        if ($request->hasFile('icon_image')) {
            $path = $request->file('icon_image')->store('icons', 'public');
            $validated['icon'] = '/storage/' . $path;
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
        $item = WhyChooseUs::findOrFail($id);
        $item->delete();

        return response()->json([
            'success' => true,
            'message' => 'Item deleted successfully.'
        ]);
    }
}
