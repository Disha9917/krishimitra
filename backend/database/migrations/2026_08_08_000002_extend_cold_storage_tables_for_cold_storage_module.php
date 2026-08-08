<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('cold_storages', function (Blueprint $table) {
            $table->text('description')->nullable()->after('name');
            $table->string('contact_phone', 15)->nullable()->after('description');
            $table->unsignedBigInteger('taluka_id')->nullable()->after('district_id');
            $table->unsignedBigInteger('village_id')->nullable()->after('taluka_id');
            $table->decimal('min_temp_c', 5, 2)->nullable()->after('temp_range_c');
            $table->decimal('max_temp_c', 5, 2)->nullable()->after('min_temp_c');
            $table->string('humidity_range', 30)->nullable()->after('max_temp_c');
            $table->jsonb('supported_crops')->nullable()->after('humidity_range');
            $table->unsignedBigInteger('image_file_id')->nullable()->after('supported_crops');
            $table->jsonb('images_json')->nullable()->after('image_file_id');

            $table->index('taluka_id', 'idx_cold_storages_taluka_id');
            $table->index('village_id', 'idx_cold_storages_village_id');
            $table->foreign('taluka_id')->references('id')->on('talukas');
            $table->foreign('village_id')->references('id')->on('villages');
            $table->foreign('image_file_id')->references('id')->on('uploaded_files');
        });

        Schema::table('storage_bookings', function (Blueprint $table) {
            $table->string('payment_status', 20)->default('unpaid')->after('status');
            $table->string('payment_method', 30)->nullable()->after('payment_status');
            $table->string('transaction_reference', 100)->nullable()->after('payment_method');
            $table->text('reason')->nullable()->after('total_amount');
            $table->timestampTz('decided_at')->nullable()->after('reason');
            $table->timestampTz('completed_at')->nullable()->after('decided_at');

            $table->index('payment_status', 'idx_storage_bookings_payment_status');
        });

        DB::statement('ALTER TABLE storage_bookings DROP CONSTRAINT storage_bookings_status_check');
        DB::statement("ALTER TABLE storage_bookings ADD CONSTRAINT storage_bookings_status_check CHECK (status IN ('pending', 'requested', 'approved', 'rejected', 'active', 'completed', 'cancelled'))");
        DB::statement("ALTER TABLE storage_bookings ADD CONSTRAINT storage_bookings_payment_status_check CHECK (payment_status IN ('unpaid', 'pending', 'paid', 'failed', 'refunded'))");
    }

    public function down(): void
    {
        DB::statement('ALTER TABLE storage_bookings DROP CONSTRAINT storage_bookings_payment_status_check');
        DB::statement('ALTER TABLE storage_bookings DROP CONSTRAINT storage_bookings_status_check');
        DB::statement("ALTER TABLE storage_bookings ADD CONSTRAINT storage_bookings_status_check CHECK (status IN ('pending', 'active', 'completed', 'cancelled'))");

        Schema::table('storage_bookings', function (Blueprint $table) {
            $table->dropIndex('idx_storage_bookings_payment_status');
            $table->dropColumn([
                'payment_status',
                'payment_method',
                'transaction_reference',
                'reason',
                'decided_at',
                'completed_at',
            ]);
        });

        Schema::table('cold_storages', function (Blueprint $table) {
            $table->dropForeign(['taluka_id']);
            $table->dropForeign(['village_id']);
            $table->dropForeign(['image_file_id']);
            $table->dropIndex('idx_cold_storages_taluka_id');
            $table->dropIndex('idx_cold_storages_village_id');
            $table->dropColumn([
                'description',
                'contact_phone',
                'taluka_id',
                'village_id',
                'min_temp_c',
                'max_temp_c',
                'humidity_range',
                'supported_crops',
                'image_file_id',
                'images_json',
            ]);
        });
    }
};
