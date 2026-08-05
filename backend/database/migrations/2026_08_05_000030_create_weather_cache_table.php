<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('weather_cache', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('station_id')->nullable();
            $table->string('location_key', 100);
            $table->decimal('temperature_c', 4, 1);
            $table->decimal('feels_like_c', 4, 1)->nullable();
            $table->smallInteger('humidity_pct')->nullable();
            $table->decimal('rainfall_mm', 6, 2)->nullable();
            $table->decimal('wind_speed_kmh', 6, 2)->nullable();
            $table->string('wind_direction', 10)->nullable();
            $table->string('condition', 30);
            $table->smallInteger('uv_index')->nullable();
            $table->smallInteger('air_quality_index')->nullable();
            $table->timestampTz('observed_at');
            $table->timestampsTz();

            $table->unique('location_key', 'uq_weather_cache_location_key');
            $table->index('station_id', 'idx_weather_cache_station_id');
            $table->index('observed_at', 'idx_weather_cache_observed_at');
            $table->foreign('station_id')->references('id')->on('weather_stations');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('weather_cache');
    }
};
