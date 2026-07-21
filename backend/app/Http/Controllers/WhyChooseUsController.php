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
            'icon' => 'required|string|max:100',
        ]);

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
            'icon' => 'required|string|max:100',
        ]);

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
