<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('footer_settings', function (Blueprint $table) {
            $table->id();
            $table->string('company_logo')->nullable();
            $table->text('company_description')->nullable();
            $table->json('social_links')->nullable();
            $table->json('quick_links')->nullable();
            $table->json('office_addresses')->nullable();
            $table->json('contact_numbers')->nullable();
            $table->json('email_addresses')->nullable();
            $table->string('copyright_text')->nullable();
            $table->json('bottom_links')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('footer_settings');
    }
};
