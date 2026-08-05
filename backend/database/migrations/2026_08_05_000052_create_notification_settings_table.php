<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('notification_settings', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->boolean('sms_enabled')->default(true);
            $table->boolean('whatsapp_enabled')->default(true);
            $table->boolean('price_threshold_alerts')->default(true);
            $table->boolean('disease_alerts')->default(true);
            $table->boolean('weather_alerts')->default(true);
            $table->decimal('min_price_threshold_inr', 10, 2)->default(2400);
            $table->timestampsTz();
            $table->softDeletesTz();

            $table->unique('user_id', 'uq_notification_settings_user_id');
            $table->foreign('user_id')->references('id')->on('users');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notification_settings');
    }
};
