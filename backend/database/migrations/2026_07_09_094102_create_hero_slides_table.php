<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('hero_slides', function (Blueprint $table) {
            $table->id();
            $table->string('label')->nullable();
            $table->string('heading');
            $table->text('description')->nullable();
            $table->string('primary_btn_text');
            $table->string('primary_btn_url');
            $table->string('secondary_btn_text')->nullable();
            $table->string('secondary_btn_url')->nullable();
            $table->string('image_path');
            $table->string('image_alt');
            $table->string('image_title')->nullable();
            $table->integer('display_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('hero_slides');
    }
};
