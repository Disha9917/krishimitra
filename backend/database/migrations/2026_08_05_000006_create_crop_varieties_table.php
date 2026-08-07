<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('crop_varieties', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('crop_id');
            $table->string('name', 100);
            $table->boolean('is_disease_resistant')->default(false);
            $table->smallInteger('avg_duration_days')->nullable();
            $table->timestampsTz();
            $table->softDeletesTz();

            $table->unique(['crop_id', 'name'], 'uq_crop_varieties_crop_name');
            $table->index('crop_id', 'idx_crop_varieties_crop_id');
            $table->foreign('crop_id')->references('id')->on('crops');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('crop_varieties');
    }
};
