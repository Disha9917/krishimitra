<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('export_history', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('report_id')->nullable();
            $table->string('export_type', 40);
            $table->string('format', 10);
            $table->integer('row_count')->nullable();
            $table->ipAddress('ip_address')->nullable();
            $table->timestampTz('exported_at')->default(DB::raw('now()'));
            $table->timestampTz('created_at')->default(DB::raw('now()'));

            $table->index('user_id', 'idx_export_history_user_id');
            $table->index('exported_at', 'idx_export_history_exported_at');
            $table->foreign('user_id')->references('id')->on('users');
            $table->foreign('report_id')->references('id')->on('reports');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('export_history');
    }
};
