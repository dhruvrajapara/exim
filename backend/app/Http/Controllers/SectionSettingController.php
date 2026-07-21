<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\SectionSetting;

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
            'extra_data' => 'nullable|array',
        ]);

        $setting = SectionSetting::updateOrCreate(
            ['section_key' => $key],
            $validated
        );

        return response()->json(['data' => $setting, 'message' => 'Section settings updated successfully']);
    }
}
