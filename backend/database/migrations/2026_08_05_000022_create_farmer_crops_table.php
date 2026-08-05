<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('farmer_crops', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('crop_id');
            $table->unsignedBigInteger('field_id')->nullable();
            $table->string('season', 30)->nullable();
            $table->date('sowing_date')->nullable();
            $table->date('expected_harvest_date')->nullable();
            $table->boolean('is_current')->default(true);
            $table->timestampsTz();
            $table->softDeletesTz();

            $table->index('user_id', 'idx_farmer_crops_user_id');
            $table->index('crop_id', 'idx_farmer_crops_crop_id');
            $table->index('sowing_date', 'idx_farmer_crops_sowing_date');
            $table->foreign('user_id')->references('id')->on('users');
            $table->foreign('crop_id')->references('id')->on('crops');
            $table->foreign('field_id')->references('id')->on('farmer_fields');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('farmer_crops');
    }
};
