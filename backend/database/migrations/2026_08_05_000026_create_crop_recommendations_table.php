<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('crop_recommendations', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->jsonb('input_snapshot');
            $table->jsonb('recommendations');
            $table->unsignedBigInteger('selected_crop_id')->nullable();
            $table->timestampTz('generated_at')->default(DB::raw('now()'));
            $table->string('model_version', 30)->nullable();
            $table->timestampsTz();
            $table->softDeletesTz();

            $table->index('user_id', 'idx_crop_recommendations_user_id');
            $table->index('generated_at', 'idx_crop_recommendations_generated_at');
            $table->foreign('user_id')->references('id')->on('users');
            $table->foreign('selected_crop_id')->references('id')->on('crops');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('crop_recommendations');
    }
};
