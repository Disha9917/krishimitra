<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('otps', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->string('channel', 10)->default('sms');
            $table->string('destination', 255);
            $table->string('code_hash', 255);
            $table->string('purpose', 30)->default('login');
            $table->timestampTz('expires_at')->default(DB::raw("now() + interval '10 minutes'"));
            $table->smallInteger('attempts')->default(0);
            $table->timestampTz('consumed_at')->nullable();
            $table->timestampTz('created_at')->default(DB::raw('now()'));

            $table->index(['destination', 'purpose'], 'idx_otps_destination_purpose');
            $table->index('consumed_at', 'idx_otps_consumed_at');
            $table->index('user_id', 'idx_otps_user_id');
            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();
        });
        DB::statement("ALTER TABLE otps ADD CONSTRAINT otps_channel_check CHECK (channel IN ('sms', 'whatsapp', 'email'))");
        DB::statement("ALTER TABLE otps ADD CONSTRAINT otps_purpose_check CHECK (purpose IN ('login', 'register', 'password_reset'))");
    }

    public function down(): void
    {
        Schema::dropIfExists('otps');
    }
};
