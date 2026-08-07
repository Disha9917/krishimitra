<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('schemes', function (Blueprint $table) {
            $table->id();
            $table->string('code', 50);
            $table->string('title', 255);
            $table->string('category', 80);
            $table->text('description')->nullable();
            $table->jsonb('benefits')->nullable();
            $table->jsonb('eligibility_criteria')->nullable();
            $table->jsonb('documents_required')->nullable();
            $table->string('state', 50)->nullable();
            $table->date('deadline')->nullable();
            $table->string('apply_url', 255)->nullable();
            $table->string('official_link', 255)->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestampsTz();
            $table->softDeletesTz();

            $table->unique('code', 'uq_schemes_code');
            $table->index('category', 'idx_schemes_category');
            $table->index('state', 'idx_schemes_state');

        });
        DB::statement('CREATE INDEX idx_schemes_title ON schemes USING gin (title gin_trgm_ops)');
    }

    public function down(): void
    {
        DB::statement('DROP INDEX IF EXISTS idx_schemes_title');
        Schema::dropIfExists('schemes');
    }
};
