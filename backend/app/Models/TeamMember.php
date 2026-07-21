<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TeamMember extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'designation',
        'description',
        'image',
        'email',
        'linkedin',
        'whatsapp',
        'display_order',
        'featured',
        'status',
    ];

    protected $casts = [
        'featured' => 'boolean',
        'status' => 'boolean',
    ];

    public function scopeActive($query)
    {
        return $query->where('status', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('display_order', 'asc');
    }
}
