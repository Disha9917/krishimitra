<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('market_prices', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('mandi_id');
            $table->unsignedBigInteger('crop_id');
            $table->date('price_date');
            $table->decimal('min_price', 12, 2);
            $table->decimal('max_price', 12, 2);
            $table->decimal('todays_price', 12, 2);
            $table->decimal('change_pct', 5, 2)->default(0);
            $table->string('trend', 10)->default('STABLE');
            $table->string('unit', 20)->default('INR/Quintal');
            $table->string('source', 30)->default('agmarknet');
            $table->timestampTz('ingested_at')->default(DB::raw('now()'));
            $table->timestampsTz();
            $table->softDeletesTz();

            $table->unique(['mandi_id', 'crop_id', 'price_date'], 'uq_market_prices_mandi_crop_date');
            $table->index(['crop_id', 'price_date'], 'idx_market_prices_crop_price_date');
            $table->index(['mandi_id', 'price_date'], 'idx_market_prices_mandi_price_date');
            $table->foreign('mandi_id')->references('id')->on('mandis')->restrictOnDelete();
            $table->foreign('crop_id')->references('id')->on('crops')->restrictOnDelete();
        });
        DB::statement("ALTER TABLE market_prices ADD CONSTRAINT market_prices_trend_check CHECK (trend IN ('UP', 'DOWN', 'STABLE'))");
    }

    public function down(): void
    {
        Schema::dropIfExists('market_prices');
    }
};
