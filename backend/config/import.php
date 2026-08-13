<?php

declare(strict_types=1);

use App\Services\Import\Drivers\CropImportDriver;
use App\Services\Import\Drivers\DiseaseImportDriver;
use App\Services\Import\Drivers\DistrictImportDriver;
use App\Services\Import\Drivers\MandiImportDriver;
use App\Services\Import\Drivers\SchemeImportDriver;
use App\Services\Import\Drivers\SoilTypeImportDriver;
use App\Services\Import\Drivers\TalukaImportDriver;
use App\Services\Import\Drivers\VillageImportDriver;

return [

    /*
    |--------------------------------------------------------------------------
    | Storage
    |--------------------------------------------------------------------------
    */

    'disk' => env('IMPORT_DISK', 'local'),
    'path_prefix' => env('IMPORT_PATH_PREFIX', 'imports'),

    /*
    |--------------------------------------------------------------------------
    | Limits
    |--------------------------------------------------------------------------
    */

    'max_file_size_kb' => (int) env('IMPORT_MAX_FILE_SIZE_KB', 4096),
    'max_rows' => (int) env('IMPORT_MAX_ROWS', 20000),
    'preview_sample_size' => 20,
    'error_cap' => 100,
    'batch_size' => 250,
    'sync_threshold' => (int) env('IMPORT_SYNC_THRESHOLD', 500),
    'history_limit' => 50,

    /*
    |--------------------------------------------------------------------------
    | Dataset Drivers
    |--------------------------------------------------------------------------
    |
    | Maps a dataset slug to the import driver responsible for parsing,
    | validating and transforming that dataset. Add new datasets here
    | without touching any controller.
    |
    */

    'datasets' => [
        'districts' => DistrictImportDriver::class,
        'talukas' => TalukaImportDriver::class,
        'villages' => VillageImportDriver::class,
        'crops' => CropImportDriver::class,
        'diseases' => DiseaseImportDriver::class,
        'soil_types' => SoilTypeImportDriver::class,
        'mandis' => MandiImportDriver::class,
        'schemes' => SchemeImportDriver::class,
    ],
];
