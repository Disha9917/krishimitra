<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rental_bookings', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->default(DB::raw('gen_random_uuid()'));
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('equipment_id');
            $table->timestampTz('start_at');
            $table->timestampTz('end_at');
            $table->decimal('total_amount', 12, 2);
            $table->string('status', 20)->default('pending');
            $table->string('location', 255)->nullable();
            $table->timestampTz('cancelled_at')->nullable();
            $table->timestampsTz();
            $table->softDeletesTz();

            $table->unique('uuid', 'uq_rental_bookings_uuid');
            $table->index('user_id', 'idx_rental_bookings_user_id');
            $table->index(['equipment_id', 'start_at'], 'idx_rental_bookings_equipment_start');
            $table->index('status', 'idx_rental_bookings_status');
            $table->foreign('user_id')->references('id')->on('users');
            $table->foreign('equipment_id')->references('id')->on('equipment_listings');
        });
        DB::statement("ALTER TABLE rental_bookings ADD CONSTRAINT rental_bookings_status_check CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled'))");
    }

    public function down(): void
    {
        Schema::dropIfExists('rental_bookings');
    }
};
