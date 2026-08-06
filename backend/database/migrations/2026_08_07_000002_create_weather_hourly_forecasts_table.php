<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('weather_hourly_forecasts', function (Blueprint $table) {
            $table->id();
            $table->string('location_key', 100);
            $table->unsignedBigInteger('station_id')->nullable();
            $table->timestampTz('forecast_time');
            $table->decimal('temperature_c', 4, 1);
            $table->smallInteger('humidity_pct')->nullable();
            $table->smallInteger('precipitation_probability_pct')->nullable();
            $table->decimal('wind_speed_kmh', 6, 2)->nullable();
            $table->smallInteger('uv_index')->nullable();
            $table->string('condition', 30);
            $table->string('provider', 30)->default('open-meteo');
            $table->timestampsTz();

            $table->unique(['location_key', 'forecast_time'], 'uq_weather_hourly_location_time');
            $table->index('forecast_time', 'idx_weather_hourly_forecast_time');
            $table->foreign('station_id')->references('id')->on('weather_stations');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('weather_hourly_forecasts');
    }
};
