<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function featured()
    {
        $products = Product::active()
            ->featured()
            ->orderBy('display_order', 'asc')
            ->limit(8)
            ->get();
            
        return response()->json(['data' => $products]);
    }
}
