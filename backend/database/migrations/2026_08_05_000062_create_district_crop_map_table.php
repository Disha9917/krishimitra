<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('district_crop_map', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('district_id');
            $table->unsignedBigInteger('crop_id');
            $table->decimal('data_confidence', 5, 2)->nullable();
            $table->timestampsTz();
            $table->softDeletesTz();

            $table->unique(['district_id', 'crop_id'], 'uq_district_crop_map_district_crop');
            $table->index('crop_id', 'idx_district_crop_map_crop_id');
            $table->foreign('district_id')->references('id')->on('districts');
            $table->foreign('crop_id')->references('id')->on('crops');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('district_crop_map');
    }
};
