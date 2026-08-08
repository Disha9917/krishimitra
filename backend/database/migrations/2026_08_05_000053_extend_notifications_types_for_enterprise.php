<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_type_check");
        DB::statement("ALTER TABLE notifications ADD CONSTRAINT notifications_type_check CHECK (type IN ('PRICE', 'DISEASE', 'WEATHER', 'ADVISORY', 'GOVERNMENT_SCHEME', 'EQUIPMENT_BOOKING', 'COLD_STORAGE_BOOKING', 'TRANSPORT_BOOKING', 'AI_ADVISORY', 'SYSTEM'))");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_type_check");
        DB::statement("ALTER TABLE notifications ADD CONSTRAINT notifications_type_check CHECK (type IN ('PRICE', 'DISEASE', 'WEATHER', 'ADVISORY'))");
    }
};
