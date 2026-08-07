<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('price_predictions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('mandi_id');
            $table->unsignedBigInteger('crop_id');
            $table->smallInteger('period')->default(7);
            $table->jsonb('predicted_prices');
            $table->string('model_version', 30)->nullable();
            $table->timestampTz('generated_at')->default(DB::raw('now()'));
            $table->timestampTz('valid_until');
            $table->timestampsTz();
            $table->softDeletesTz();

            $table->index(['mandi_id', 'crop_id'], 'idx_price_predictions_mandi_crop');
            $table->index('valid_until', 'idx_price_predictions_valid_until');
            $table->foreign('mandi_id')->references('id')->on('mandis');
            $table->foreign('crop_id')->references('id')->on('crops');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('price_predictions');
    }
};
