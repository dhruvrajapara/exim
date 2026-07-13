<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SectionSettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\SectionSetting::updateOrCreate(
            ['section_key' => 'home_categories'],
            [
                'subtitle' => 'OUR CATEGORIES',
                'title' => 'Premium Export Products',
                'description' => 'Explore our diverse range of high-quality agricultural exports. We ensure international standards of quality, packing, and timely delivery.',
            ]
        );
    }
}
