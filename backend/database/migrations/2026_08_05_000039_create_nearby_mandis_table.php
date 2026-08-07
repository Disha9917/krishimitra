<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('nearby_mandis', function (Blueprint $table) {
            $table->id();
            $table->string('origin_key', 100);
            $table->unsignedBigInteger('mandi_id');
            $table->decimal('distance_km', 8, 2);
            $table->decimal('duration_hours', 6, 2);
            $table->decimal('transport_cost_estimate', 12, 2)->nullable();
            $table->timestampTz('computed_at')->default(DB::raw('now()'));
            $table->timestampsTz();

            $table->unique(['origin_key', 'mandi_id'], 'uq_nearby_mandis_origin_mandi');
            $table->index(['origin_key', 'distance_km'], 'idx_nearby_mandis_origin_distance');
            $table->foreign('mandi_id')->references('id')->on('mandis');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('nearby_mandis');
    }
};
