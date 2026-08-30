<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CampaignLog extends Model
{
    protected $fillable = [
        'subject',
        'recipient_email',
        'recipient_name',
        'recipient_type',
        'status',
        'error_message',
        'pdf_attachment_name'
    ];
}
