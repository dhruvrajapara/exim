<?php

namespace App\Http\Controllers;

use App\Models\BlogCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class BlogCategoryController extends Controller
{
    public function index()
    {
        $categories = BlogCategory::orderBy('name', 'asc')->get();
        return response()->json(['status' => 'success', 'data' => $categories]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $category = BlogCategory::create([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
        ]);

        return response()->json(['status' => 'success', 'message' => 'Category added successfully', 'data' => $category]);
    }

    public function update(Request $request, $id)
    {
        $category = BlogCategory::find($id);

        if (!$category) {
            return response()->json(['status' => 'error', 'message' => 'Category not found'], 404);
        }

        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $category->update([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
        ]);

        return response()->json(['status' => 'success', 'message' => 'Category updated successfully', 'data' => $category]);
    }

    public function destroy($id)
    {
        $category = BlogCategory::find($id);

        if (!$category) {
            return response()->json(['status' => 'error', 'message' => 'Category not found'], 404);
        }

        $category->delete();

        return response()->json(['status' => 'success', 'message' => 'Category deleted successfully']);
    }
}
