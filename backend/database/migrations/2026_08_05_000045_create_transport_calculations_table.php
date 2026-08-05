<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transport_calculations', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->string('origin', 255);
            $table->string('destination', 255);
            $table->decimal('quantity_kg', 12, 2);
            $table->unsignedBigInteger('transport_type_id')->nullable();
            $table->decimal('distance_km', 8, 2);
            $table->decimal('transport_cost', 12, 2);
            $table->decimal('estimated_price_at_destination', 12, 2);
            $table->decimal('gross_revenue', 12, 2);
            $table->decimal('net_profit', 12, 2);
            $table->decimal('profit_margin_pct', 5, 2);
            $table->decimal('transit_hours', 6, 2);
            $table->timestampsTz();
            $table->softDeletesTz();

            $table->index('user_id', 'idx_transport_calculations_user_id');
            $table->index('created_at', 'idx_transport_calculations_created_at');
            $table->foreign('user_id')->references('id')->on('users');
            $table->foreign('transport_type_id')->references('id')->on('transport_vehicle_types');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transport_calculations');
    }
};
