<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('language_settings', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->string('language', 10)->default('en');
            $table->timestampTz('changed_at')->default(DB::raw('now()'));
            $table->timestampTz('created_at')->default(DB::raw('now()'));

            $table->index('user_id', 'idx_language_settings_user_id');
            $table->index('changed_at', 'idx_language_settings_changed_at');
            $table->foreign('user_id')->references('id')->on('users');
        });
        DB::statement("ALTER TABLE language_settings ADD CONSTRAINT language_settings_language_check CHECK (language IN ('en', 'gu'))");
    }

    public function down(): void
    {
        Schema::dropIfExists('language_settings');
    }
};
