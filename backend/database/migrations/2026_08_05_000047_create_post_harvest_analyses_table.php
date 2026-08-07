<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('post_harvest_analyses', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->default(DB::raw('gen_random_uuid()'));
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('crop_id');
            $table->decimal('quantity_kg', 12, 2);
            $table->date('harvest_date');
            $table->string('storage_condition', 40);
            $table->string('location', 255)->nullable();
            $table->decimal('spoilage_risk_pct', 5, 2);
            $table->string('risk_level', 10);
            $table->smallInteger('shelf_life_days');
            $table->smallInteger('days_remaining');
            $table->text('storage_recommendation')->nullable();
            $table->jsonb('decisions_json');
            $table->timestampTz('analyzed_at')->default(DB::raw('now()'));
            $table->string('model_version', 30)->nullable();
            $table->timestampsTz();
            $table->softDeletesTz();

            $table->unique('uuid', 'uq_post_harvest_analyses_uuid');
            $table->index('user_id', 'idx_post_harvest_analyses_user_id');
            $table->index('crop_id', 'idx_post_harvest_analyses_crop_id');
            $table->index('risk_level', 'idx_post_harvest_analyses_risk_level');
            $table->foreign('user_id')->references('id')->on('users');
            $table->foreign('crop_id')->references('id')->on('crops');
        });
        DB::statement("ALTER TABLE post_harvest_analyses ADD CONSTRAINT post_harvest_analyses_risk_level_check CHECK (risk_level IN ('Low', 'Moderate', 'High', 'Critical'))");
    }

    public function down(): void
    {
        Schema::dropIfExists('post_harvest_analyses');
    }
};
