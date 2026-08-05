<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transport_vehicle_types', function (Blueprint $table) {
            $table->id();
            $table->string('code', 50);
            $table->string('name', 80);
            $table->integer('min_capacity_kg');
            $table->integer('max_capacity_kg');
            $table->decimal('rate_per_km_per_qtl', 6, 3);
            $table->smallInteger('avg_speed_kmph')->default(45);
            $table->boolean('is_active')->default(true);
            $table->timestampsTz();
            $table->softDeletesTz();

            $table->unique('code', 'uq_transport_vehicle_types_code');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transport_vehicle_types');
    }
};
