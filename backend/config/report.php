<?php

declare(strict_types=1);

return [

    /*
    |--------------------------------------------------------------------------
    | Report Storage
    |--------------------------------------------------------------------------
    | Generated files live on a Laravel Storage disk so the driver can be
    | swapped for S3/Supabase Storage later without touching the module.
    |
    */

    'disk' => env('REPORT_DISK', 'local'),

    'path_prefix' => 'reports',

    /*
    |--------------------------------------------------------------------------
    | Report Types
    |--------------------------------------------------------------------------
    | Machine keys map to display labels (also used as the reports.category
    | value so legacy indexes keep working).
    |
    */

    'types' => [
        'farmer_profile' => 'Farmer Profile',
        'crop' => 'Crop',
        'soil_health' => 'Soil Health',
        'weather' => 'Weather',
        'disease_detection' => 'Disease Detection',
        'market_mandi' => 'Market & Mandi',
        'government_scheme' => 'Government Scheme',
        'equipment_rental' => 'Equipment Rental',
        'cold_storage' => 'Cold Storage',
        'transport' => 'Transport',
        'unified_dashboard' => 'Unified Dashboard',
        'custom' => 'Custom',
    ],

    /*
    |--------------------------------------------------------------------------
    | Formats
    |--------------------------------------------------------------------------
    | JSON responses are always available; files are generated for the
    | requested formats ('csv', 'pdf' or 'both').
    |
    */

    'formats' => ['csv', 'pdf'],

    'default_limit' => 50,

    'recent_limit' => 10,

    'csv' => [
        'max_rows' => (int) env('REPORT_CSV_MAX_ROWS', 3000),
    ],

    'pdf' => [
        'font_size' => 9,
        'line_height' => 12,
        'max_lines' => (int) env('REPORT_PDF_MAX_LINES', 5000),
    ],
];
