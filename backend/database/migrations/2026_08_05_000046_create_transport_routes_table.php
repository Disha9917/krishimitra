<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transport_routes', function (Blueprint $table) {
            $table->id();
            $table->string('origin_key', 150);
            $table->string('destination_key', 150);
            $table->decimal('distance_km', 8, 2);
            $table->decimal('duration_hours', 6, 2);
            $table->jsonb('route_geometry')->nullable();
            $table->string('provider', 30)->default('osrm');
            $table->timestampTz('expires_at');
            $table->timestampsTz();

            $table->unique(['origin_key', 'destination_key'], 'uq_transport_routes_origin_destination');
            $table->index('expires_at', 'idx_transport_routes_expires_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transport_routes');
    }
};
