<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('disease_history', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('detection_id');
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('field_id')->nullable();
            $table->unsignedBigInteger('crop_id')->nullable();
            $table->unsignedBigInteger('disease_id')->nullable();
            $table->boolean('resolved')->nullable();
            $table->text('treatment_applied')->nullable();
            $table->text('outcome_notes')->nullable();
            $table->smallInteger('recurrence_count')->default(0);
            $table->timestampsTz();
            $table->softDeletesTz();

            $table->index('user_id', 'idx_disease_history_user_id');
            $table->index(['field_id', 'disease_id'], 'idx_disease_history_field_disease');
            $table->index('crop_id', 'idx_disease_history_crop_id');
            $table->foreign('detection_id')->references('id')->on('disease_detections');
            $table->foreign('user_id')->references('id')->on('users');
            $table->foreign('field_id')->references('id')->on('farmer_fields');
            $table->foreign('crop_id')->references('id')->on('crops');
            $table->foreign('disease_id')->references('id')->on('diseases');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('disease_history');
    }
};
