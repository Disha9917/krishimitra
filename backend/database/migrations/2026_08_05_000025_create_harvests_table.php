<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('harvests', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('farmer_crop_id')->nullable();
            $table->unsignedBigInteger('crop_id');
            $table->date('harvest_date');
            $table->decimal('quantity_kg', 12, 2);
            $table->decimal('yield_per_acre', 10, 2)->nullable();
            $table->decimal('moisture_pct', 5, 2)->nullable();
            $table->string('quality_grade', 20)->nullable();
            $table->timestampsTz();
            $table->softDeletesTz();

            $table->index('user_id', 'idx_harvests_user_id');
            $table->index(['crop_id', 'harvest_date'], 'idx_harvests_crop_id_date');
            $table->foreign('user_id')->references('id')->on('users');
            $table->foreign('farmer_crop_id')->references('id')->on('farmer_crops');
            $table->foreign('crop_id')->references('id')->on('crops');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('harvests');
    }
};
