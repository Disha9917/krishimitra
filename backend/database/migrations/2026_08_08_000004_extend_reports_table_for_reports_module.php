<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('reports', function (Blueprint $table) {
            $table->string('storage_path', 500)->nullable()->change();
            $table->string('report_type', 40)->nullable()->after('category');
            $table->string('status', 20)->default('ready')->after('report_type');
            $table->jsonb('formats')->default('[]')->after('status');
            $table->jsonb('filters')->default('{}')->after('formats');
            $table->jsonb('data')->nullable()->after('filters');
            $table->jsonb('files')->default('[]')->after('data');
            $table->boolean('is_favorite')->default(false)->after('files');
            $table->text('error_message')->nullable()->after('is_favorite');
            $table->index(['user_id', 'report_type'], 'idx_reports_user_type');
            $table->index(['user_id', 'is_favorite'], 'idx_reports_user_favorite');
        });

        DB::statement('ALTER TABLE reports DROP CONSTRAINT reports_category_check');
        DB::statement("ALTER TABLE reports ADD CONSTRAINT reports_category_check CHECK (category IN ('Farmer Profile', 'Crop', 'Soil Health', 'Weather', 'Disease Detection', 'Market & Mandi', 'Government Scheme', 'Equipment Rental', 'Cold Storage', 'Transport', 'Unified Dashboard', 'Custom', 'Advisory', 'Disease Diagnosis', 'Market Intelligence', 'Post-Harvest Analysis'))");
        DB::statement('ALTER TABLE reports DROP CONSTRAINT reports_file_format_check');
        DB::statement("ALTER TABLE reports ADD CONSTRAINT reports_file_format_check CHECK (file_format IN ('PDF', 'CSV', 'BOTH'))");
    }

    public function down(): void
    {
        DB::statement('ALTER TABLE reports DROP CONSTRAINT reports_file_format_check');
        DB::statement("ALTER TABLE reports ADD CONSTRAINT reports_file_format_check CHECK (file_format IN ('PDF', 'CSV'))");
        DB::statement('ALTER TABLE reports DROP CONSTRAINT reports_category_check');
        DB::statement("ALTER TABLE reports ADD CONSTRAINT reports_category_check CHECK (category IN ('Advisory', 'Disease Diagnosis', 'Market Intelligence', 'Post-Harvest Analysis'))");

        Schema::table('reports', function (Blueprint $table) {
            $table->dropIndex('idx_reports_user_favorite');
            $table->dropIndex('idx_reports_user_type');
            $table->dropColumn([
                'report_type',
                'status',
                'formats',
                'filters',
                'data',
                'files',
                'is_favorite',
                'error_message',
            ]);
            $table->string('storage_path', 500)->change();
        });
    }
};
