<?php

declare(strict_types=1);

return [

    /*
    |--------------------------------------------------------------------------
    | Fuel
    |--------------------------------------------------------------------------
    |
    | Configurable fuel economics used by the transport cost calculator.
    | fuel_rate_per_litre may be overridden per request.
    |
    */

    'fuel_rate_per_litre' => (float) env('TRANSPORT_FUEL_RATE_PER_LITRE', 90.0),

    'fuel_consumption_l_per_km' => (float) env('TRANSPORT_FUEL_CONSUMPTION_L_PER_KM', 0.15),

    /*
    |--------------------------------------------------------------------------
    | Route estimation
    |--------------------------------------------------------------------------
    |
    | Rule-based planning parameters. avg_speed_kmph is used to convert an
    | estimated distance into an estimated duration; road_distance_factor is
    | applied on top of straight-line (haversine) distances to approximate
    | real road distances.
    |
    */

    'avg_speed_kmph' => (float) env('TRANSPORT_AVG_SPEED_KMPH', 40.0),

    'road_distance_factor' => (float) env('TRANSPORT_ROAD_DISTANCE_FACTOR', 1.3),

];
