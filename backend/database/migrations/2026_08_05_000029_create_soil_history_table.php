<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('soil_history', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('field_id');
            $table->unsignedBigInteger('soil_test_id')->nullable();
            $table->date('sampled_on');
            $table->jsonb('parameters_json');
            $table->timestampsTz();
            $table->softDeletesTz();

            $table->index(['field_id', 'sampled_on'], 'idx_soil_history_field_date');
            $table->index('soil_test_id', 'idx_soil_history_soil_test_id');
            $table->foreign('field_id')->references('id')->on('farmer_fields');
            $table->foreign('soil_test_id')->references('id')->on('soil_tests');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('soil_history');
    }
};
