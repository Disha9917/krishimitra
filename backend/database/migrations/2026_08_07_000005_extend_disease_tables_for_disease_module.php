<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('disease_detections', function (Blueprint $table) {
            $table->unsignedBigInteger('field_id')->nullable()->after('user_id');
            $table->text('description')->nullable()->after('scientific_name');
            $table->jsonb('symptoms')->nullable()->after('description');
            $table->string('detection_source', 20)->default('manual')->after('severity');
            $table->string('detection_status', 20)->default('confirmed')->after('detection_source');

            $table->index('field_id', 'idx_disease_detections_field_id');
            $table->index('detection_status', 'idx_disease_detections_status');
            $table->foreign('field_id')->references('id')->on('farmer_fields');
        });

        DB::statement('ALTER TABLE disease_detections DROP CONSTRAINT disease_detections_severity_check');
        DB::statement("ALTER TABLE disease_detections ADD CONSTRAINT disease_detections_severity_check CHECK (severity IN ('low', 'medium', 'high', 'critical'))");
        DB::statement("ALTER TABLE disease_detections ADD CONSTRAINT disease_detections_source_check CHECK (detection_source IN ('manual', 'ai'))");
        DB::statement("ALTER TABLE disease_detections ADD CONSTRAINT disease_detections_status_check CHECK (detection_status IN ('pending', 'confirmed', 'treated', 'dismissed'))");

        DB::statement('ALTER TABLE treatment_recommendations DROP CONSTRAINT treatment_recommendations_severity_check');
        DB::statement("ALTER TABLE treatment_recommendations ADD CONSTRAINT treatment_recommendations_severity_check CHECK (severity IN ('low', 'medium', 'high', 'critical'))");
        DB::statement("ALTER TABLE treatment_recommendations ALTER COLUMN severity SET DEFAULT 'medium'");

        DB::statement('ALTER TABLE diseases DROP CONSTRAINT diseases_severity_default_check');
        DB::statement("ALTER TABLE diseases ADD CONSTRAINT diseases_severity_default_check CHECK (severity_default IN ('low', 'medium', 'high', 'critical'))");
        DB::statement("ALTER TABLE diseases ALTER COLUMN severity_default SET DEFAULT 'medium'");
    }

    public function down(): void
    {
        DB::statement('ALTER TABLE disease_detections DROP CONSTRAINT disease_detections_status_check');
        DB::statement('ALTER TABLE disease_detections DROP CONSTRAINT disease_detections_source_check');
        DB::statement('ALTER TABLE disease_detections DROP CONSTRAINT disease_detections_severity_check');
        DB::statement("ALTER TABLE disease_detections ADD CONSTRAINT disease_detections_severity_check CHECK (severity IN ('Mild', 'Moderate', 'Severe'))");

        DB::statement('ALTER TABLE treatment_recommendations DROP CONSTRAINT treatment_recommendations_severity_check');
        DB::statement("ALTER TABLE treatment_recommendations ADD CONSTRAINT treatment_recommendations_severity_check CHECK (severity IN ('Mild', 'Moderate', 'Severe'))");
        DB::statement("ALTER TABLE treatment_recommendations ALTER COLUMN severity SET DEFAULT 'Moderate'");

        DB::statement('ALTER TABLE diseases DROP CONSTRAINT diseases_severity_default_check');
        DB::statement("ALTER TABLE diseases ADD CONSTRAINT diseases_severity_default_check CHECK (severity_default IN ('Mild', 'Moderate', 'Severe'))");
        DB::statement("ALTER TABLE diseases ALTER COLUMN severity_default SET DEFAULT 'Moderate'");

        Schema::table('disease_detections', function (Blueprint $table) {
            $table->dropForeign(['field_id']);
            $table->dropIndex('idx_disease_detections_field_id');
            $table->dropIndex('idx_disease_detections_status');
            $table->dropColumn(['field_id', 'description', 'symptoms', 'detection_source', 'detection_status']);
        });
    }
};
