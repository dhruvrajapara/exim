<?php

namespace App\Http\Controllers;

use App\Models\Certification;
use Illuminate\Http\Request;

class CertificationController extends Controller
{
    public function index()
    {
        $certifications = Certification::active()
            ->orderBy('display_order', 'asc')
            ->get();
            
        return response()->json(['data' => $certifications]);
    }
}
