<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\File;
use App\Models\Product;
use App\Models\Blog;

Route::get('/sitemap.xml', function () {
    $baseUrl = request()->getSchemeAndHttpHost();
    
    // Core static pages
    $urls = [
        ['loc' => $baseUrl . '/', 'priority' => '1.0'],
        ['loc' => $baseUrl . '/about', 'priority' => '0.8'],
        ['loc' => $baseUrl . '/product', 'priority' => '0.9'],
        ['loc' => $baseUrl . '/blog', 'priority' => '0.8'],
        ['loc' => $baseUrl . '/gallery', 'priority' => '0.7'],
        ['loc' => $baseUrl . '/contact', 'priority' => '0.8'],
    ];

    // Dynamic Products
    $products = Product::where('status', 'active')->get();
    foreach ($products as $product) {
        $urls[] = [
            'loc' => $baseUrl . '/product/' . $product->slug,
            'priority' => '0.9'
        ];
    }

    // Dynamic Blogs
    $blogs = Blog::where('status', 'published')->get();
    foreach ($blogs as $blog) {
        $urls[] = [
            'loc' => $baseUrl . '/blog/' . $blog->slug,
            'priority' => '0.8'
        ];
    }

    // Generate XML
    $xml = new \SimpleXMLElement('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>');
    
    foreach ($urls as $urlData) {
        $url = $xml->addChild('url');
        $url->addChild('loc', htmlspecialchars($urlData['loc']));
        $url->addChild('changefreq', 'weekly');
        $url->addChild('priority', $urlData['priority']);
    }

    return response($xml->asXML(), 200)
        ->header('Content-Type', 'application/xml');
});

Route::get('/{any}', function () {
    $path = public_path('index.html');
    if (file_exists($path)) {
        return file_get_contents($path);
    }
    return response('React frontend build not found in public directory.', 404);
})->where('any', '.*');
