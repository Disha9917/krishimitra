<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('farmer_fields', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->string('name', 100);
            $table->decimal('size_acres', 7, 2);
            $table->unsignedBigInteger('soil_type_id')->nullable();
            $table->unsignedBigInteger('current_crop_id')->nullable();
            $table->decimal('lat', 9, 6)->nullable();
            $table->decimal('lng', 9, 6)->nullable();
            $table->timestampsTz();
            $table->softDeletesTz();

            $table->index('user_id', 'idx_farmer_fields_user_id');
            $table->index('current_crop_id', 'idx_farmer_fields_current_crop_id');
            $table->foreign('user_id')->references('id')->on('users');
            $table->foreign('soil_type_id')->references('id')->on('soil_types');
            $table->foreign('current_crop_id')->references('id')->on('crops');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('farmer_fields');
    }
};
