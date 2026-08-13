<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('equipment_listings', function (Blueprint $table) {
            $table->string('category', 30)->nullable()->after('equipment_type');
            $table->string('brand', 100)->nullable()->after('category');
            $table->string('model', 100)->nullable()->after('brand');
            $table->decimal('deposit_amount', 10, 2)->nullable()->after('daily_rate');
            $table->unsignedBigInteger('taluka_id')->nullable()->after('district_id');
            $table->unsignedBigInteger('village_id')->nullable()->after('taluka_id');
            $table->jsonb('images_json')->nullable()->after('image_file_id');

            $table->index('category', 'idx_equipment_listings_category');
            $table->index('taluka_id', 'idx_equipment_listings_taluka_id');
            $table->index('village_id', 'idx_equipment_listings_village_id');
            $table->foreign('taluka_id')->references('id')->on('talukas');
            $table->foreign('village_id')->references('id')->on('villages');
        });

        DB::statement('ALTER TABLE equipment_listings DROP CONSTRAINT equipment_listings_equipment_type_check');
        DB::statement("ALTER TABLE equipment_listings ADD CONSTRAINT equipment_listings_equipment_type_check CHECK (equipment_type IN ('tractor', 'harvester', 'tiller', 'planter', 'sprayer', 'pump', 'cultivator', 'trailer', 'generator', 'other'))");
        DB::statement("ALTER TABLE equipment_listings ADD CONSTRAINT equipment_listings_category_check CHECK (category IN ('tillage', 'harvesting', 'irrigation', 'spraying', 'transport', 'power', 'processing', 'other'))");

        Schema::table('rental_bookings', function (Blueprint $table) {
            $table->decimal('deposit_amount', 10, 2)->nullable()->after('total_amount');
            $table->string('payment_status', 20)->default('unpaid')->after('status');
            $table->string('payment_method', 30)->nullable()->after('payment_status');
            $table->string('transaction_reference', 100)->nullable()->after('payment_method');
            $table->text('reason')->nullable()->after('location');
            $table->timestampTz('decided_at')->nullable()->after('cancelled_at');
            $table->timestampTz('completed_at')->nullable()->after('decided_at');

            $table->index('payment_status', 'idx_rental_bookings_payment_status');
        });

        DB::statement('ALTER TABLE rental_bookings DROP CONSTRAINT rental_bookings_status_check');
        DB::statement("ALTER TABLE rental_bookings ADD CONSTRAINT rental_bookings_status_check CHECK (status IN ('pending', 'requested', 'accepted', 'rejected', 'in_progress', 'completed', 'cancelled'))");
        DB::statement("ALTER TABLE rental_bookings ADD CONSTRAINT rental_bookings_payment_status_check CHECK (payment_status IN ('unpaid', 'pending', 'paid', 'failed', 'refunded'))");
    }

    public function down(): void
    {
        DB::statement('ALTER TABLE rental_bookings DROP CONSTRAINT rental_bookings_payment_status_check');
        DB::statement('ALTER TABLE rental_bookings DROP CONSTRAINT rental_bookings_status_check');
        DB::statement("ALTER TABLE rental_bookings ADD CONSTRAINT rental_bookings_status_check CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled'))");

        Schema::table('rental_bookings', function (Blueprint $table) {
            $table->dropIndex('idx_rental_bookings_payment_status');
            $table->dropColumn([
                'deposit_amount',
                'payment_status',
                'payment_method',
                'transaction_reference',
                'reason',
                'decided_at',
                'completed_at',
            ]);
        });

        DB::statement('ALTER TABLE equipment_listings DROP CONSTRAINT equipment_listings_category_check');
        DB::statement('ALTER TABLE equipment_listings DROP CONSTRAINT equipment_listings_equipment_type_check');
        DB::statement("ALTER TABLE equipment_listings ADD CONSTRAINT equipment_listings_equipment_type_check CHECK (equipment_type IN ('tractor', 'harvester', 'other'))");

        Schema::table('equipment_listings', function (Blueprint $table) {
            $table->dropForeign(['taluka_id']);
            $table->dropForeign(['village_id']);
            $table->dropIndex('idx_equipment_listings_category');
            $table->dropIndex('idx_equipment_listings_taluka_id');
            $table->dropIndex('idx_equipment_listings_village_id');
            $table->dropColumn(['category', 'brand', 'model', 'deposit_amount', 'taluka_id', 'village_id', 'images_json']);
        });
    }
};
