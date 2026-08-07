<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->default(DB::raw('gen_random_uuid()'));
            $table->unsignedBigInteger('user_id');
            $table->string('type', 20);
            $table->string('title', 255);
            $table->text('message');
            $table->string('action_url', 255)->nullable();
            $table->string('source_ref', 100)->nullable();
            $table->boolean('is_read')->default(false);
            $table->timestampTz('read_at')->nullable();
            $table->timestampsTz();
            $table->softDeletesTz();

            $table->unique('uuid', 'uq_notifications_uuid');
            $table->index(['user_id', 'is_read', 'created_at'], 'idx_notifications_user_read');
            $table->index(['user_id', 'type'], 'idx_notifications_user_type');
            $table->index('created_at', 'idx_notifications_created_at');
            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();
        });
        DB::statement("ALTER TABLE notifications ADD CONSTRAINT notifications_type_check CHECK (type IN ('PRICE', 'DISEASE', 'WEATHER', 'ADVISORY'))");
    }

    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
