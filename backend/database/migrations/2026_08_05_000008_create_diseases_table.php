<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('diseases', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('crop_id')->nullable();
            $table->string('code', 50);
            $table->string('name', 150);
            $table->string('scientific_name', 150)->nullable();
            $table->string('severity_default', 10)->default('Moderate');
            $table->jsonb('symptoms')->default('[]');
            $table->jsonb('preventive_measures')->default('[]');
            $table->jsonb('chemical_treatments')->nullable();
            $table->jsonb('organic_treatments')->nullable();
            $table->string('recommended_product', 255)->nullable();
            $table->string('dosage', 255)->nullable();
            $table->string('image_url', 255)->nullable();
            $table->timestampsTz();
            $table->softDeletesTz();

            $table->unique('code', 'uq_diseases_code');
            $table->index('crop_id', 'idx_diseases_crop_id');
            $table->foreign('crop_id')->references('id')->on('crops');

        });
        DB::statement('CREATE INDEX idx_diseases_name ON diseases USING gin (name gin_trgm_ops)');
        DB::statement("ALTER TABLE diseases ADD CONSTRAINT diseases_severity_default_check CHECK (severity_default IN ('Mild', 'Moderate', 'Severe'))");

    }

    public function down(): void
    {
        DB::statement('DROP INDEX IF EXISTS idx_diseases_name');
        Schema::dropIfExists('diseases');
    }
};
