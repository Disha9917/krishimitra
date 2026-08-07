<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('farmer_documents', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->string('document_type', 50);
            $table->unsignedBigInteger('file_id');
            $table->string('verification_status', 20)->default('pending');
            $table->unsignedBigInteger('verified_by')->nullable();
            $table->timestampTz('verified_at')->nullable();
            $table->timestampsTz();
            $table->softDeletesTz();

            $table->index('user_id', 'idx_farmer_documents_user_id');
            $table->index('verification_status', 'idx_farmer_documents_status');
            $table->foreign('user_id')->references('id')->on('users');
            $table->foreign('file_id')->references('id')->on('uploaded_files');
            $table->foreign('verified_by')->references('id')->on('users');
        });
        DB::statement("ALTER TABLE farmer_documents ADD CONSTRAINT farmer_documents_document_type_check CHECK (document_type IN ('aadhaar', 'land_record', 'bank_passbook', 'other'))");
        DB::statement("ALTER TABLE farmer_documents ADD CONSTRAINT farmer_documents_verification_status_check CHECK (verification_status IN ('pending', 'verified', 'rejected'))");
    }

    public function down(): void
    {
        Schema::dropIfExists('farmer_documents');
    }
};
