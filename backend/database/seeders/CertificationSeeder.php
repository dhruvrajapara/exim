<?php

namespace Database\Seeders;

use App\Models\Certification;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CertificationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $certs = [
            [
                'name' => 'GST Registration',
                'authority_name' => 'Government of India',
                'logo_path' => '/hero.png', // Temporary placeholder
                'short_description' => 'Goods and Services Tax registered enterprise ensuring fully compliant financial transactions.',
            ],
            [
                'name' => 'FSSAI License',
                'authority_name' => 'Food Safety and Standards Authority',
                'logo_path' => '/hero.png',
                'short_description' => 'Certified to handle, export, and distribute premium food and agricultural products globally.',
            ],
            [
                'name' => 'APEDA Registration',
                'authority_name' => 'Ministry of Commerce & Industry',
                'logo_path' => '/hero.png',
                'short_description' => 'Authorized exporter of scheduled agricultural and processed food products.',
            ],
            [
                'name' => 'Import Export Code',
                'authority_name' => 'Directorate General of Foreign Trade',
                'logo_path' => '/hero.png',
                'short_description' => 'Officially licensed to conduct international trade and cross-border commerce operations.',
            ]
        ];

        foreach ($certs as $index => $cert) {
            Certification::create([
                'name' => $cert['name'],
                'authority_name' => $cert['authority_name'],
                'logo_path' => $cert['logo_path'],
                'short_description' => $cert['short_description'],
                'verification_badge_text' => 'Verified Registration',
                'is_active' => true,
                'display_order' => $index + 1,
            ]);
        }
    }
}
