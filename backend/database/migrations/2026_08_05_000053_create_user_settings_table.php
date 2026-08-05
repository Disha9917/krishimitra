<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_settings', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->string('key', 50);
            $table->jsonb('value_json');
            $table->timestampTz('updated_at')->default(DB::raw('now()'));
            $table->timestampTz('created_at')->default(DB::raw('now()'));

            $table->unique(['user_id', 'key'], 'uq_user_settings_user_key');
            $table->foreign('user_id')->references('id')->on('users');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_settings');
    }
};
