<?php

namespace Database\Seeders;

use App\Models\Blog;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Carbon\Carbon;

class BlogSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $blogs = [
            'How AI is Revolutionizing the Export Industry in 2026',
            'Understanding Global Logistics and Compliance Regulations',
            'The Future of Quantum Cloud Processing in B2B Trade',
            '5 Tips for Navigating International Export Taxes',
            'Optimizing Supply Chains with Edge Computing Modules',
            'Why Secure Data Vaults are Critical for Global Commerce',
            'A Comprehensive Guide to FSSAI Export Licensing',
            'Top Markets to Export Agricultural Products This Year'
        ];

        foreach ($blogs as $index => $title) {
            Blog::create([
                'title' => $title,
                'slug' => Str::slug($title),
                'featured_image' => '/hero.png', // Temporary placeholder
                'short_description' => 'Discover the latest insights, strategies, and industry news regarding ' . strtolower($title) . ' in this comprehensive analysis.',
                'content' => 'Full article content goes here. This is dynamic content managed by the Laravel Admin panel.',
                'published_date' => Carbon::now()->subDays($index * 2), // Stagger dates
                'is_active' => true,
                'is_featured' => $index < 3,
            ]);
        }
    }
}
