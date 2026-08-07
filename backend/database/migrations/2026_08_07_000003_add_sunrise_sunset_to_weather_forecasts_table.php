<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('weather_forecasts', function (Blueprint $table) {
            $table->timestampTz('sunrise_at')->nullable()->after('wind_speed_kmh');
            $table->timestampTz('sunset_at')->nullable()->after('sunrise_at');
        });
    }

    public function down(): void
    {
        Schema::table('weather_forecasts', function (Blueprint $table) {
            $table->dropColumn(['sunrise_at', 'sunset_at']);
        });
    }
};
