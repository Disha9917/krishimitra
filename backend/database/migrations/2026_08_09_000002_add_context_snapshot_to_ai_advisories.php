<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Context snapshot for history: the exact structured context sections
     * (profile, weather, soil, ...) that were fed to the model for each
     * advisory. Stored alongside the prompt and response so history rows
     * remain fully auditable.
     */
    public function up(): void
    {
        Schema::table('ai_advisories', function (Blueprint $table): void {
            $table->jsonb('context_snapshot')->nullable()->after('input_snapshot');
        });
    }

    public function down(): void
    {
        Schema::table('ai_advisories', function (Blueprint $table): void {
            $table->dropColumn('context_snapshot');
        });
    }
};
