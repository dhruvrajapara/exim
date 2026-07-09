<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AboutStatistic extends Model
{
    use HasFactory;

    protected $fillable = [
        'about_section_id',
        'number_value',
        'title',
        'icon',
        'display_order',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'display_order' => 'integer',
    ];

    public function aboutSection()
    {
        return $this->belongsTo(AboutSection::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
