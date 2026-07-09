<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Blog extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'featured_image',
        'short_description',
        'content',
        'published_date',
        'is_active',
        'is_featured',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'is_featured' => 'boolean',
        'published_date' => 'datetime',
    ];

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
