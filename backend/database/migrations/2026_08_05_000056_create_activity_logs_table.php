<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('activity_logs', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->string('activity_type', 40);
            $table->string('title', 255);
            $table->text('description')->nullable();
            $table->string('source_ref', 100)->nullable();
            $table->timestampTz('performed_at')->default(DB::raw('now()'));
            $table->timestampTz('created_at')->default(DB::raw('now()'));

            $table->index(['user_id', 'performed_at'], 'idx_activity_logs_user_performed');
            $table->index('activity_type', 'idx_activity_logs_type');
            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('activity_logs');
    }
};
