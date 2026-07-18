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
        Schema::table('products', function (Blueprint $table) {
            $table->foreignId('category_id')->nullable()->constrained('product_categories')->onDelete('set null')->after('slug');
            $table->longText('full_description')->nullable()->after('short_description');
            $table->json('specifications')->nullable()->after('full_description');
            $table->json('features')->nullable()->after('specifications');
            $table->json('gallery')->nullable()->after('features');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropForeign(['category_id']);
            $table->dropColumn(['category_id', 'full_description', 'specifications', 'features', 'gallery']);
        });
    }
};
