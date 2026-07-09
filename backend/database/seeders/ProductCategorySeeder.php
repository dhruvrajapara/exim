<?php

namespace Database\Seeders;

use App\Models\ProductCategory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'AI Hardware',
                'description' => 'High-performance computing clusters and edge devices built for deep learning.',
                'image_path' => '/hero.png', // Reusing placeholder hero image
                'image_alt' => 'AI Processing Units',
                'image_title' => 'Hardware Solutions',
            ],
            [
                'name' => 'Cloud Infrastructure',
                'description' => 'Scalable enterprise cloud solutions enabling global infrastructure deployment.',
                'image_path' => '/hero.png',
                'image_alt' => 'Cloud Servers Data Center',
                'image_title' => 'Cloud Infrastructure',
            ],
            [
                'name' => 'Enterprise Software',
                'description' => 'Custom software solutions and AI integration for global business operations.',
                'image_path' => '/hero.png',
                'image_alt' => 'Software Code Interface',
                'image_title' => 'Software Solutions',
            ],
            [
                'name' => 'Security Appliances',
                'description' => 'Next-generation firewalls and threat detection systems powered by ML.',
                'image_path' => '/hero.png',
                'image_alt' => 'Cyber Security Lock',
                'image_title' => 'Network Security',
            ],
        ];

        foreach ($categories as $index => $cat) {
            ProductCategory::create([
                'name' => $cat['name'],
                'slug' => Str::slug($cat['name']),
                'image_path' => $cat['image_path'],
                'image_alt' => $cat['image_alt'],
                'image_title' => $cat['image_title'],
                'description' => $cat['description'],
                'display_order' => $index + 1,
                'is_active' => true,
            ]);
        }
    }
}
