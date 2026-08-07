<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('chat_history', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->uuid('conversation_id');
            $table->string('role', 10);
            $table->text('message');
            $table->jsonb('metadata_json')->nullable();
            $table->timestampTz('created_at')->default(DB::raw('now()'));

            $table->index(['user_id', 'conversation_id'], 'idx_chat_history_user_conversation');
            $table->index('created_at', 'idx_chat_history_created_at');
            $table->foreign('user_id')->references('id')->on('users');
        });
        DB::statement("ALTER TABLE chat_history ADD CONSTRAINT chat_history_role_check CHECK (role IN ('user', 'assistant', 'system'))");
    }

    public function down(): void
    {
        Schema::dropIfExists('chat_history');
    }
};
