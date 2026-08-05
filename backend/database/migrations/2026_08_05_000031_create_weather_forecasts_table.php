<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('weather_forecasts', function (Blueprint $table) {
            $table->id();
            $table->string('location_key', 100);
            $table->unsignedBigInteger('station_id')->nullable();
            $table->date('forecast_date');
            $table->string('day', 12)->nullable();
            $table->decimal('temp_max_c', 4, 1);
            $table->decimal('temp_min_c', 4, 1);
            $table->string('condition', 30);
            $table->smallInteger('rainfall_probability_pct')->nullable();
            $table->smallInteger('humidity_pct')->nullable();
            $table->decimal('wind_speed_kmh', 6, 2)->nullable();
            $table->boolean('irrigation_needed')->default(false);
            $table->string('disease_risk', 10)->default('Low');
            $table->string('provider', 30)->default('openweather');
            $table->timestampsTz();

            $table->unique(['location_key', 'forecast_date'], 'uq_weather_forecasts_location_date');
            $table->index('forecast_date', 'idx_weather_forecasts_date');
            $table->foreign('station_id')->references('id')->on('weather_stations');
        });
        DB::statement("ALTER TABLE weather_forecasts ADD CONSTRAINT weather_forecasts_disease_risk_check CHECK (disease_risk IN ('Low', 'Medium', 'High'))");
    }

    public function down(): void
    {
        Schema::dropIfExists('weather_forecasts');
    }
};
