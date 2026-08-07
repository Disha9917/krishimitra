<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('talukas', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('district_id');
            $table->string('code', 50);
            $table->string('name', 100);
            $table->string('name_gujarati', 100)->nullable();
            $table->string('default_pincode', 6)->nullable();
            $table->timestampsTz();
            $table->softDeletesTz();

            $table->unique('code', 'uq_talukas_code');
            $table->index('district_id', 'idx_talukas_district_id');
            $table->foreign('district_id')->references('id')->on('districts');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('talukas');
    }
};
