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
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:5120',
        ]);

        $data = $request->except('logo');
        $data['is_active'] = $request->boolean('is_active', true);
        
        if ($request->hasFile('logo')) {
            $path = $request->file('logo')->store('certifications', 'public');
            $data['logo_path'] = '/storage/' . $path;
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
        
        if ($request->hasFile('logo')) {
            $path = $request->file('logo')->store('certifications', 'public');
            $data['logo_path'] = '/storage/' . $path;
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
