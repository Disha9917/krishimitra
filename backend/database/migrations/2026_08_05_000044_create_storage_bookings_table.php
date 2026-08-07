<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('storage_bookings', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->default(DB::raw('gen_random_uuid()'));
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('cold_storage_id');
            $table->unsignedBigInteger('crop_id')->nullable();
            $table->decimal('quantity_kg', 12, 2);
            $table->date('start_date');
            $table->date('end_date');
            $table->decimal('total_amount', 12, 2)->nullable();
            $table->string('status', 20)->default('pending');
            $table->timestampsTz();
            $table->softDeletesTz();

            $table->unique('uuid', 'uq_storage_bookings_uuid');
            $table->index('user_id', 'idx_storage_bookings_user_id');
            $table->index(['cold_storage_id', 'start_date'], 'idx_storage_bookings_cold_storage_date');
            $table->index('status', 'idx_storage_bookings_status');
            $table->foreign('user_id')->references('id')->on('users');
            $table->foreign('cold_storage_id')->references('id')->on('cold_storages');
            $table->foreign('crop_id')->references('id')->on('crops');
        });
        DB::statement("ALTER TABLE storage_bookings ADD CONSTRAINT storage_bookings_status_check CHECK (status IN ('pending', 'active', 'completed', 'cancelled'))");
    }

    public function down(): void
    {
        Schema::dropIfExists('storage_bookings');
    }
};
