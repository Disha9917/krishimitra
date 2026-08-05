<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cold_storages', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->default(DB::raw('gen_random_uuid()'));
            $table->unsignedBigInteger('owner_id')->nullable();
            $table->string('name', 150);
            $table->string('pincode', 6);
            $table->unsignedBigInteger('district_id')->nullable();
            $table->decimal('lat', 9, 6)->nullable();
            $table->decimal('lng', 9, 6)->nullable();
            $table->decimal('capacity_tonnes', 10, 2);
            $table->decimal('occupied_tonnes', 10, 2)->default(0);
            $table->string('temp_range_c', 30)->nullable();
            $table->decimal('rate_per_tonne_month', 10, 2)->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestampsTz();
            $table->softDeletesTz();

            $table->unique('uuid', 'uq_cold_storages_uuid');
            $table->index('pincode', 'idx_cold_storages_pincode');
            $table->index('district_id', 'idx_cold_storages_district_id');
            $table->index('capacity_tonnes', 'idx_cold_storages_capacity');
            $table->foreign('owner_id')->references('id')->on('users');
            $table->foreign('district_id')->references('id')->on('districts');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cold_storages');
    }
};
