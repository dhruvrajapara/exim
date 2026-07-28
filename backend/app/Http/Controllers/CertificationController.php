<?php

namespace App\Http\Controllers;

use App\Models\Certification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class CertificationController extends Controller
{
    public function index()
    {
        $certifications = Certification::active()
            ->orderBy('display_order', 'asc')
            ->get();
            
        return response()->json(['data' => $certifications]);
    }
    public function adminIndex()
    {
        $certifications = Certification::orderBy('display_order', 'asc')->get();
        return response()->json(['data' => $certifications]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'authority_name' => 'required|string|max:255',
            'logo' => 'required|image|mimes:jpeg,png,jpg,gif,svg,webp|max:5120',
        ]);

        $data = $request->except('logo');
        $data['is_active'] = $request->boolean('is_active', true);
        
        if (empty($data['verification_badge_text'])) {
            $data['verification_badge_text'] = 'Verified Registration';
        }
        
        if ($request->hasFile('logo')) {
            $image = $request->file('logo');
            $ext = strtolower($image->getClientOriginalExtension());
            if ($ext === 'svg') {
                $path = $image->store('certifications', 'public');
                $data['logo_path'] = '/storage/' . $path;
            } else {
                $manager = new ImageManager(new Driver());
                $img = $manager->read($image);
                $encoded = $img->toWebp(75);
                $filename = 'certifications/' . uniqid() . '.webp';
                Storage::disk('public')->put($filename, (string) $encoded);
                $data['logo_path'] = '/storage/' . $filename;
            }
        }

        $certification = Certification::create($data);

        return response()->json([
            'message' => 'Certification created successfully',
            'data' => $certification
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $certification = Certification::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'authority_name' => 'required|string|max:255',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:5120',
        ]);

        $data = $request->except('logo');
        $data['is_active'] = $request->boolean('is_active', true);
        
        if (empty($data['verification_badge_text'])) {
            $data['verification_badge_text'] = 'Verified Registration';
        }
        
        if ($request->hasFile('logo')) {
            $image = $request->file('logo');
            $ext = strtolower($image->getClientOriginalExtension());
            if ($ext === 'svg') {
                $path = $image->store('certifications', 'public');
                $data['logo_path'] = '/storage/' . $path;
            } else {
                $manager = new ImageManager(new Driver());
                $img = $manager->read($image);
                $encoded = $img->toWebp(75);
                $filename = 'certifications/' . uniqid() . '.webp';
                Storage::disk('public')->put($filename, (string) $encoded);
                $data['logo_path'] = '/storage/' . $filename;
            }
        }

        $certification->update($data);

        return response()->json([
            'message' => 'Certification updated successfully',
            'data' => $certification
        ]);
    }

    public function destroy($id)
    {
        $certification = Certification::findOrFail($id);
        $certification->delete();

        return response()->json([
            'message' => 'Certification deleted successfully'
        ]);
    }
}
