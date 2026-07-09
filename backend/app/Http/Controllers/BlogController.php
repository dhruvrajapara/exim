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
}
