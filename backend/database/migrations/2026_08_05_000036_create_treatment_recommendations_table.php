<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('treatment_recommendations', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('disease_id');
            $table->unsignedBigInteger('crop_id')->nullable();
            $table->string('severity', 10)->default('Moderate');
            $table->jsonb('chemical_treatments')->nullable();
            $table->jsonb('organic_treatments')->nullable();
            $table->string('recommended_product', 255)->nullable();
            $table->string('dosage', 255)->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestampsTz();
            $table->softDeletesTz();

            $table->index(['disease_id', 'severity'], 'idx_treatment_recommendations_disease_severity');
            $table->foreign('disease_id')->references('id')->on('diseases');
            $table->foreign('crop_id')->references('id')->on('crops');
        });
        DB::statement("ALTER TABLE treatment_recommendations ADD CONSTRAINT treatment_recommendations_severity_check CHECK (severity IN ('Mild', 'Moderate', 'Severe'))");
    }

    public function down(): void
    {
        Schema::dropIfExists('treatment_recommendations');
    }
};
