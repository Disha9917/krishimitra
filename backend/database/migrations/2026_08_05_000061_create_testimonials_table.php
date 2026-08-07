<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('testimonials', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->string('name', 150);
            $table->string('location', 150)->nullable();
            $table->text('text');
            $table->smallInteger('rating')->default(5);
            $table->boolean('is_approved')->default(false);
            $table->smallInteger('display_order')->default(0);
            $table->timestampsTz();
            $table->softDeletesTz();

            $table->index('is_approved', 'idx_testimonials_approved');
            $table->foreign('user_id')->references('id')->on('users');
        });
        DB::statement("ALTER TABLE testimonials ADD CONSTRAINT testimonials_rating_check CHECK (rating BETWEEN 1 AND 5)");
    }

    public function down(): void
    {
        Schema::dropIfExists('testimonials');
    }
};
