<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('actor_user_id')->nullable();
            $table->string('actor_role_code', 30)->nullable();
            $table->string('action', 50);
            $table->string('entity_type', 60);
            $table->bigInteger('entity_id');
            $table->jsonb('old_values_json')->nullable();
            $table->jsonb('new_values_json')->nullable();
            $table->ipAddress('ip_address')->nullable();
            $table->string('user_agent', 255)->nullable();
            $table->timestampTz('performed_at')->default(DB::raw('now()'));
            $table->timestampTz('created_at')->default(DB::raw('now()'));

            $table->index(['entity_type', 'entity_id'], 'idx_audit_logs_entity');
            $table->index('actor_user_id', 'idx_audit_logs_actor');
            $table->index('performed_at', 'idx_audit_logs_performed_at');
            $table->index('action', 'idx_audit_logs_action');
            $table->foreign('actor_user_id')->references('id')->on('users');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
    }
};
