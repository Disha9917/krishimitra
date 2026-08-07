<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('contact_requests', function (Blueprint $table) {
            $table->id();
            $table->string('name', 150);
            $table->string('email', 255);
            $table->string('phone', 10)->nullable();
            $table->string('subject', 255)->nullable();
            $table->text('message');
            $table->string('status', 20)->default('new');
            $table->unsignedBigInteger('assigned_to')->nullable();
            $table->timestampsTz();
            $table->softDeletesTz();

            $table->index('status', 'idx_contact_requests_status');
            $table->index('email', 'idx_contact_requests_email');
            $table->foreign('assigned_to')->references('id')->on('users');
        });
        DB::statement("ALTER TABLE contact_requests ADD CONSTRAINT contact_requests_status_check CHECK (status IN ('new', 'in_progress', 'resolved'))");
    }

    public function down(): void
    {
        Schema::dropIfExists('contact_requests');
    }
};
