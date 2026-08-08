<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * History management columns for the AI advisory history & feedback
     * module: queryable topic/risk metadata, favorites and one-feedback-per
     * advisory columns. Soft deletes already exist via softDeletesTz.
     */
    public function up(): void
    {
        Schema::table('ai_advisories', function (Blueprint $table): void {
            $table->string('topic', 500)->nullable()->after('advisory_type');
            $table->string('risk_level', 10)->nullable()->after('provider');
            $table->decimal('confidence', 5, 4)->nullable()->after('risk_level');
            $table->boolean('is_favorite')->default(false)->after('confidence');
            $table->unsignedSmallInteger('rating')->nullable()->after('is_favorite');
            $table->boolean('helpful')->nullable()->after('rating');
            $table->text('feedback_comment')->nullable()->after('helpful');
            $table->timestampTz('feedback_at')->nullable()->after('feedback_comment');

            $table->index('topic', 'idx_ai_advisories_topic');
            $table->index('risk_level', 'idx_ai_advisories_risk_level');
            $table->index('is_favorite', 'idx_ai_advisories_favorite');
            $table->index('rating', 'idx_ai_advisories_rating');
        });
    }

    public function down(): void
    {
        Schema::table('ai_advisories', function (Blueprint $table): void {
            $table->dropIndex(['topic', 'risk_level', 'is_favorite', 'rating']);
            $table->dropColumn(['topic', 'risk_level', 'confidence', 'is_favorite', 'rating', 'helpful', 'feedback_comment', 'feedback_at']);
        });
    }
};
