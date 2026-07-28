<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\SectionSetting;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class SectionSettingController extends Controller
{
    public function index($key)
    {
        $setting = SectionSetting::where('section_key', $key)->first();
        
        if (!$setting) {
            return response()->json(['data' => null]);
        }

        return response()->json(['data' => $setting]);
    }

    public function update(Request $request, $key)
    {
        $validated = $request->validate([
            'subtitle' => 'nullable|string|max:255',
            'title' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|max:5120',
        ]);

        $extraData = [];
        if ($request->has('extra_data')) {
            $extraDataInput = $request->input('extra_data');
            if (is_string($extraDataInput)) {
                $extraData = json_decode($extraDataInput, true) ?? [];
            } else if (is_array($extraDataInput)) {
                $extraData = $extraDataInput;
            }
        }

        if ($request->hasFile('image')) {
            $manager = new ImageManager(new Driver());
            $image = $manager->read($request->file('image'));
            $encoded = $image->toWebp(75);
            $filename = 'section_settings/bg_' . time() . '_' . uniqid() . '.webp';
            Storage::disk('public')->put($filename, (string) $encoded);
            $extraData['backgroundImage'] = '/storage/' . $filename;
        } else if ($request->has('remove_image') && $request->boolean('remove_image')) {
            $extraData['backgroundImage'] = null;
        }

        $validated['extra_data'] = empty($extraData) ? null : $extraData;

        $setting = SectionSetting::updateOrCreate(
            ['section_key' => $key],
            $validated
        );

        return response()->json(['data' => $setting, 'message' => 'Section settings updated successfully']);
    }
}
