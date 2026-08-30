<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('campaign_logs', function (Blueprint $table) {
            $table->id();
            $table->string('subject');
            $table->string('recipient_email');
            $table->string('recipient_name')->nullable();
            $table->string('recipient_type');
            $table->enum('status', ['sent', 'failed']);
            $table->text('error_message')->nullable();
            $table->string('pdf_attachment_name')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('campaign_logs');
    }
};
