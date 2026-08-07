<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CurrentWeatherRequest;
use App\Http\Requests\ForecastWeatherRequest;
use App\Http\Requests\GenerateWeatherAlertsRequest;
use App\Http\Requests\HourlyWeatherRequest;
use App\Http\Requests\RefreshWeatherRequest;
use App\Http\Requests\WeatherAlertsRequest;
use App\Http\Requests\WeatherCoordinatesRequest;
use App\Http\Requests\WeatherDashboardRequest;
use App\Http\Requests\WeatherHistoryRequest;
use App\Http\Resources\CurrentWeatherResource;
use App\Http\Resources\DailyForecastResource;
use App\Http\Resources\HourlyForecastResource;
use App\Http\Resources\HumidityTrendResource;
use App\Http\Resources\RainPredictionResource;
use App\Http\Resources\RefreshWeatherResource;
use App\Http\Resources\SunTimesResource;
use App\Http\Resources\TemperatureTrendResource;
use App\Http\Resources\UvIndexResource;
use App\Http\Resources\WeatherAlertsResource;
use App\Http\Resources\WeatherCacheResource;
use App\Http\Resources\WeatherDashboardResource;
use App\Http\Resources\WeatherHistoryResource;
use App\Http\Resources\WeatherNotificationsResource;
use App\Http\Resources\WeatherSummaryResource;
use App\Http\Resources\WindSummaryResource;
use App\Services\Farmer\FarmerServiceInterface;
use App\Services\Weather\Exceptions\WeatherProviderException;
use App\Services\Weather\WeatherServiceInterface;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WeatherController extends Controller
{
    public function __construct(
        private readonly WeatherServiceInterface $weather,
        private readonly FarmerServiceInterface $farmer,
    ) {}

    public function current(CurrentWeatherRequest $request): JsonResponse
    {
        try {
            return ApiResponse::success(new CurrentWeatherResource(
                $this->weather->currentWeather($this->lat($request), $this->lng($request)),
            ));
        } catch (WeatherProviderException $e) {
            return $this->providerError($e);
        }
    }

    public function forecast(ForecastWeatherRequest $request): JsonResponse
    {
        try {
            return ApiResponse::success(new DailyForecastResource(
                $this->weather->dailyForecast(
                    $this->lat($request),
                    $this->lng($request),
                    $request->validated('days') !== null ? (int) $request->validated('days') : 7,
                ),
            ));
        } catch (WeatherProviderException $e) {
            return $this->providerError($e);
        }
    }

    public function hourly(HourlyWeatherRequest $request): JsonResponse
    {
        try {
            return ApiResponse::success(new HourlyForecastResource(
                $this->weather->hourlyForecast(
                    $this->lat($request),
                    $this->lng($request),
                    $request->validated('hours') !== null ? (int) $request->validated('hours') : 24,
                ),
            ));
        } catch (WeatherProviderException $e) {
            return $this->providerError($e);
        }
    }

    public function history(WeatherHistoryRequest $request): JsonResponse
    {
        try {
            return ApiResponse::success(new WeatherHistoryResource(
                $this->weather->weatherHistory(
                    $this->lat($request),
                    $this->lng($request),
                    $request->validated('days') !== null ? (int) $request->validated('days') : 7,
                ),
            ));
        } catch (WeatherProviderException $e) {
            return $this->providerError($e);
        }
    }

    public function cache(CurrentWeatherRequest $request): JsonResponse
    {
        return ApiResponse::success(new WeatherCacheResource(
            $this->weather->cacheStatus($this->lat($request), $this->lng($request)),
        ));
    }

    public function refresh(RefreshWeatherRequest $request): JsonResponse
    {
        try {
            return ApiResponse::success(new RefreshWeatherResource(
                $this->weather->refreshWeatherCache($this->lat($request), $this->lng($request)),
            ), 'Weather cache refreshed successfully.');
        } catch (WeatherProviderException $e) {
            return $this->providerError($e);
        }
    }

    public function alerts(WeatherAlertsRequest $request): JsonResponse
    {
        $districtId = $this->districtId($request);

        return ApiResponse::success(
            WeatherAlertsResource::collection($this->weather->activeWeatherAlerts($districtId)),
        );
    }

    public function generateAlerts(GenerateWeatherAlertsRequest $request): JsonResponse
    {
        try {
            $created = $this->weather->generateWeatherAlerts(
                (int) $request->validated('districtId'),
                $this->weather->locationKey(
                    $this->lat($request),
                    $this->lng($request),
                ),
                (int) $request->user()->id,
            );

            return ApiResponse::success(['created' => $created], $created > 0
                ? sprintf('%d weather alert(s) generated.', $created)
                : 'No new weather alerts required.');
        } catch (WeatherProviderException $e) {
            return $this->providerError($e);
        }
    }

    public function dashboard(WeatherDashboardRequest $request): JsonResponse
    {
        try {
            return ApiResponse::success(new WeatherDashboardResource(
                $this->weather->farmerWeatherDashboard(
                    (int) $request->user()->id,
                    $this->lat($request),
                    $this->lng($request),
                    $this->districtId($request),
                ),
            ));
        } catch (WeatherProviderException $e) {
            return $this->providerError($e);
        }
    }

    public function rainPrediction(ForecastWeatherRequest $request): JsonResponse
    {
        try {
            return ApiResponse::success(new RainPredictionResource(
                $this->weather->rainPrediction(
                    $this->lat($request),
                    $this->lng($request),
                    $request->validated('days') !== null ? (int) $request->validated('days') : 7,
                ),
            ));
        } catch (WeatherProviderException $e) {
            return $this->providerError($e);
        }
    }

    public function temperatureTrend(ForecastWeatherRequest $request): JsonResponse
    {
        try {
            return ApiResponse::success(new TemperatureTrendResource(
                $this->weather->temperatureTrend(
                    $this->lat($request),
                    $this->lng($request),
                    $request->validated('days') !== null ? (int) $request->validated('days') : 7,
                ),
            ));
        } catch (WeatherProviderException $e) {
            return $this->providerError($e);
        }
    }

    public function humidityTrend(ForecastWeatherRequest $request): JsonResponse
    {
        try {
            return ApiResponse::success(new HumidityTrendResource(
                $this->weather->humidityTrend(
                    $this->lat($request),
                    $this->lng($request),
                    $request->validated('days') !== null ? (int) $request->validated('days') : 7,
                ),
            ));
        } catch (WeatherProviderException $e) {
            return $this->providerError($e);
        }
    }

    public function wind(CurrentWeatherRequest $request): JsonResponse
    {
        try {
            return ApiResponse::success(new WindSummaryResource(
                $this->weather->windSummary($this->lat($request), $this->lng($request)),
            ));
        } catch (WeatherProviderException $e) {
            return $this->providerError($e);
        }
    }

    public function uvIndex(CurrentWeatherRequest $request): JsonResponse
    {
        try {
            return ApiResponse::success(new UvIndexResource(
                $this->weather->uvSummary($this->lat($request), $this->lng($request)),
            ));
        } catch (WeatherProviderException $e) {
            return $this->providerError($e);
        }
    }

    public function sunTimes(CurrentWeatherRequest $request): JsonResponse
    {
        try {
            return ApiResponse::success(new SunTimesResource(
                $this->weather->sunTimes($this->lat($request), $this->lng($request)),
            ));
        } catch (WeatherProviderException $e) {
            return $this->providerError($e);
        }
    }

    public function summary(CurrentWeatherRequest $request): JsonResponse
    {
        try {
            return ApiResponse::success(new WeatherSummaryResource(
                $this->weather->weatherSummary($this->lat($request), $this->lng($request)),
            ));
        } catch (WeatherProviderException $e) {
            return $this->providerError($e);
        }
    }

    public function notifications(Request $request): JsonResponse
    {
        return ApiResponse::success(
            WeatherNotificationsResource::collection($this->weather->listWeatherNotifications((int) $request->user()->id)),
        );
    }

    public function generateNotifications(WeatherAlertsRequest $request): JsonResponse
    {
        $districtId = $this->districtId($request);

        try {
            $result = $this->weather->severeWeatherNotifications((int) $request->user()->id, $districtId);

            return ApiResponse::success([
                'created' => $result['created'],
                'notifications' => WeatherNotificationsResource::collection($result['notifications']),
            ], $result['created'] > 0
                ? sprintf('%d severe weather notification(s) generated.', $result['created'])
                : 'No severe weather notifications to generate.');
        } catch (\DomainException $e) {
            return ApiResponse::error($e->getMessage(), 422, 'domain_error');
        }
    }

    private function lat(WeatherCoordinatesRequest $request): float
    {
        return (float) $request->validated('lat');
    }

    private function lng(WeatherCoordinatesRequest $request): float
    {
        return (float) $request->validated('lng');
    }

    private function districtId(WeatherAlertsRequest|WeatherDashboardRequest $request): ?int
    {
        if ($request->validated('districtId') !== null) {
            return (int) $request->validated('districtId');
        }

        $profile = $this->farmer->getProfile((int) $request->user()->id);

        return $profile?->district_id;
    }

    private function providerError(WeatherProviderException $e): JsonResponse
    {
        return ApiResponse::error(
            'Weather service is temporarily unavailable. '.$e->getMessage(),
            502,
            'provider_unavailable',
        );
    }
}
