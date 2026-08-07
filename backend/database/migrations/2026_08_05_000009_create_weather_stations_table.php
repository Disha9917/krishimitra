<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('weather_stations', function (Blueprint $table) {
            $table->id();
            $table->string('code', 50);
            $table->string('name', 150);
            $table->unsignedBigInteger('district_id')->nullable();
            $table->decimal('lat', 9, 6);
            $table->decimal('lng', 9, 6);
            $table->string('provider', 50)->default('openweather');
            $table->timestampsTz();
            $table->softDeletesTz();

            $table->unique('code', 'uq_weather_stations_code');
            $table->index('district_id', 'idx_weather_stations_district_id');
            $table->index(['lat', 'lng'], 'idx_weather_stations_lat_lng');
            $table->foreign('district_id')->references('id')->on('districts');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('weather_stations');
    }
};
