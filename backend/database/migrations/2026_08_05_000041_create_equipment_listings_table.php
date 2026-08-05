<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('equipment_listings', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->default(DB::raw('gen_random_uuid()'));
            $table->unsignedBigInteger('provider_id');
            $table->string('name', 150);
            $table->string('equipment_type', 30);
            $table->text('description')->nullable();
            $table->decimal('hourly_rate', 10, 2)->nullable();
            $table->decimal('daily_rate', 10, 2)->nullable();
            $table->string('pincode', 6);
            $table->unsignedBigInteger('district_id')->nullable();
            $table->decimal('lat', 9, 6)->nullable();
            $table->decimal('lng', 9, 6)->nullable();
            $table->boolean('is_available')->default(true);
            $table->unsignedBigInteger('image_file_id')->nullable();
            $table->decimal('rating_avg', 3, 2)->nullable();
            $table->timestampsTz();
            $table->softDeletesTz();

            $table->unique('uuid', 'uq_equipment_listings_uuid');
            $table->index(['equipment_type', 'pincode'], 'idx_equipment_listings_type_pincode');
            $table->index('provider_id', 'idx_equipment_listings_provider_id');
            $table->foreign('provider_id')->references('id')->on('users');
            $table->foreign('district_id')->references('id')->on('districts');
            $table->foreign('image_file_id')->references('id')->on('uploaded_files');

        });
        DB::statement('CREATE INDEX idx_equipment_listings_name ON equipment_listings USING gin (name gin_trgm_ops)');
        DB::statement("ALTER TABLE equipment_listings ADD CONSTRAINT equipment_listings_equipment_type_check CHECK (equipment_type IN ('tractor', 'harvester', 'other'))");

    }

    public function down(): void
    {
        DB::statement('DROP INDEX IF EXISTS idx_equipment_listings_name');
        Schema::dropIfExists('equipment_listings');
    }
};
