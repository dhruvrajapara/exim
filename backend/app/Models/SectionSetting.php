<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SectionSetting extends Model
{
    protected $fillable = [
        'section_key',
        'subtitle',
        'title',
        'description',
        'extra_data',
    ];

    protected $casts = [
        'extra_data' => 'array',
    ];
}
