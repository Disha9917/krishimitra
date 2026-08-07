<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('scheme_applications', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->default(DB::raw('gen_random_uuid()'));
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('scheme_id');
            $table->string('status', 20)->default('draft');
            $table->timestampTz('submitted_at')->nullable();
            $table->jsonb('documents_json')->nullable();
            $table->text('remarks')->nullable();
            $table->unsignedBigInteger('reviewed_by')->nullable();
            $table->timestampTz('decided_at')->nullable();
            $table->timestampsTz();
            $table->softDeletesTz();

            $table->unique('uuid', 'uq_scheme_applications_uuid');
            $table->index('user_id', 'idx_scheme_applications_user_id');
            $table->index('scheme_id', 'idx_scheme_applications_scheme_id');
            $table->index('status', 'idx_scheme_applications_status');
            $table->foreign('user_id')->references('id')->on('users');
            $table->foreign('scheme_id')->references('id')->on('schemes')->restrictOnDelete();
            $table->foreign('reviewed_by')->references('id')->on('users');
        });
        DB::statement("ALTER TABLE scheme_applications ADD CONSTRAINT scheme_applications_status_check CHECK (status IN ('draft', 'submitted', 'under_review', 'approved', 'rejected'))");
    }

    public function down(): void
    {
        Schema::dropIfExists('scheme_applications');
    }
};
