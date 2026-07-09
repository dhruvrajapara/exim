<?php

namespace App\Http\Controllers;

use App\Models\HeroSlide;
use Illuminate\Http\Request;

class HeroSlideController extends Controller
{
    /**
     * Display a listing of the active resource.
     */
    public function index()
    {
        // Return max 3 active slides ordered by display_order
        $slides = HeroSlide::active()->ordered()->take(3)->get();
        return response()->json(['data' => $slides]);
    }
}
