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
        Schema::table('entity_settings', function (Blueprint $table) {
            $table->text('allowed_domains')
                ->nullable()
                ->after('api_key') // posisinya setelah api_key, bisa diganti sesuai kebutuhan
                ->comment('Daftar domain yang diizinkan, pisahkan dengan koma');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('entity_settings', function (Blueprint $table) {
            $table->dropColumn('allowed_domains');
        });
    }
};
