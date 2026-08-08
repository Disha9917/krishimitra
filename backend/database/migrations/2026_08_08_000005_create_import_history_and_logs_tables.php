<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('import_history', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('dataset_type', 50);
            $table->string('file_name', 255);
            $table->string('file_path', 500);
            $table->unsignedInteger('total_rows')->default(0);
            $table->unsignedInteger('valid_rows')->default(0);
            $table->unsignedInteger('duplicate_rows')->default(0);
            $table->unsignedInteger('existing_rows')->default(0);
            $table->unsignedInteger('error_rows')->default(0);
            $table->unsignedInteger('imported_rows')->default(0);
            $table->unsignedInteger('updated_rows')->default(0);
            $table->unsignedInteger('skipped_rows')->default(0);
            $table->unsignedInteger('failed_rows')->default(0);
            $table->string('status', 20)->default('pending');
            $table->text('error_message')->nullable();
            $table->timestampTz('started_at')->nullable();
            $table->timestampTz('finished_at')->nullable();
            $table->unsignedInteger('duration_ms')->nullable();
            $table->unsignedBigInteger('uploaded_by');
            $table->foreign('uploaded_by')->references('id')->on('users')->restrictOnDelete();
            $table->timestampsTz();
            $table->softDeletesTz();

            $table->index(['dataset_type', 'status'], 'idx_import_history_dataset_status');
            $table->index('uploaded_by', 'idx_import_history_uploaded_by');
        });

        DB::statement("ALTER TABLE import_history ADD CONSTRAINT import_history_dataset_type_check CHECK (dataset_type IN ('districts', 'talukas', 'villages', 'crops', 'diseases', 'soil_types', 'mandis', 'schemes'))");
        DB::statement("ALTER TABLE import_history ADD CONSTRAINT import_history_status_check CHECK (status IN ('pending', 'queued', 'processing', 'imported', 'partial', 'failed', 'rolled_back'))");

        Schema::create('import_logs', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('import_id');
            $table->foreign('import_id')->references('id')->on('import_history')->cascadeOnDelete();
            $table->unsignedInteger('row_number');
            $table->string('action', 20);
            $table->unsignedBigInteger('entity_id')->nullable();
            $table->string('entity_key', 100)->nullable();
            $table->string('message', 500)->nullable();
            $table->jsonb('before_data')->nullable();
            $table->timestampsTz();

            $table->index('import_id', 'idx_import_logs_import_id');
        });

        DB::statement("ALTER TABLE import_logs ADD CONSTRAINT import_logs_action_check CHECK (action IN ('inserted', 'updated', 'skipped', 'failed'))");
    }

    public function down(): void
    {
        Schema::dropIfExists('import_logs');
        Schema::dropIfExists('import_history');
    }
};
