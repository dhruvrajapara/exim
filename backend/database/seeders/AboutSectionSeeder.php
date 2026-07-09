<?php

namespace Database\Seeders;

use App\Models\AboutSection;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AboutSectionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $section = AboutSection::create([
            'label' => 'About BiteExport',
            'heading' => 'Empowering Global Trade Through Innovation & Trust',
            'description' => 'BiteExport is a premier international trading enterprise bridging the gap between innovative manufacturers and global markets. We ensure seamless logistics, top-tier quality assurance, and robust supply chain networks to deliver excellence worldwide.',
            'image_path' => '/hero.png', // Using existing placeholder
            'image_alt' => 'BiteExport Global Logistics',
            'image_title' => 'Global Logistics',
            'btn_text' => 'View More Details',
            'btn_url' => '/about',
            'is_active' => true,
        ]);

        $stats = [
            ['number_value' => '4+', 'title' => 'Years Experience'],
            ['number_value' => '50+', 'title' => 'Successful Shipments'],
            ['number_value' => '40+', 'title' => 'Global Buyers'],
            ['number_value' => '4+', 'title' => 'Countries Served'],
        ];

        foreach ($stats as $index => $stat) {
            $section->statistics()->create([
                'number_value' => $stat['number_value'],
                'title' => $stat['title'],
                'display_order' => $index + 1,
                'is_active' => true,
            ]);
        }
    }
}
