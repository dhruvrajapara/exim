<?php

namespace Database\Seeders;

use App\Models\FooterSetting;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class FooterSettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        FooterSetting::create([
            'company_logo' => '/hero.png', // Temporary placeholder for the white logo
            'company_description' => 'BiteExport is a trusted merchant exporter specializing in premium dehydrated vegetables, spices, and agricultural products, serving buyers across international markets.',
            'social_links' => [
                ['platform' => 'facebook', 'url' => 'https://facebook.com'],
                ['platform' => 'instagram', 'url' => 'https://instagram.com'],
                ['platform' => 'linkedin', 'url' => 'https://linkedin.com'],
                ['platform' => 'youtube', 'url' => 'https://youtube.com'],
                ['platform' => 'whatsapp', 'url' => 'https://whatsapp.com'],
            ],
            'quick_links' => [
                ['label' => 'Home', 'url' => '/'],
                ['label' => 'About', 'url' => '/about'],
                ['label' => 'Products', 'url' => '/products'],
                ['label' => 'Team', 'url' => '/team'],
                ['label' => 'Blog', 'url' => '/blog'],
                ['label' => 'Gallery', 'url' => '/gallery'],
                ['label' => 'Contact', 'url' => '/contact'],
            ],
            'office_addresses' => [
                '123 Export Avenue, Global Trade Center, Mumbai, India',
                '45 International Business Hub, Dubai, UAE'
            ],
            'contact_numbers' => [
                '+91 98765 43210',
                '+971 50 123 4567'
            ],
            'email_addresses' => [
                'info@biteexport.com',
                'sales@biteexport.com'
            ],
            'copyright_text' => '© ' . date('Y') . ' BiteExport. All Rights Reserved.',
            'bottom_links' => [
                ['label' => 'Privacy Policy', 'url' => '/privacy'],
                ['label' => 'Terms & Conditions', 'url' => '/terms'],
                ['label' => 'Sitemap', 'url' => '/sitemap'],
            ]
        ]);
    }
}
