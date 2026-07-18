<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Testimonial extends Model
{
    use HasFactory;

    protected $fillable = [
        'client_name',
        'company_name',
        'country',
        'flag_code',
        'star_rating',
        'review_text',
        'avatar_path',
        'is_active',
        'display_order',
    ];
}
