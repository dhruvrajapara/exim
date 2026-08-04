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

Route::get('/llms.txt', function () {
    $baseUrl = request()->getSchemeAndHttpHost();
    
    // Dynamic Products
    $products = Product::where('status', 'active')->get();
    $productLinks = "";
    foreach ($products as $product) {
        $productLinks .= "- [{$product->name}]({$baseUrl}/product/{$product->slug})\n";
    }

    $content = "# ABC Export\n\n";
    $content .= "ABC Export is a leading global supplier of premium quality agricultural products, food ingredients, and raw materials. We specialize in providing dehydrated vegetables, spices, and agricultural goods tailored to the high standards of multinational food distributors and regional wholesalers worldwide.\n\n";
    
    $content .= "## About\n\n";
    $content .= "ABC Export bridges the gap between local farmers and international buyers, maintaining the highest standards of quality control, sustainability, and supply chain efficiency.\n\n";
    $content .= "- [About Us]({$baseUrl}/about)\n\n";

    $content .= "## Main Pages\n\n";
    $content .= "- [Home]({$baseUrl})\n";
    $content .= "- [About Us]({$baseUrl}/about)\n";
    $content .= "- [Products]({$baseUrl}/product)\n";
    $content .= "- [Gallery]({$baseUrl}/gallery)\n\n";

    $content .= "## Product Categories\n\n";
    $content .= "- [Dehydrated Onion]({$baseUrl}/product?category=dehydrated-onion)\n";
    $content .= "- [Dehydrated Garlic]({$baseUrl}/product?category=dehydrated-garlic)\n";
    $content .= "- [Spice Powder]({$baseUrl}/product?category=spice-powder)\n";
    $content .= "- [Vegetable Powder]({$baseUrl}/product?category=vegetable-powder)\n";
    $content .= "- [Herbs]({$baseUrl}/product?category=herbs)\n\n";

    $content .= "## Specific Products\n\n";
    $content .= $productLinks . "\n";

    $content .= "## Resources\n\n";
    $content .= "- [Blog]({$baseUrl}/blog)\n\n";

    $content .= "## Contact\n\n";
    $content .= "- [Contact Us]({$baseUrl}/contact)\n";

    return response($content, 200)
        ->header('Content-Type', 'text/plain; charset=UTF-8');
});
Route::get('/{any}', function () {
    $path = public_path('index.html');
    if (file_exists($path)) {
        return file_get_contents($path);
    }
    return response('React frontend build not found in public directory.', 404);
})->where('any', '.*');
