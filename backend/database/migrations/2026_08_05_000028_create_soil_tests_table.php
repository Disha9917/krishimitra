<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('soil_tests', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('field_id')->nullable();
            $table->string('lab_name', 150)->nullable();
            $table->date('report_date')->default(DB::raw('CURRENT_DATE'));
            $table->decimal('ph', 4, 2)->nullable();
            $table->decimal('ec', 6, 3)->nullable();
            $table->decimal('nitrogen_kg_ha', 8, 2)->nullable();
            $table->decimal('phosphorus_kg_ha', 8, 2)->nullable();
            $table->decimal('potassium_kg_ha', 8, 2)->nullable();
            $table->decimal('organic_carbon_pct', 5, 2)->nullable();
            $table->unsignedBigInteger('report_file_id')->nullable();
            $table->timestampsTz();
            $table->softDeletesTz();

            $table->index('user_id', 'idx_soil_tests_user_id');
            $table->index('field_id', 'idx_soil_tests_field_id');
            $table->index('report_date', 'idx_soil_tests_report_date');
            $table->foreign('user_id')->references('id')->on('users');
            $table->foreign('field_id')->references('id')->on('farmer_fields');
            $table->foreign('report_file_id')->references('id')->on('uploaded_files');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('soil_tests');
    }
};
