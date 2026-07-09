<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AboutSection extends Model
{
    use HasFactory;

    protected $fillable = [
        'label',
        'heading',
        'description',
        'image_path',
        'image_alt',
        'image_title',
        'btn_text',
        'btn_url',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function statistics()
    {
        return $this->hasMany(AboutStatistic::class)->orderBy('display_order', 'asc');
    }

    public function activeStatistics()
    {
        return $this->hasMany(AboutStatistic::class)->where('is_active', true)->orderBy('display_order', 'asc');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
