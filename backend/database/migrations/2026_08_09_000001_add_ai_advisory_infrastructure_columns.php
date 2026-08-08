<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Infrastructure columns for the provider-driven AI advisory pipeline.
     */
    public function up(): void
    {
        Schema::table('ai_advisories', function (Blueprint $table): void {
            $table->string('advisory_type', 50)->nullable()->after('user_id');
            $table->string('provider', 50)->nullable()->after('model_version');
            $table->text('prompt_text')->nullable()->after('provider');
            $table->text('response_content')->nullable()->after('prompt_text');
            $table->jsonb('usage')->nullable()->after('response_content');
            $table->integer('latency_ms')->nullable()->after('usage');
        });
    }

    public function down(): void
    {
        Schema::table('ai_advisories', function (Blueprint $table): void {
            $table->dropColumn(['advisory_type', 'provider', 'prompt_text', 'response_content', 'usage', 'latency_ms']);
        });
    }
};
