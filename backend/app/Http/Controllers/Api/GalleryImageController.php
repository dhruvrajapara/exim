<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\GalleryImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class GalleryImageController extends Controller
{
    public function index(Request $request)
    {
        $query = GalleryImage::query()->orderBy('order_index', 'asc')->orderBy('id', 'desc');
        
        if ($request->has('active_only') && $request->active_only == '1') {
            $query->where('is_active', true);
        }

        $images = $query->get();

        // Append full url to image_path
        $images->transform(function ($item) {
            if ($item->image_path && !str_starts_with($item->image_path, 'http')) {
                $item->image_url = url('storage/' . $item->image_path);
            } else {
                $item->image_url = $item->image_path;
            }
            return $item;
        });

        return response()->json([
            'status' => 'success',
            'data' => $images
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'image' => 'required|image|mimes:jpeg,png,jpg,webp|max:20480', // 20MB
            'description' => 'nullable|string',
            'country' => 'nullable|string|max:255',
            'date_text' => 'nullable|string|max:255',
            'is_active' => 'nullable|boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $validator->validated();
        
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('gallery', 'public');
            $data['image_path'] = $path;
        }

        // Default active if not passed
        if (!isset($data['is_active'])) {
            $data['is_active'] = true;
        }

        $galleryImage = GalleryImage::create($data);

        return response()->json([
            'status' => 'success',
            'message' => 'Image added to gallery successfully.',
            'data' => $galleryImage
        ]);
    }

    public function update(Request $request, $id)
    {
        $galleryImage = GalleryImage::find($id);

        if (!$galleryImage) {
            return response()->json(['status' => 'error', 'message' => 'Image not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:20480',
            'description' => 'nullable|string',
            'country' => 'nullable|string|max:255',
            'date_text' => 'nullable|string|max:255',
            'is_active' => 'nullable|boolean',
            'order_index' => 'nullable|integer'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $validator->validated();

        if ($request->hasFile('image')) {
            // Delete old image
            if ($galleryImage->image_path && Storage::disk('public')->exists($galleryImage->image_path)) {
                Storage::disk('public')->delete($galleryImage->image_path);
            }
            $path = $request->file('image')->store('gallery', 'public');
            $data['image_path'] = $path;
        }

        $galleryImage->update($data);

        return response()->json([
            'status' => 'success',
            'message' => 'Gallery image updated successfully.',
            'data' => $galleryImage
        ]);
    }

    public function destroy($id)
    {
        $galleryImage = GalleryImage::find($id);

        if (!$galleryImage) {
            return response()->json(['status' => 'error', 'message' => 'Image not found'], 404);
        }

        if ($galleryImage->image_path && Storage::disk('public')->exists($galleryImage->image_path)) {
            Storage::disk('public')->delete($galleryImage->image_path);
        }

        $galleryImage->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Gallery image deleted successfully.'
        ]);
    }
}
