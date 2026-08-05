<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('soil_types', function (Blueprint $table) {
            $table->id();
            $table->string('code', 50);
            $table->string('name', 100);
            $table->text('water_retention_desc')->nullable();
            $table->timestampsTz();
            $table->softDeletesTz();

            $table->unique('code', 'uq_soil_types_code');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('soil_types');
    }
};
