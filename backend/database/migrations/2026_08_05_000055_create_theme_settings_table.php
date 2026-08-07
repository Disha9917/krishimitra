<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('theme_settings', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->string('theme', 10)->default('light');
            $table->timestampTz('updated_at')->default(DB::raw('now()'));
            $table->timestampTz('created_at')->default(DB::raw('now()'));

            $table->unique('user_id', 'uq_theme_settings_user_id');
            $table->foreign('user_id')->references('id')->on('users');
        });
        DB::statement("ALTER TABLE theme_settings ADD CONSTRAINT theme_settings_theme_check CHECK (theme IN ('light', 'dark', 'system'))");
    }

    public function down(): void
    {
        Schema::dropIfExists('theme_settings');
    }
};
