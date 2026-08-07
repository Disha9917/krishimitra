<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('mandis', function (Blueprint $table) {
            $table->id();
            $table->string('code', 50);
            $table->string('name', 150);
            $table->string('state', 50);
            $table->unsignedBigInteger('district_id')->nullable();
            $table->string('pincode', 6)->nullable();
            $table->decimal('lat', 9, 6)->nullable();
            $table->decimal('lng', 9, 6)->nullable();
            $table->string('apmc_id_external', 50)->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestampsTz();
            $table->softDeletesTz();

            $table->unique('code', 'uq_mandis_code');
            $table->index('state', 'idx_mandis_state');
            $table->index('district_id', 'idx_mandis_district_id');
            $table->index('pincode', 'idx_mandis_pincode');
            $table->foreign('district_id')->references('id')->on('districts')->restrictOnDelete();

        });
        DB::statement('CREATE INDEX idx_mandis_name ON mandis USING gin (name gin_trgm_ops)');
    }

    public function down(): void
    {
        DB::statement('DROP INDEX IF EXISTS idx_mandis_name');
        Schema::dropIfExists('mandis');
    }
};
