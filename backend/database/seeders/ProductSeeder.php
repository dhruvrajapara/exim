<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = [
            'Enterprise AI Hardware Server',
            'Quantum Cloud Processor',
            'Global Logistics Firewall',
            'Secure Data Vault',
            'Neural Network Switch',
            'Automated Routing Gateway',
            'Edge Computing Module',
            'Distributed Storage Array'
        ];

        foreach ($products as $index => $name) {
            Product::create([
                'name' => $name,
                'slug' => Str::slug($name),
                'image_path' => '/hero.png', // Fallback to existing placeholder
                'image_alt' => $name,
                'image_title' => $name,
                'short_description' => 'Premium enterprise-grade solution designed for robust performance.',
                'is_active' => true,
                'is_featured' => true,
                'display_order' => $index + 1,
            ]);
        }
    }
}
