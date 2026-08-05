<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('prediction_history', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->string('prediction_type', 30);
            $table->string('source_table', 50);
            $table->bigInteger('source_id');
            $table->unsignedBigInteger('crop_id')->nullable();
            $table->string('prediction', 255);
            $table->unsignedBigInteger('disease_id')->nullable();
            $table->text('recommendation')->nullable();
            $table->string('confidence', 10);
            $table->string('location', 255)->nullable();
            $table->string('status', 20)->default('Active');
            $table->unsignedBigInteger('report_id')->nullable();
            $table->timestampTz('occurred_at')->default(DB::raw('now()'));
            $table->timestampsTz();
            $table->softDeletesTz();

            $table->index(['user_id', 'status'], 'idx_prediction_history_user_status');
            $table->index('prediction_type', 'idx_prediction_history_type');
            $table->index('occurred_at', 'idx_prediction_history_occurred_at');
            $table->foreign('user_id')->references('id')->on('users');
            $table->foreign('crop_id')->references('id')->on('crops');
            $table->foreign('disease_id')->references('id')->on('diseases');
            $table->foreign('report_id')->references('id')->on('reports');

        });
        DB::statement('CREATE INDEX idx_prediction_history_prediction ON prediction_history USING gin (prediction gin_trgm_ops)');
        DB::statement("ALTER TABLE prediction_history ADD CONSTRAINT prediction_history_confidence_check CHECK (confidence IN ('High', 'Medium', 'Low'))");
        DB::statement("ALTER TABLE prediction_history ADD CONSTRAINT prediction_history_status_check CHECK (status IN ('Active', 'Archived'))");

    }

    public function down(): void
    {
        DB::statement('DROP INDEX IF EXISTS idx_prediction_history_prediction');
        Schema::dropIfExists('prediction_history');
    }
};
