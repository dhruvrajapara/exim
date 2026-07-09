<?php

namespace App\Http\Controllers;

use App\Models\AboutSection;
use Illuminate\Http\Request;

class AboutSectionController extends Controller
{
    public function index()
    {
        // Return the first active about section with its active statistics
        $aboutSection = AboutSection::with('activeStatistics')->active()->first();
        
        return response()->json(['data' => $aboutSection]);
    }
}
