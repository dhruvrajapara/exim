<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FooterSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_logo',
        'company_description',
        'social_links',
        'quick_links',
        'office_addresses',
        'contact_numbers',
        'email_addresses',
        'copyright_text',
        'bottom_links',
    ];

    protected $casts = [
        'social_links' => 'array',
        'quick_links' => 'array',
        'office_addresses' => 'array',
        'contact_numbers' => 'array',
        'email_addresses' => 'array',
        'bottom_links' => 'array',
    ];
}
