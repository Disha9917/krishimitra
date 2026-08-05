<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('villages', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('taluka_id');
            $table->string('code', 50);
            $table->string('name', 150);
            $table->string('pincode', 6)->nullable();
            $table->decimal('lat', 9, 6)->nullable();
            $table->decimal('lng', 9, 6)->nullable();
            $table->timestampsTz();
            $table->softDeletesTz();

            $table->unique('code', 'uq_villages_code');
            $table->index('taluka_id', 'idx_villages_taluka_id');
            $table->index('pincode', 'idx_villages_pincode');
            $table->foreign('taluka_id')->references('id')->on('talukas');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('villages');
    }
};
