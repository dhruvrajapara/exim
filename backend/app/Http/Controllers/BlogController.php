<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class BlogController extends Controller
{
    public function index(Request $request)
    {
        $query = Blog::with('category')->active()->orderBy('published_date', 'desc');

        if ($request->has('category') && $request->category) {
            $query->whereHas('category', function ($q) use ($request) {
                $q->where('slug', $request->category);
            });
        }

        if ($request->has('search') && $request->search) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        return response()->json(['data' => $query->get()]);
    }

    public function latest()
    {
        $blogs = Blog::with('category')->active()
            ->orderBy('published_date', 'desc')
            ->limit(8)
            ->get();
            
        return response()->json(['data' => $blogs]);
    }

    public function featured()
    {
        $blog = Blog::with('category')->active()->where('is_featured', true)->orderBy('published_date', 'desc')->first();
        if (!$blog) {
            // fallback to latest if no featured
            $blog = Blog::with('category')->active()->orderBy('published_date', 'desc')->first();
        }
        return response()->json(['data' => $blog]);
    }

    public function related($categorySlug)
    {
        $blogs = Blog::with('category')->active()
            ->whereHas('category', function ($q) use ($categorySlug) {
                $q->where('slug', $categorySlug);
            })
            ->orderBy('published_date', 'desc')
            ->limit(3)
            ->get();

        return response()->json(['data' => $blogs]);
    }

    public function show($slug)
    {
        $blog = Blog::with('category')->active()->where('slug', $slug)->first();

        if (!$blog) {
            return response()->json(['message' => 'Blog not found'], 404);
        }

        // Efficiently increment views in the database without modifying the Eloquent model's timestamps unnecessarily 
        // (if we don't want timestamps updated we'd use DB facade, but $blog->increment() is fine)
        $blog->increment('views');

        return response()->json(['data' => $blog]);
    }

    // --- Admin CRUD Methods ---

    public function adminIndex()
    {
        $blogs = Blog::with('category')->orderBy('created_at', 'desc')->get();
        return response()->json(['status' => 'success', 'data' => $blogs]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'category_id' => 'required|exists:blog_categories,id',
            'short_description' => 'required|string',
            'content' => 'required|string',
            'featured_image' => 'required|image|mimes:jpeg,png,jpg,webp|max:10240',
            'published_date' => 'required|date',
            'reading_time' => 'nullable|string|max:255',
        ]);

        $imagePath = '';
        if ($request->hasFile('featured_image')) {
            $path = $request->file('featured_image')->store('blogs', 'public');
            $imagePath = '/storage/' . $path;
        }

        $blog = Blog::create([
            'title' => $request->title,
            'slug' => Str::slug($request->title) . '-' . time(),
            'category_id' => $request->category_id,
            'short_description' => $request->short_description,
            'content' => $request->content,
            'published_date' => $request->published_date,
            'reading_time' => $request->reading_time,
            'featured_image' => $imagePath,
            'is_active' => $request->boolean('is_active', true),
            'is_featured' => $request->boolean('is_featured', false),
            'views' => 0,
        ]);

        return response()->json(['status' => 'success', 'message' => 'Blog created successfully', 'data' => $blog]);
    }

    public function update(Request $request, $id)
    {
        $blog = Blog::find($id);
        if (!$blog) {
            return response()->json(['status' => 'error', 'message' => 'Blog not found'], 404);
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'category_id' => 'required|exists:blog_categories,id',
            'short_description' => 'required|string',
            'content' => 'required|string',
            'published_date' => 'required|date',
            'featured_image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:10240',
            'reading_time' => 'nullable|string|max:255',
        ]);

        $imagePath = $blog->featured_image;
        if ($request->hasFile('featured_image')) {
            // Delete old
            if ($imagePath && Str::startsWith($imagePath, '/storage/')) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $imagePath));
            }
            // Store new
            $path = $request->file('featured_image')->store('blogs', 'public');
            $imagePath = '/storage/' . $path;
        }

        // Only update slug if title changed significantly, or keep it. We will just update it for now
        $slug = $blog->title === $request->title ? $blog->slug : Str::slug($request->title) . '-' . time();

        $blog->update([
            'title' => $request->title,
            'slug' => $slug,
            'category_id' => $request->category_id,
            'short_description' => $request->short_description,
            'content' => $request->content,
            'published_date' => $request->published_date,
            'reading_time' => $request->reading_time,
            'featured_image' => $imagePath,
            'is_active' => $request->has('is_active') ? $request->boolean('is_active') : $blog->is_active,
            'is_featured' => $request->has('is_featured') ? $request->boolean('is_featured') : $blog->is_featured,
        ]);

        return response()->json(['status' => 'success', 'message' => 'Blog updated successfully', 'data' => $blog]);
    }

    public function destroy($id)
    {
        $blog = Blog::find($id);
        if (!$blog) {
            return response()->json(['status' => 'error', 'message' => 'Blog not found'], 404);
        }

        if ($blog->featured_image && Str::startsWith($blog->featured_image, '/storage/')) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $blog->featured_image));
        }

        $blog->delete();

        return response()->json(['status' => 'success', 'message' => 'Blog deleted successfully']);
    }
}
