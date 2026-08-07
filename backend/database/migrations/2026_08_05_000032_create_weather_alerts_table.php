<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('weather_alerts', function (Blueprint $table) {
            $table->id();
            $table->string('alert_type', 30);
            $table->string('severity', 10);
            $table->unsignedBigInteger('district_id')->nullable();
            $table->string('title', 255);
            $table->text('message');
            $table->timestampTz('valid_from');
            $table->timestampTz('valid_until')->nullable();
            $table->unsignedBigInteger('issued_by')->nullable();
            $table->timestampsTz();
            $table->softDeletesTz();

            $table->index(['district_id', 'valid_until'], 'idx_weather_alerts_district_valid');
            $table->index(['alert_type', 'severity'], 'idx_weather_alerts_type_severity');
            $table->foreign('district_id')->references('id')->on('districts');
            $table->foreign('issued_by')->references('id')->on('users');
        });
        DB::statement("ALTER TABLE weather_alerts ADD CONSTRAINT weather_alerts_severity_check CHECK (severity IN ('Low', 'Moderate', 'High', 'Critical'))");
    }

    public function down(): void
    {
        Schema::dropIfExists('weather_alerts');
    }
};
