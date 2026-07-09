<?php

namespace Database\Seeders;

use App\Models\HeroSlide;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class HeroSlideSeeder extends Seeder
{
    public function run(): void
    {
        HeroSlide::create([
            'label' => 'Next-Gen Analytics',
            'heading' => 'Empower Your Enterprise With AI-Driven Insights',
            'description' => 'Unleash the full potential of your data. Scale seamlessly and securely with our enterprise-grade architecture tailored for modern businesses.',
            'primary_btn_text' => 'Get Started',
            'primary_btn_url' => '/contact',
            'secondary_btn_text' => 'Learn More',
            'secondary_btn_url' => '/about',
            'image_path' => '/hero.png',
            'image_alt' => 'Abstract Enterprise AI Graph',
            'image_title' => 'AI Analytics Dashboard',
            'display_order' => 1,
            'is_active' => true,
        ]);

        HeroSlide::create([
            'label' => 'Secure & Scalable',
            'heading' => 'Built for Global Performance & Reliability',
            'description' => 'Experience lightning-fast load times and rock-solid security. Our infrastructure handles millions of requests without breaking a sweat.',
            'primary_btn_text' => 'View Features',
            'primary_btn_url' => '/product',
            'secondary_btn_text' => null,
            'secondary_btn_url' => null,
            'image_path' => '/hero.png', // Reusing placeholder for now
            'image_alt' => 'Secure Server Architecture',
            'image_title' => 'Global Infrastructure',
            'display_order' => 2,
            'is_active' => true,
        ]);

        HeroSlide::create([
            'label' => 'Intelligent Automation',
            'heading' => 'Streamline Operations Effortlessly',
            'description' => 'Automate tedious tasks and focus on what matters. Let our AI platform handle the heavy lifting while you drive growth.',
            'primary_btn_text' => 'Start Free Trial',
            'primary_btn_url' => '/contact',
            'secondary_btn_text' => 'Read Documentation',
            'secondary_btn_url' => '/docs',
            'image_path' => '/hero.png',
            'image_alt' => 'Automation Workflow',
            'image_title' => 'Workflow Automation',
            'display_order' => 3,
            'is_active' => true,
        ]);
    }
}
