<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('permissions', function (Blueprint $table) {
            $table->id();
            $table->string('code', 50);
            $table->string('name', 100);
            $table->string('module', 50)->nullable();
            $table->timestampsTz();
            $table->softDeletesTz();

            $table->unique('code', 'uq_permissions_code');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('permissions');
    }
};
