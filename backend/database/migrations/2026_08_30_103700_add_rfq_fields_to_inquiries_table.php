<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('inquiries', function (Blueprint $table) {
            $table->string('quantity')->nullable()->after('product');
            $table->string('quantity_unit')->nullable()->after('quantity');
            $table->string('packaging_requirement')->nullable()->after('quantity_unit');
            $table->string('destination_port')->nullable()->after('packaging_requirement');
            $table->string('incoterm')->nullable()->after('destination_port');
            $table->string('private_labelling')->nullable()->after('incoterm');
            $table->string('sample_required')->nullable()->after('private_labelling');
        });
    }

    public function down(): void
    {
        Schema::table('inquiries', function (Blueprint $table) {
            $table->dropColumn([
                'quantity',
                'quantity_unit',
                'packaging_requirement',
                'destination_port',
                'incoterm',
                'private_labelling',
                'sample_required',
            ]);
        });
    }
};
