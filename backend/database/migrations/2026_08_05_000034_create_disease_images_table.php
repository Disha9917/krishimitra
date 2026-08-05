<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('disease_images', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('detection_id');
            $table->unsignedBigInteger('file_id');
            $table->boolean('is_primary')->default(true);
            $table->smallInteger('width')->nullable();
            $table->smallInteger('height')->nullable();
            $table->bigInteger('size_bytes');
            $table->timestampTz('created_at')->default(DB::raw('now()'));

            $table->index('detection_id', 'idx_disease_images_detection_id');
            $table->index('file_id', 'idx_disease_images_file_id');
            $table->foreign('detection_id')->references('id')->on('disease_detections')->cascadeOnDelete();
            $table->foreign('file_id')->references('id')->on('uploaded_files');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('disease_images');
    }
};
