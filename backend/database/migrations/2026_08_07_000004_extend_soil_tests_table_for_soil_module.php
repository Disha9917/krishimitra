<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('soil_tests', function (Blueprint $table) {
            $table->unsignedBigInteger('crop_id')->nullable()->after('field_id');
            $table->decimal('moisture_pct', 5, 2)->nullable()->after('organic_carbon_pct');
            $table->jsonb('micronutrients_json')->nullable()->after('moisture_pct');
            $table->string('soil_texture', 50)->nullable()->after('micronutrients_json');
            $table->unsignedBigInteger('soil_type_id')->nullable()->after('soil_texture');
            $table->decimal('health_score', 5, 2)->nullable()->after('soil_type_id');
            $table->string('soil_status', 20)->nullable()->after('health_score');
            $table->string('fertility_level', 20)->nullable()->after('soil_status');

            $table->index('crop_id', 'idx_soil_tests_crop_id');
            $table->index('soil_type_id', 'idx_soil_tests_soil_type_id');
            $table->foreign('crop_id')->references('id')->on('crops');
            $table->foreign('soil_type_id')->references('id')->on('soil_types');
        });
    }

    public function down(): void
    {
        Schema::table('soil_tests', function (Blueprint $table) {
            $table->dropForeign(['crop_id']);
            $table->dropForeign(['soil_type_id']);
            $table->dropIndex('idx_soil_tests_crop_id');
            $table->dropIndex('idx_soil_tests_soil_type_id');
            $table->dropColumn([
                'crop_id',
                'moisture_pct',
                'micronutrients_json',
                'soil_texture',
                'soil_type_id',
                'health_score',
                'soil_status',
                'fertility_level',
            ]);
        });
    }
};
