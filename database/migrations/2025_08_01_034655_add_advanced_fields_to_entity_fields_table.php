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
        Schema::table('entity_fields', function (Blueprint $table) {
            $table->text('default_value')->nullable()->after('is_required');
            $table->boolean('is_readonly')->default(false)->after('default_value');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('entity_fields', function (Blueprint $table) {
            $table->dropColumn(['default_value', 'is_readonly']);
        });
    }
};
