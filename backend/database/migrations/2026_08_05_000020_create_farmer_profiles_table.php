<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('farmer_profiles', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->decimal('farm_size_acres', 7, 2)->nullable();
            $table->unsignedBigInteger('primary_crop_id')->nullable();
            $table->string('pincode', 6);
            $table->string('state', 50)->nullable();
            $table->unsignedBigInteger('district_id')->nullable();
            $table->unsignedBigInteger('taluka_id')->nullable();
            $table->string('village', 150)->nullable();
            $table->jsonb('alert_preferences')->default('{}');
            $table->timestampsTz();
            $table->softDeletesTz();

            $table->unique('user_id', 'uq_farmer_profiles_user_id');
            $table->index('pincode', 'idx_farmer_profiles_pincode');
            $table->index('district_id', 'idx_farmer_profiles_district_id');
            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();
            $table->foreign('primary_crop_id')->references('id')->on('crops');
            $table->foreign('district_id')->references('id')->on('districts');
            $table->foreign('taluka_id')->references('id')->on('talukas');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('farmer_profiles');
    }
};
