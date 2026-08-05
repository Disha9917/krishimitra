<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('dashboard_analytics', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->date('snapshot_date');
            $table->decimal('weather_temp_c', 4, 1)->nullable();
            $table->unsignedBigInteger('current_crop_id')->nullable();
            $table->integer('advisories_count')->default(0);
            $table->string('disease_risk', 10)->nullable();
            $table->decimal('market_price_wheat', 12, 2)->nullable();
            $table->integer('unread_notifications_count')->default(0);
            $table->jsonb('analytics_json')->nullable();
            $table->timestampsTz();

            $table->unique(['user_id', 'snapshot_date'], 'uq_dashboard_analytics_user_date');
            $table->index('snapshot_date', 'idx_dashboard_analytics_date');
            $table->foreign('user_id')->references('id')->on('users');
            $table->foreign('current_crop_id')->references('id')->on('crops');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('dashboard_analytics');
    }
};
