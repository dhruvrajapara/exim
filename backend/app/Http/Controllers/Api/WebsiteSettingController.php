<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\WebsiteSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class WebsiteSettingController extends Controller
{
    /**
     * Get all settings as a flat key-value object
     */
    public function getSettings()
    {
        $settings = WebsiteSetting::all()->pluck('value', 'key')->toArray();

        // Dynamically resolve URLs to prevent broken links if slugs change
        $this->resolveDynamicUrls($settings, 'footer_quick_links');
        $this->resolveDynamicUrls($settings, 'footer_product_links');
        $this->resolveSingleDynamicUrl($settings, 'header_btn_link');

        // Ensure we provide relative URLs for images to work with Vite proxy
        if (isset($settings['header_logo']) && $settings['header_logo']) {
            $settings['header_logo_url'] = '/storage/' . $settings['header_logo'];
        }
        if (isset($settings['footer_logo']) && $settings['footer_logo']) {
            $settings['footer_logo_url'] = '/storage/' . $settings['footer_logo'];
        }
        if (isset($settings['favicon']) && $settings['favicon']) {
            $settings['favicon_url'] = '/storage/' . $settings['favicon'];
        }
        if (isset($settings['header_btn_pdf']) && $settings['header_btn_pdf']) {
            $settings['header_btn_pdf_url'] = '/storage/' . $settings['header_btn_pdf'];
        }

        return response()->json([
            'success' => true,
            'data' => $settings
        ]);
    }

    /**
     * Update settings. Handles both text and file uploads.
     */
    public function updateSettings(Request $request)
    {
        $allInputs = $request->except(['_method', 'header_logo', 'footer_logo', 'favicon', 'header_btn_pdf']);

        // 1. Save all standard text/json fields
        foreach ($allInputs as $key => $value) {
            // If the value is an array, encode it as JSON
            if (is_array($value)) {
                $value = json_encode($value);
            }
            
            WebsiteSetting::updateOrCreate(
                ['key' => $key],
                ['value' => $value]
            );
        }

        // 2. Handle Header Logo Upload
        if ($request->hasFile('header_logo')) {
            $request->validate([
                'header_logo' => 'image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048'
            ]);

            $this->handleImageUpload($request->file('header_logo'), 'header_logo');
        }

        // 3. Handle Footer Logo Upload
        if ($request->hasFile('footer_logo')) {
            $request->validate([
                'footer_logo' => 'image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048'
            ]);

            $this->handleImageUpload($request->file('footer_logo'), 'footer_logo');
        }

        // 4. Handle Favicon Upload
        if ($request->hasFile('favicon')) {
            $request->validate([
                'favicon' => 'image|mimes:jpeg,png,jpg,gif,svg,ico,webp|max:1024'
            ]);

            $this->handleImageUpload($request->file('favicon'), 'favicon');
        }

        // 5. Handle Header PDF Upload
        if ($request->hasFile('header_btn_pdf')) {
            $request->validate([
                'header_btn_pdf' => 'mimes:pdf|max:10240'
            ]);

            $this->handleImageUpload($request->file('header_btn_pdf'), 'header_btn_pdf');
        }

        return response()->json([
            'success' => true,
            'message' => 'Website settings updated successfully.'
        ]);
    }

    /**
     * Helper to handle image upload and delete old image
     */
    private function handleImageUpload($file, $settingKey)
    {
        $oldSetting = WebsiteSetting::where('key', $settingKey)->first();

        // Delete old image if exists
        if ($oldSetting && $oldSetting->value) {
            if (Storage::disk('public')->exists($oldSetting->value)) {
                Storage::disk('public')->delete($oldSetting->value);
            }
        }

        // Store new image
        $name = Str::uuid() . '.' . $file->getClientOriginalExtension();
        $file->storeAs('branding', $name, 'public');
        $filename = 'branding/' . $name;

        // Update setting
        WebsiteSetting::updateOrCreate(
            ['key' => $settingKey],
            ['value' => $filename]
        );
    }

    /**
     * Resolve dynamic URLs for an array of links based on type and reference_id
     */
    private function resolveDynamicUrls(&$settings, $key)
    {
        if (!isset($settings[$key]) || empty($settings[$key])) return;

        $links = json_decode($settings[$key], true);
        if (!is_array($links)) return;

        foreach ($links as &$link) {
            if (isset($link['type']) && isset($link['reference_id'])) {
                if ($link['type'] === 'category') {
                    $category = \App\Models\ProductCategory::find($link['reference_id']);
                    if ($category) {
                        $link['url'] = '/product?category=' . $category->slug;
                    }
                } elseif ($link['type'] === 'product') {
                    $product = \App\Models\Product::find($link['reference_id']);
                    if ($product) {
                        $link['url'] = '/product/' . $product->slug;
                    }
                } elseif ($link['type'] === 'blog_category') {
                    // Placeholder for future blog categories
                } elseif ($link['type'] === 'blog_post') {
                    $blog = class_exists(\App\Models\Blog::class) ? \App\Models\Blog::find($link['reference_id']) : null;
                    if ($blog) {
                        $link['url'] = '/blog/' . $blog->slug;
                    }
                }
            }
        }
        $settings[$key] = json_encode($links);
    }

    /**
     * Resolve single dynamic URL for a json string setting
     */
    private function resolveSingleDynamicUrl(&$settings, $key)
    {
        if (!isset($settings[$key]) || empty($settings[$key])) return;

        $link = json_decode($settings[$key], true);
        if (!is_array($link)) return;

        if (isset($link['type']) && isset($link['reference_id'])) {
            if ($link['type'] === 'category') {
                $category = \App\Models\ProductCategory::find($link['reference_id']);
                if ($category) {
                    $link['url'] = '/product?category=' . $category->slug;
                }
            } elseif ($link['type'] === 'product') {
                $product = \App\Models\Product::find($link['reference_id']);
                if ($product) {
                    $link['url'] = '/product/' . $product->slug;
                }
            } elseif ($link['type'] === 'blog_post') {
                $blog = class_exists(\App\Models\Blog::class) ? \App\Models\Blog::find($link['reference_id']) : null;
                if ($blog) {
                    $link['url'] = '/blog/' . $blog->slug;
                }
            }
        }
        $settings[$key] = json_encode($link);
    }

    /**
     * Get all available pages for the Page Selector
     */
    public function getAvailablePages()
    {
        $pages = [
            [
                'group' => 'Static Pages',
                'items' => [
                    ['label' => 'Home', 'type' => 'static', 'reference_id' => '/', 'url' => '/'],
                    ['label' => 'About Us', 'type' => 'static', 'reference_id' => '/about', 'url' => '/about'],
                    ['label' => 'Products', 'type' => 'static', 'reference_id' => '/product', 'url' => '/product'],
                    ['label' => 'Contact Us', 'type' => 'static', 'reference_id' => '/contact', 'url' => '/contact'],
                ]
            ]
        ];

        $categories = \App\Models\ProductCategory::all();
        if ($categories->count() > 0) {
            $catItems = [];
            foreach ($categories as $cat) {
                $catItems[] = ['label' => $cat->name, 'type' => 'category', 'reference_id' => $cat->id, 'url' => '/product?category=' . $cat->slug];
            }
            $pages[] = ['group' => 'Product Categories', 'items' => $catItems];
        }

        $products = \App\Models\Product::all();
        if ($products->count() > 0) {
            $prodItems = [];
            foreach ($products as $prod) {
                $prodItems[] = ['label' => $prod->name, 'type' => 'product', 'reference_id' => $prod->id, 'url' => '/product/' . $prod->slug];
            }
            $pages[] = ['group' => 'Products', 'items' => $prodItems];
        }

        if (class_exists(\App\Models\Blog::class)) {
            $blogs = \App\Models\Blog::all();
            if ($blogs->count() > 0) {
                $blogItems = [];
                foreach ($blogs as $blog) {
                    $blogItems[] = ['label' => $blog->title ?? $blog->name, 'type' => 'blog_post', 'reference_id' => $blog->id, 'url' => '/blog/' . $blog->slug];
                }
                $pages[] = ['group' => 'Blog Posts', 'items' => $blogItems];
            }
        }

        return response()->json([
            'success' => true,
            'data' => $pages
        ]);
    }
}
