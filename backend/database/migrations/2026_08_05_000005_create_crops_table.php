<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('crops', function (Blueprint $table) {
            $table->id();
            $table->string('code', 50);
            $table->string('name', 100);
            $table->string('name_gujarati', 100);
            $table->string('category', 50)->default('traditional');
            $table->boolean('is_premium')->default(false);
            $table->string('base_yield', 50)->nullable();
            $table->decimal('avg_price_per_qtl', 10, 2)->nullable();
            $table->string('season', 30)->nullable();
            $table->string('sowing_period', 100)->nullable();
            $table->string('crop_icon_url', 255)->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestampsTz();
            $table->softDeletesTz();

            $table->unique('code', 'uq_crops_code');
            $table->index('season', 'idx_crops_season');
            $table->index('category', 'idx_crops_category');
        });
        DB::statement("ALTER TABLE crops ADD CONSTRAINT crops_category_check CHECK (category IN ('traditional', 'high-value', 'controlled-environment'))");
    }

    public function down(): void
    {
        Schema::dropIfExists('crops');
    }
};
