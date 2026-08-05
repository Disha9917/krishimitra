<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reports', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->default(DB::raw('gen_random_uuid()'));
            $table->unsignedBigInteger('user_id');
            $table->string('title', 255);
            $table->string('category', 40);
            $table->string('file_format', 10);
            $table->bigInteger('file_size_bytes')->nullable();
            $table->string('file_size_display', 20)->nullable();
            $table->text('summary_text')->nullable();
            $table->string('storage_path', 500);
            $table->string('source_ref', 100)->nullable();
            $table->timestampTz('generated_at')->default(DB::raw('now()'));
            $table->timestampsTz();
            $table->softDeletesTz();

            $table->unique('uuid', 'uq_reports_uuid');
            $table->index(['user_id', 'category'], 'idx_reports_user_category');
            $table->index('generated_at', 'idx_reports_generated_at');
            $table->foreign('user_id')->references('id')->on('users');
        });
        DB::statement("ALTER TABLE reports ADD CONSTRAINT reports_category_check CHECK (category IN ('Advisory', 'Disease Diagnosis', 'Market Intelligence', 'Post-Harvest Analysis'))");
        DB::statement("ALTER TABLE reports ADD CONSTRAINT reports_file_format_check CHECK (file_format IN ('PDF', 'CSV'))");
    }

    public function down(): void
    {
        Schema::dropIfExists('reports');
    }
};
