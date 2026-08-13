<?php

declare(strict_types=1);

return [

    /*
    |--------------------------------------------------------------------------
    | Unified Dashboard Cache
    |--------------------------------------------------------------------------
    |
    | The unified dashboard aggregates all module dashboards into a single
    | payload. Building it touches every module, so the full summary is
    | cached with the TTL below and invalidated whenever any underlying
    | record changes (see UnifiedDashboardCacheObserver).
    |
    */

    'enabled' => (bool) env('DASHBOARD_CACHE_ENABLED', true),

    'ttl' => (int) env('DASHBOARD_CACHE_TTL', 600),

    'prefix' => 'unified_dashboard:',

    /*
    |--------------------------------------------------------------------------
    | Scheme Eligibility Evaluation Limit
    |--------------------------------------------------------------------------
    |
    | Evaluating eligibility runs several queries per scheme. To keep the
    | dashboard bounded even when many schemes are active, eligibility is only
    | computed for the newest N active schemes. Set to null to evaluate all.
    |
    */

    'scheme_eligibility_limit' => env('DASHBOARD_SCHEME_ELIGIBILITY_LIMIT') !== null
        ? (int) env('DASHBOARD_SCHEME_ELIGIBILITY_LIMIT')
        : null,

    /*
    |--------------------------------------------------------------------------
    | Dashboard Sections
    |--------------------------------------------------------------------------
    |
    | The sections a client may request (or filter by) via the `sections`
    | query parameter on GET /v1/dashboard/unified.
    |
    */

    'sections' => [
        'overview',
        'weather',
        'soil',
        'crop',
        'disease',
        'market',
        'schemes',
        'equipment',
        'coldStorage',
        'transport',
        'notifications',
        'quickActions',
        'statistics',
    ],
];
