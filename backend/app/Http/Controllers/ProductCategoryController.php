<?php

namespace App\Http\Controllers;

use App\Models\ProductCategory;
use Illuminate\Http\Request;

class ProductCategoryController extends Controller
{
    /**
     * Display a listing of the active resource.
     */
    public function index()
    {
        // Return max 4 active categories ordered by display_order for Homepage
        $categories = ProductCategory::active()->ordered()->take(4)->get();
        return response()->json(['data' => $categories]);
    }
}
