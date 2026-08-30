<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Inquiry extends Model
{
    protected $fillable = [
        'name',
        'company',
        'email',
        'phone',
        'country',
        'product',
        'quantity',
        'quantity_unit',
        'packaging_requirement',
        'destination_port',
        'incoterm',
        'private_labelling',
        'sample_required',
        'message',
        'status',
    ];
}
