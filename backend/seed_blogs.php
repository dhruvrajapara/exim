<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Blog;
use Illuminate\Support\Str;

$allBlogs = [
    [ 'title' => 'Top 5 Spices in Demand Globally', 'category' => 'Market Trends', 'short_description' => 'An analysis of the most sought-after Indian spices in the international market.' ],
    [ 'title' => 'How We Maintain Food Safety Standards', 'category' => 'Company News', 'short_description' => 'A deep dive into our quality control processes and certifications.' ],
    [ 'title' => 'Benefits of Dehydrated Garlic', 'category' => 'Product Insights', 'short_description' => 'Why more food manufacturers are switching to dehydrated garlic powder.' ],
    [ 'title' => 'Navigating European Import Laws', 'category' => 'Export Guides', 'short_description' => 'Everything you need to know about exporting agriculture products to the EU.' ]
];

foreach ($allBlogs as $b) {
    Blog::firstOrCreate(['slug' => Str::slug($b['title'])], [
        'title' => $b['title'],
        'short_description' => $b['short_description'],
        'featured_image' => 'https://images.unsplash.com/photo-1615484477201-cb8633783a60?w=600&q=80',
        'content' => '<h2>' . $b['title'] . '</h2><p>' . $b['short_description'] . '</p>',
        'published_date' => now(),
        'views' => 12450
    ]);
}
echo "Seeded successfully!";
