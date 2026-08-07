<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('uploaded_files', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->default(DB::raw('gen_random_uuid()'));
            $table->unsignedBigInteger('user_id');
            $table->string('disk', 30)->default('local');
            $table->string('path', 500);
            $table->string('original_name', 255);
            $table->string('mime_type', 100);
            $table->bigInteger('size_bytes');
            $table->string('sha256_hash', 64)->nullable();
            $table->string('visibility', 20)->default('private');
            $table->timestampsTz();
            $table->softDeletesTz();

            $table->unique('uuid', 'uq_uploaded_files_uuid');
            $table->index('user_id', 'idx_uploaded_files_user_id');
            $table->index('sha256_hash', 'idx_uploaded_files_sha256_hash');
            $table->foreign('user_id')->references('id')->on('users');
        });
        DB::statement("ALTER TABLE uploaded_files ADD CONSTRAINT uploaded_files_disk_check CHECK (disk IN ('local', 's3', 'supabase_storage'))");
        DB::statement("ALTER TABLE uploaded_files ADD CONSTRAINT uploaded_files_visibility_check CHECK (visibility IN ('private', 'public'))");
    }

    public function down(): void
    {
        Schema::dropIfExists('uploaded_files');
    }
};
