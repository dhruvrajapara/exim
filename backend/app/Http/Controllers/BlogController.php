<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use Illuminate\Http\Request;

class BlogController extends Controller
{
    public function latest()
    {
        $blogs = Blog::active()
            ->orderBy('published_date', 'desc')
            ->limit(8)
            ->get();
            
        return response()->json(['data' => $blogs]);
    }

    public function show($slug)
    {
        $blog = Blog::active()->where('slug', $slug)->first();

        if (!$blog) {
            return response()->json(['message' => 'Blog not found'], 404);
        }

        // Efficiently increment views in the database without modifying the Eloquent model's timestamps unnecessarily 
        // (if we don't want timestamps updated we'd use DB facade, but $blog->increment() is fine)
        $blog->increment('views');

        return response()->json(['data' => $blog]);
    }
}
