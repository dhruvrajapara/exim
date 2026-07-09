<?php

namespace App\Http\Controllers;

use App\Models\FooterSetting;
use App\Models\ProductCategory;
use Illuminate\Http\Request;

class FooterSettingController extends Controller
{
    public function index()
    {
        $footer = FooterSetting::first();
        
        // Dynamically fetch active product categories to inject into the footer response
        $categories = ProductCategory::active()->orderBy('display_order', 'asc')->limit(6)->get();
        
        return response()->json([
            'footer' => $footer,
            'categories' => $categories
        ]);
    }
}
