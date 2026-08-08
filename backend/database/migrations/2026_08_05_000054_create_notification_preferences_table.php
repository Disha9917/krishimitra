<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('notification_preferences', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->boolean('weather_alerts')->default(true);
            $table->boolean('disease_alerts')->default(true);
            $table->boolean('market_alerts')->default(true);
            $table->boolean('government_scheme_alerts')->default(true);
            $table->boolean('equipment_alerts')->default(true);
            $table->boolean('cold_storage_alerts')->default(true);
            $table->boolean('transport_alerts')->default(true);
            $table->boolean('ai_advisory_alerts')->default(true);
            $table->boolean('system_alerts')->default(true);
            $table->boolean('email_enabled')->default(false);
            $table->timestampsTz();
            $table->softDeletesTz();

            $table->unique('user_id', 'uq_notification_preferences_user_id');
            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notification_preferences');
    }
};
