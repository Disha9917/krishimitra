<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('crop_calendar', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('crop_id');
            $table->string('stage', 50);
            $table->smallInteger('day_start');
            $table->smallInteger('day_end')->nullable();
            $table->string('activity', 255);
            $table->jsonb('fertilizer_json')->nullable();
            $table->jsonb('irrigation_json')->nullable();
            $table->timestampsTz();
            $table->softDeletesTz();

            $table->index(['crop_id', 'stage'], 'idx_crop_calendar_crop_id_stage');
            $table->foreign('crop_id')->references('id')->on('crops');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('crop_calendar');
    }
};
