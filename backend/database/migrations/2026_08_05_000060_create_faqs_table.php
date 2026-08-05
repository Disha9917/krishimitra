<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('faqs', function (Blueprint $table) {
            $table->id();
            $table->string('category', 50)->nullable();
            $table->string('question', 500);
            $table->text('answer');
            $table->string('question_gujarati', 500)->nullable();
            $table->text('answer_gujarati')->nullable();
            $table->smallInteger('display_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestampsTz();
            $table->softDeletesTz();

            $table->index(['category', 'is_active'], 'idx_faqs_category_active');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('faqs');
    }
};
