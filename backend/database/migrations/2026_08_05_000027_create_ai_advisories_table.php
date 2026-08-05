<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ai_advisories', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->unsignedBigInteger('farmer_crop_id')->nullable();
            $table->unsignedBigInteger('crop_id')->nullable();
            $table->unsignedBigInteger('district_id')->nullable();
            $table->string('pincode', 6)->nullable();
            $table->jsonb('input_snapshot');
            $table->jsonb('top3_advisories');
            $table->jsonb('irrigation_plan')->nullable();
            $table->jsonb('fertilizer_plan')->nullable();
            $table->jsonb('pest_alert')->nullable();
            $table->jsonb('timeline_7_days')->nullable();
            $table->timestampTz('generated_at')->default(DB::raw('now()'));
            $table->string('model_version', 30)->nullable();
            $table->timestampsTz();
            $table->softDeletesTz();

            $table->index('user_id', 'idx_ai_advisories_user_id');
            $table->index('crop_id', 'idx_ai_advisories_crop_id');
            $table->foreign('user_id')->references('id')->on('users');
            $table->foreign('farmer_crop_id')->references('id')->on('farmer_crops');
            $table->foreign('crop_id')->references('id')->on('crops');
            $table->foreign('district_id')->references('id')->on('districts');

        });
        DB::statement('CREATE INDEX idx_ai_advisories_generated_at ON ai_advisories USING brin (generated_at)');
        DB::statement('CREATE INDEX idx_ai_advisories_input ON ai_advisories USING gin (input_snapshot)');
    }

    public function down(): void
    {
        DB::statement('DROP INDEX IF EXISTS idx_ai_advisories_generated_at');
        DB::statement('DROP INDEX IF EXISTS idx_ai_advisories_input');
        Schema::dropIfExists('ai_advisories');
    }
};
