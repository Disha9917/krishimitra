<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('feedback', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->string('module', 40)->nullable();
            $table->smallInteger('rating')->nullable();
            $table->text('message')->nullable();
            $table->string('status', 20)->default('new');
            $table->timestampsTz();
            $table->softDeletesTz();

            $table->index('user_id', 'idx_feedback_user_id');
            $table->index('status', 'idx_feedback_status');
            $table->foreign('user_id')->references('id')->on('users');
        });
        DB::statement("ALTER TABLE feedback ADD CONSTRAINT feedback_rating_check CHECK (rating BETWEEN 1 AND 5)");
        DB::statement("ALTER TABLE feedback ADD CONSTRAINT feedback_status_check CHECK (status IN ('new', 'reviewed', 'resolved'))");
    }

    public function down(): void
    {
        Schema::dropIfExists('feedback');
    }
};
