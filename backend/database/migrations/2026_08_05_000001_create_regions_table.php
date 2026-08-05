<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement('CREATE EXTENSION IF NOT EXISTS pg_trgm');

        Schema::create('regions', function (Blueprint $table) {
            $table->id();
            $table->string('code', 50);
            $table->string('name', 100);
            $table->string('name_gujarati', 100)->nullable();
            $table->smallInteger('display_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestampsTz();
            $table->softDeletesTz();

            $table->unique('code', 'uq_regions_code');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('regions');
        DB::statement('DROP EXTENSION IF EXISTS pg_trgm');
    }
};
