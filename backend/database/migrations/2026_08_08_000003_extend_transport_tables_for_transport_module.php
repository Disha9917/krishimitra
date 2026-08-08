<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vehicles', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid');
            $table->unsignedBigInteger('owner_id');
            $table->unsignedBigInteger('vehicle_type_id');
            $table->string('name', 150);
            $table->string('vehicle_number', 30)->nullable();
            $table->decimal('capacity_kg', 12, 2);
            $table->decimal('price_per_km', 10, 2);
            $table->decimal('loading_charges', 10, 2)->nullable();
            $table->string('driver_name', 100)->nullable();
            $table->string('driver_phone', 15)->nullable();
            $table->string('contact_phone', 15)->nullable();
            $table->string('pincode', 6)->nullable();
            $table->unsignedBigInteger('district_id')->nullable();
            $table->unsignedBigInteger('taluka_id')->nullable();
            $table->unsignedBigInteger('village_id')->nullable();
            $table->decimal('lat', 10, 6)->nullable();
            $table->decimal('lng', 10, 6)->nullable();
            $table->jsonb('service_areas')->nullable();
            $table->boolean('is_available')->default(true);
            $table->boolean('is_active')->default(true);
            $table->unsignedBigInteger('image_file_id')->nullable();
            $table->jsonb('images_json')->nullable();
            $table->decimal('rating_avg', 3, 2)->default(0);
            $table->timestampsTz();
            $table->softDeletesTz();

            $table->index('owner_id', 'idx_vehicles_owner_id');
            $table->index('vehicle_type_id', 'idx_vehicles_vehicle_type_id');
            $table->index('district_id', 'idx_vehicles_district_id');
            $table->index('is_available', 'idx_vehicles_is_available');
            $table->foreign('owner_id')->references('id')->on('users');
            $table->foreign('vehicle_type_id')->references('id')->on('transport_vehicle_types');
            $table->foreign('district_id')->references('id')->on('districts');
            $table->foreign('taluka_id')->references('id')->on('talukas');
            $table->foreign('village_id')->references('id')->on('villages');
            $table->foreign('image_file_id')->references('id')->on('uploaded_files');
        });

        Schema::create('transport_bookings', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid');
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('vehicle_id');
            $table->unsignedBigInteger('vehicle_type_id')->nullable();
            $table->decimal('quantity_kg', 12, 2);
            $table->decimal('distance_km', 8, 2);
            $table->string('pickup_location', 255)->nullable();
            $table->string('dropoff_location', 255)->nullable();
            $table->timestampTz('pickup_at');
            $table->timestampTz('dropoff_at');
            $table->decimal('base_cost', 12, 2)->default(0);
            $table->decimal('loading_charges', 12, 2)->default(0);
            $table->decimal('toll_charges', 12, 2)->default(0);
            $table->decimal('fuel_charges', 12, 2)->default(0);
            $table->decimal('total_amount', 12, 2);
            $table->string('status', 20)->default('requested');
            $table->string('payment_status', 20)->default('unpaid');
            $table->string('payment_method', 30)->nullable();
            $table->string('transaction_reference', 100)->nullable();
            $table->text('reason')->nullable();
            $table->timestampTz('cancelled_at')->nullable();
            $table->timestampTz('decided_at')->nullable();
            $table->timestampTz('completed_at')->nullable();
            $table->timestampsTz();
            $table->softDeletesTz();

            $table->index('user_id', 'idx_transport_bookings_user_id');
            $table->index('vehicle_id', 'idx_transport_bookings_vehicle_id');
            $table->index('status', 'idx_transport_bookings_status');
            $table->index('pickup_at', 'idx_transport_bookings_pickup_at');
            $table->foreign('user_id')->references('id')->on('users');
            $table->foreign('vehicle_id')->references('id')->on('vehicles');
            $table->foreign('vehicle_type_id')->references('id')->on('transport_vehicle_types');
        });

        DB::statement("ALTER TABLE transport_bookings ADD CONSTRAINT transport_bookings_status_check CHECK (status IN ('requested', 'approved', 'rejected', 'cancelled', 'completed'))");
        DB::statement("ALTER TABLE transport_bookings ADD CONSTRAINT transport_bookings_payment_status_check CHECK (payment_status IN ('unpaid', 'paid', 'failed', 'refunded'))");
    }

    public function down(): void
    {
        DB::statement('ALTER TABLE transport_bookings DROP CONSTRAINT transport_bookings_payment_status_check');
        DB::statement('ALTER TABLE transport_bookings DROP CONSTRAINT transport_bookings_status_check');

        Schema::dropIfExists('transport_bookings');
        Schema::dropIfExists('vehicles');
    }
};
