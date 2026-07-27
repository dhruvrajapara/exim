<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\BlogCategory;
use Illuminate\Support\Str;

$categories = ['Export Guides', 'Market Trends', 'Product Insights', 'Company News'];
foreach ($categories as $c) {
    BlogCategory::firstOrCreate(['slug' => Str::slug($c)], ['name' => $c]);
}
echo "Seeded successfully!";
