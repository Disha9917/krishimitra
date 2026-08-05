<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->default(DB::raw('gen_random_uuid()'));
            $table->string('full_name', 150);
            $table->string('phone', 10);
            $table->string('email', 255)->nullable();
            $table->timestampTz('phone_verified_at')->nullable();
            $table->timestampTz('email_verified_at')->nullable();
            $table->string('password_hash', 255)->nullable();
            $table->string('avatar_url', 255)->nullable();
            $table->string('preferred_language', 10)->default('en');
            $table->boolean('is_active')->default(true);
            $table->timestampTz('last_login_at')->nullable();
            $table->timestampsTz();
            $table->softDeletesTz();

            $table->unique('phone', 'uq_users_phone');
            $table->unique('email', 'uq_users_email')->whereNotNull('email');
            $table->unique('uuid', 'uq_users_uuid');
            $table->index('is_active', 'idx_users_is_active');
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};
