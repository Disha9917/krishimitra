<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('disease_detections', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->default(DB::raw('gen_random_uuid()'));
            $table->unsignedBigInteger('user_id')->nullable();
            $table->unsignedBigInteger('crop_id')->nullable();
            $table->unsignedBigInteger('disease_id')->nullable();
            $table->string('disease_name', 150);
            $table->string('scientific_name', 150)->nullable();
            $table->string('confidence', 10);
            $table->decimal('confidence_score', 5, 2);
            $table->string('severity', 10);
            $table->jsonb('treatment_snapshot')->nullable();
            $table->timestampTz('detected_at')->default(DB::raw('now()'));
            $table->string('model_version', 30)->nullable();
            $table->timestampsTz();
            $table->softDeletesTz();

            $table->unique('uuid', 'uq_disease_detections_uuid');
            $table->index('user_id', 'idx_disease_detections_user_id');
            $table->index('disease_id', 'idx_disease_detections_disease_id');
            $table->index('detected_at', 'idx_disease_detections_detected_at');
            $table->foreign('user_id')->references('id')->on('users');
            $table->foreign('crop_id')->references('id')->on('crops');
            $table->foreign('disease_id')->references('id')->on('diseases');
        });
        DB::statement("ALTER TABLE disease_detections ADD CONSTRAINT disease_detections_confidence_check CHECK (confidence IN ('High', 'Medium', 'Low'))");
        DB::statement("ALTER TABLE disease_detections ADD CONSTRAINT disease_detections_severity_check CHECK (severity IN ('Mild', 'Moderate', 'Severe'))");
    }

    public function down(): void
    {
        Schema::dropIfExists('disease_detections');
    }
};
