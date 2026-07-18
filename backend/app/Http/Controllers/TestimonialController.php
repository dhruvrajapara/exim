<?php

namespace App\Http\Controllers;

use App\Models\Testimonial;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class TestimonialController extends Controller
{
    /**
     * Get all active testimonials for public frontend
     */
    public function index()
    {
        $testimonials = Testimonial::where('is_active', true)
            ->orderBy('display_order', 'asc')
            ->orderBy('created_at', 'desc')
            ->get();

        // Add full URL path for avatars
        $testimonials->transform(function ($item) {
            $item->avatar_url = $item->avatar_path ? url('storage/' . $item->avatar_path) : null;
            return $item;
        });

        return response()->json([
            'status' => 'success',
            'data' => $testimonials
        ]);
    }

    /**
     * Get all testimonials for admin panel
     */
    public function adminIndex()
    {
        $testimonials = Testimonial::orderBy('display_order', 'asc')
            ->orderBy('created_at', 'desc')
            ->get();

        $testimonials->transform(function ($item) {
            $item->avatar_url = $item->avatar_path ? url('storage/' . $item->avatar_path) : null;
            return $item;
        });

        return response()->json([
            'status' => 'success',
            'data' => $testimonials
        ]);
    }

    /**
     * Store a newly created testimonial
     */
    public function store(Request $request)
    {
        $request->validate([
            'client_name' => 'required|string|max:255',
            'company_name' => 'nullable|string|max:255',
            'country' => 'nullable|string|max:255',
            'flag_code' => 'nullable|string|max:10',
            'star_rating' => 'required|integer|min:1|max:5',
            'review_text' => 'required|string',
            'display_order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $data = $request->except(['avatar']);
        
        if ($request->has('is_active')) {
            $data['is_active'] = filter_var($request->is_active, FILTER_VALIDATE_BOOLEAN);
        }

        if ($request->hasFile('avatar')) {
            $image = $request->file('avatar');
            $fileName = time() . '_' . Str::slug($request->client_name) . '.' . $image->getClientOriginalExtension();
            $path = $image->storeAs('testimonials', $fileName, 'public');
            $data['avatar_path'] = $path;
        }

        $testimonial = Testimonial::create($data);

        return response()->json([
            'status' => 'success',
            'message' => 'Testimonial created successfully',
            'data' => $testimonial
        ], 201);
    }

    /**
     * Update the specified testimonial
     */
    public function update(Request $request, $id)
    {
        $testimonial = Testimonial::findOrFail($id);

        $request->validate([
            'client_name' => 'required|string|max:255',
            'company_name' => 'nullable|string|max:255',
            'country' => 'nullable|string|max:255',
            'flag_code' => 'nullable|string|max:10',
            'star_rating' => 'required|integer|min:1|max:5',
            'review_text' => 'required|string',
            'display_order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $data = $request->except(['avatar']);
        
        if ($request->has('is_active')) {
            $data['is_active'] = filter_var($request->is_active, FILTER_VALIDATE_BOOLEAN);
        }

        if ($request->hasFile('avatar')) {
            // Delete old image if exists
            if ($testimonial->avatar_path && Storage::disk('public')->exists($testimonial->avatar_path)) {
                Storage::disk('public')->delete($testimonial->avatar_path);
            }

            $image = $request->file('avatar');
            $fileName = time() . '_' . Str::slug($request->client_name) . '.' . $image->getClientOriginalExtension();
            $path = $image->storeAs('testimonials', $fileName, 'public');
            $data['avatar_path'] = $path;
        }

        $testimonial->update($data);

        return response()->json([
            'status' => 'success',
            'message' => 'Testimonial updated successfully',
            'data' => $testimonial
        ]);
    }

    /**
     * Remove the specified testimonial
     */
    public function destroy($id)
    {
        $testimonial = Testimonial::findOrFail($id);

        if ($testimonial->avatar_path && Storage::disk('public')->exists($testimonial->avatar_path)) {
            Storage::disk('public')->delete($testimonial->avatar_path);
        }

        $testimonial->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Testimonial deleted successfully'
        ]);
    }
}
