<?php

declare(strict_types=1);

namespace App\Services\Market;

use App\Models\Mandi;
use App\Models\MarketPrice;
use App\Repositories\Contracts\FarmerFieldRepositoryInterface;
use App\Repositories\Contracts\MandiRepositoryInterface;
use App\Repositories\Contracts\MarketPriceRepositoryInterface;
use App\Repositories\Contracts\PredictionHistoryRepositoryInterface;
use App\Repositories\Contracts\PricePredictionRepositoryInterface;
use App\Services\Market\Providers\PriceDataProviderInterface;
use Carbon\Carbon;
use DomainException;
use Illuminate\Database\Eloquent\Collection;

class MarketService implements MarketServiceInterface
{
    private const TREND_UP = 'UP';

    private const TREND_DOWN = 'DOWN';

    private const TREND_STABLE = 'STABLE';

    /**
     * Transport cost proxy (₹ per km) used to weigh distance against price
     * when recommending the best selling market.
     */
    private const TRANSPORT_COST_PER_KM = 10.0;

    /**
     * Default history windows per aggregation period.
     *
     * @var array<string, int>
     */
    private const PERIOD_WINDOW_DAYS = [
        'daily' => 30,
        'weekly' => 90,
        'monthly' => 365,
        'yearly' => 1095,
    ];

    public function __construct(
        private readonly MarketPriceRepositoryInterface $prices,
        private readonly MandiRepositoryInterface $mandis,
        private readonly PricePredictionRepositoryInterface $predictions,
        private readonly PredictionHistoryRepositoryInterface $predictionHistory,
        private readonly FarmerFieldRepositoryInterface $fields,
    ) {}

    public function listPrices(array $filters = [], int $limit = 20): Collection
    {
        return $this->prices->listPrices($filters, $limit);
    }

    public function todayPrices(array $filters = [], int $limit = 50): Collection
    {
        return $this->prices->listPrices([
            ...$filters,
            'date' => today()->toDateString(),
        ], $limit);
    }

    public function getPrice(int $priceId): ?MarketPrice
    {
        return $this->prices->findById($priceId);
    }

    public function ingestPrice(array $data): MarketPrice
    {
        $mandiId = (int) $data['mandi_id'];
        $cropId = (int) $data['crop_id'];
        $date = (string) $data['price_date'];

        if ($this->prices->priceForDate($mandiId, $cropId, $date) !== null) {
            throw new DomainException('A price record already exists for this mandi, crop and date. Price history is immutable.');
        }

        $todayPrice = (float) $data['todays_price'];
        $previous = $this->prices->priceForDate(
            $mandiId,
            $cropId,
            Carbon::parse($date)->subDay()->toDateString(),
        );

        [$changePct, $trend] = $this->deriveChange($todayPrice, $previous);

        return $this->prices->create([
            'mandi_id' => $mandiId,
            'crop_id' => $cropId,
            'price_date' => $date,
            'min_price' => (float) $data['min_price'],
            'max_price' => (float) $data['max_price'],
            'todays_price' => $todayPrice,
            'change_pct' => $changePct,
            'trend' => $trend,
            'unit' => $data['unit'] ?? 'INR/Quintal',
            'source' => $data['source'] ?? 'manual',
            'ingested_at' => now(),
        ]);
    }

    public function listMandis(array $filters = [], int $limit = 50): Collection
    {
        return $this->mandis->listMandis($filters, $limit);
    }

    public function getMandi(int $mandiId): ?Mandi
    {
        return $this->mandis->findById($mandiId);
    }

    public function nearbyMandis(float $lat, float $lng, float $radiusKm = 50.0, int $limit = 10): array
    {
        return [
            'origin' => ['type' => 'coordinates', 'lat' => $lat, 'lng' => $lng],
            'mandis' => $this->mandis->nearbyMandis($lat, $lng, $radiusKm, $limit),
        ];
    }

    public function mandisNearField(int $userId, int $fieldId, float $radiusKm = 50.0, int $limit = 10): array
    {
        $field = $this->fields->findById($fieldId);

        if ($field === null) {
            throw new DomainException(sprintf('Field [%d] does not exist.', $fieldId));
        }

        if ((int) $field->user_id !== $userId) {
            throw new DomainException('You do not own this field.');
        }

        if ($field->lat === null || $field->lng === null) {
            throw new DomainException('This field has no stored coordinates. Update the field with latitude and longitude first.');
        }

        return [
            'origin' => ['type' => 'field', 'lat' => (float) $field->lat, 'lng' => (float) $field->lng],
            'mandis' => $this->mandis->nearbyMandis((float) $field->lat, (float) $field->lng, $radiusKm, $limit),
        ];
    }

    public function priceHistory(int $cropId, int $mandiId, string $period = 'daily', ?string $from = null, ?string $to = null): array
    {
        [$from, $to] = $this->historyWindow($period, $from, $to);

        $rows = $this->prices->priceHistory($cropId, $mandiId, $from, $to);

        $daily = $rows->map(fn (MarketPrice $row): array => [
            'date' => $row->price_date->toDateString(),
            'price' => (float) $row->todays_price,
            'min_price' => (float) $row->min_price,
            'max_price' => (float) $row->max_price,
            'change_pct' => (float) $row->change_pct,
            'trend' => $row->trend,
        ]);

        $points = match ($period) {
            'weekly' => $this->aggregatePeriod($daily, 'week'),
            'monthly' => $this->aggregatePeriod($daily, 'month'),
            'yearly' => $this->aggregatePeriod($daily, 'year'),
            default => $daily->values(),
        };

        return [
            'crop_id' => $cropId,
            'mandi_id' => $mandiId,
            'period' => $period,
            'from' => $from,
            'to' => $to,
            'points' => $points,
            'points_count' => count($points),
        ];
    }

    public function pricePrediction(int $userId, int $cropId, ?int $mandiId = null, int $periodDays = 7): array
    {
        $from = today()->subDays(60)->toDateString();
        $to = today()->toDateString();

        $rows = $mandiId !== null
            ? $this->prices->priceHistory($cropId, $mandiId, $from, $to)
            : $this->prices->pricesBetween($from, $to, ['crop_id' => $cropId], 1000);

        $series = $this->dailySeries($rows);

        if (count($series) < 5) {
            return [
                'has_prediction' => false,
                'reason' => 'insufficient_data',
                'crop_id' => $cropId,
                'mandi_id' => $mandiId,
                'message' => 'At least 5 days of price history are required to generate a prediction.',
            ];
        }

        $recent = array_slice($series, -7);
        $previous = array_slice($series, -14, 7);

        $recentAvg = $this->averagePrices($recent);
        $previousAvg = $this->averagePrices($previous);
        $changePct = $previousAvg > 0 ? (($recentAvg - $previousAvg) / $previousAvg) * 100 : 0.0;
        $trend = $this->trendForChange($changePct);
        $slopePerDay = ($recentAvg - $previousAvg) / 7;

        $lastPrice = (float) end($series)['price'];
        $points = [];

        for ($i = 1; $i <= $periodDays; $i++) {
            $points[] = [
                'date' => today()->addDays($i)->toDateString(),
                'price' => round(max(0.0, $lastPrice + ($slopePerDay * $i)), 2),
            ];
        }

        $resolutionMandiId = $mandiId ?? $this->representativeMandiId($rows);

        $prediction = $this->predictions->create([
            'mandi_id' => $resolutionMandiId,
            'crop_id' => $cropId,
            'period' => $periodDays,
            'predicted_prices' => $points,
            'model_version' => 'rule-based-v1',
            'generated_at' => now(),
            'valid_until' => now()->addDays($periodDays),
        ]);

        $predictedPrice = (float) end($points)['price'];
        $predictionText = sprintf(
            'Expected price for %s at %s within %d days: ₹%s (%s %s%%).',
            $prediction->crop?->name ?? "crop #{$cropId}",
            $prediction->mandi?->name ?? "mandi #{$resolutionMandiId}",
            $periodDays,
            number_format($predictedPrice, 2),
            $trend === self::TREND_UP ? 'rising' : ($trend === self::TREND_DOWN ? 'falling' : 'stable'),
            number_format(abs($changePct), 1),
        );

        $this->predictionHistory->create([
            'user_id' => $userId,
            'prediction_type' => 'market_price',
            'source_table' => 'price_predictions',
            'source_id' => (int) $prediction->id,
            'crop_id' => $cropId,
            'prediction' => $predictionText,
            'confidence' => $this->confidenceForChange(abs($changePct)),
            'status' => 'Active',
            'occurred_at' => now(),
        ]);

        return [
            'has_prediction' => true,
            'crop_id' => $cropId,
            'mandi_id' => $resolutionMandiId,
            'period_days' => $periodDays,
            'trend' => $trend,
            'change_pct' => round($changePct, 2),
            'indicator' => match ($trend) {
                self::TREND_UP => 'rising',
                self::TREND_DOWN => 'falling',
                default => 'stable',
            },
            'current_price' => $lastPrice,
            'average_price' => round($recentAvg, 2),
            'predicted_prices' => $points,
            'confidence' => $this->confidenceForChange(abs($changePct)),
            'generated_at' => now()->toIso8601String(),
            'valid_until' => now()->addDays($periodDays)->toIso8601String(),
            'model_version' => 'rule-based-v1',
        ];
    }

    public function bestSellingMarket(int $cropId, ?int $userId = null, ?int $fieldId = null, ?float $lat = null, ?float $lng = null): ?array
    {
        $latestDate = $this->prices->latestPriceDate(['crop_id' => $cropId]);

        if ($latestDate === null) {
            return null;
        }

        $rows = $this->prices->pricesBetween($latestDate, $latestDate, ['crop_id' => $cropId], 500);

        if ($rows->isEmpty()) {
            return null;
        }

        $origin = $this->resolveOrigin($userId, $fieldId, $lat, $lng);

        /** @var MarketPrice|null $best */
        $best = null;
        $bestDistance = null;
        $bestScore = PHP_FLOAT_MIN;

        foreach ($rows as $row) {
            $distance = null;

            if ($origin !== null && $row->mandi?->lat !== null && $row->mandi?->lng !== null) {
                $distance = $this->haversineKm(
                    (float) $row->mandi->lat,
                    (float) $row->mandi->lng,
                    $origin['lat'],
                    $origin['lng'],
                );
            }

            $score = (float) $row->todays_price - ($distance !== null ? $distance * self::TRANSPORT_COST_PER_KM : 0.0);

            if ($score > $bestScore) {
                $bestScore = $score;
                $best = $row;
                $bestDistance = $distance;
            }
        }

        if ($best === null) {
            return null;
        }

        return [
            'crop' => $best->crop !== null ? [
                'id' => (int) $best->crop->id,
                'name' => $best->crop->name,
            ] : null,
            'mandi' => $best->mandi !== null ? [
                'id' => (int) $best->mandi->id,
                'name' => $best->mandi->name,
                'district' => $best->mandi->district?->name,
            ] : null,
            'expected_price' => (float) $best->todays_price,
            'unit' => $best->unit,
            'estimated_distance_km' => $bestDistance !== null ? round($bestDistance, 2) : null,
            'suggested_selling_time' => $this->suggestSellingTime($best->trend, (float) $best->change_pct),
            'basis' => [
                'price_date' => $best->price_date->toDateString(),
                'trend' => $best->trend,
                'change_pct' => (float) $best->change_pct,
            ],
        ];
    }

    public function marketDashboard(array $filters = []): array
    {
        $latestDate = $this->prices->latestPriceDate($filters);

        if ($latestDate === null) {
            return [
                'has_data' => false,
                'latest_date' => null,
                'highest_price' => null,
                'lowest_price' => null,
                'average_price' => null,
                'trend_distribution' => [self::TREND_UP => 0, self::TREND_DOWN => 0, self::TREND_STABLE => 0],
                'top_gainers' => [],
                'top_losers' => [],
                'daily_average_trend' => [],
            ];
        }

        $rows = $this->prices->pricesBetween($latestDate, $latestDate, $filters, 1000);
        $values = $rows->map(fn (MarketPrice $row): float => (float) $row->todays_price);

        $distribution = [
            self::TREND_UP => 0,
            self::TREND_DOWN => 0,
            self::TREND_STABLE => 0,
        ];

        foreach ($rows as $row) {
            if (is_string($row->trend) && array_key_exists($row->trend, $distribution)) {
                $distribution[$row->trend]++;
            }
        }

        $trends = $rows
            ->sortByDesc(fn (MarketPrice $row): float => (float) $row->change_pct)
            ->values();

        $trendPoints = $this->prices->pricesBetween(
            today()->subDays(6)->toDateString(),
            $latestDate,
            $filters,
            1000,
        )->groupBy(fn (MarketPrice $row): string => $row->price_date->toDateString());

        $dailyAverage = $trendPoints->map(fn (\Illuminate\Support\Collection $day): float => round(
            $day->map(fn (MarketPrice $row): float => (float) $row->todays_price)->avg() ?? 0.0,
            2,
        ))->sortKeys();

        return [
            'has_data' => true,
            'latest_date' => $latestDate,
            'highest_price' => $values->isNotEmpty() ? $values->max() : null,
            'lowest_price' => $values->isNotEmpty() ? $values->min() : null,
            'average_price' => $values->isNotEmpty() ? round($values->avg(), 2) : null,
            'trend_distribution' => $distribution,
            'top_gainers' => $this->marketMovers($trends->take(5)),
            'top_losers' => $this->marketMovers($trends->reverse()->take(5)),
            'daily_average_trend' => $dailyAverage->map(fn (float $avg, string $date): array => [
                'date' => $date,
                'average_price' => $avg,
            ])->values(),
        ];
    }

    public function syncFromProvider(PriceDataProviderInterface $provider, array $filters = []): array
    {
        $records = $provider->fetch($filters);
        $ingested = 0;
        $skipped = 0;

        foreach ($records as $record) {
            try {
                $this->ingestPrice($record);
                $ingested++;
            } catch (DomainException) {
                $skipped++;
            }
        }

        return [
            'fetched' => count($records),
            'ingested' => $ingested,
            'skipped' => $skipped,
        ];
    }

    public function activeMandis(): Collection
    {
        return $this->mandis->activeMandis();
    }

    public function findMandi(int $mandiId): ?Mandi
    {
        return $this->mandis->findById($mandiId);
    }

    /**
     * @return array{float, string} [change_pct, trend]
     */
    private function deriveChange(float $todayPrice, ?MarketPrice $previous): array
    {
        if ($previous === null || (float) $previous->todays_price <= 0) {
            return [0.0, self::TREND_STABLE];
        }

        $changePct = round((($todayPrice - (float) $previous->todays_price) / (float) $previous->todays_price) * 100, 2);

        return [$changePct, $this->trendForChange($changePct)];
    }

    private function trendForChange(float $changePct): string
    {
        if ($changePct > 1.0) {
            return self::TREND_UP;
        }

        if ($changePct < -1.0) {
            return self::TREND_DOWN;
        }

        return self::TREND_STABLE;
    }

    /**
     * @return array{string, string}
     */
    private function historyWindow(string $period, ?string $from, ?string $to): array
    {
        $days = self::PERIOD_WINDOW_DAYS[$period] ?? self::PERIOD_WINDOW_DAYS['daily'];

        return [
            $from ?? today()->subDays($days)->toDateString(),
            $to ?? today()->toDateString(),
        ];
    }

    /**
     * @param  Collection<int, MarketPrice>  $rows
     * @return list<array<string, mixed>>
     */
    private function dailySeries(Collection $rows): array
    {
        return $rows
            ->groupBy(fn (MarketPrice $row): string => $row->price_date->toDateString())
            ->map(fn (Collection $day): array => [
                'date' => $day->first()->price_date->toDateString(),
                'price' => round($day->map(fn (MarketPrice $row): float => (float) $row->todays_price)->avg() ?? 0.0, 2),
            ])
            ->sortKeys()
            ->values()
            ->all();
    }

    /**
     * The mandi with the most price records (most active market) for the rows.
     *
     * @param  Collection<int, MarketPrice>  $rows
     */
    private function representativeMandiId(Collection $rows): int
    {
        $counts = $rows->countBy(fn (MarketPrice $row): int => (int) $row->mandi_id)->sortDesc();

        if ($counts->isNotEmpty()) {
            return (int) $counts->keys()->first();
        }

        return 0;
    }

    /**
     * @param  \Illuminate\Support\Collection<int, array<string, mixed>>  $daily
     * @return list<array<string, mixed>>
     */
    private function aggregatePeriod(\Illuminate\Support\Collection $daily, string $unit): array
    {
        return $daily
            ->groupBy(function (array $point) use ($unit): string {
                $date = Carbon::parse($point['date']);

                return match ($unit) {
                    'week' => $date->isoWeekYear().'-W'.str_pad((string) $date->isoWeek(), 2, '0', STR_PAD_LEFT),
                    'month' => $date->format('Y-m'),
                    default => $date->format('Y'),
                };
            })
            ->map(function (\Illuminate\Support\Collection $points) use ($unit): array {
                $prices = $points->pluck('price');

                return [
                    'date' => match ($unit) {
                        'week' => Carbon::parse($points->first()['date'])->startOfWeek()->toDateString(),
                        'month' => Carbon::parse($points->first()['date'])->startOfMonth()->toDateString(),
                        default => Carbon::parse($points->first()['date'])->startOfYear()->toDateString(),
                    },
                    'price' => round($prices->avg() ?? 0.0, 2),
                    'min_price' => round($points->min('min_price') ?? 0.0, 2),
                    'max_price' => round($points->max('max_price') ?? 0.0, 2),
                    'records' => $points->count(),
                ];
            })
            ->sortKeys()
            ->values()
            ->all();
    }

    /**
     * @param  list<array<string, mixed>>  $points
     */
    private function averagePrices(array $points): float
    {
        if ($points === []) {
            return 0.0;
        }

        $total = 0.0;

        foreach ($points as $point) {
            $total += (float) $point['price'];
        }

        return $total / count($points);
    }

    private function confidenceForChange(float $changePct): string
    {
        if ($changePct >= 5.0) {
            return 'High';
        }

        if ($changePct >= 2.0) {
            return 'Medium';
        }

        return 'Low';
    }

    private function suggestSellingTime(string $trend, float $changePct): string
    {
        return match ($trend) {
            self::TREND_UP => $changePct >= 5.0
                ? 'Prices are rising sharply — sell within 2–3 days to capture the momentum.'
                : 'Prices are rising — selling within 3–5 days is favourable.',
            self::TREND_DOWN => 'Prices are declining — sell immediately before further falls.',
            default => 'Prices are stable — selling within 5–7 days is safe.',
        };
    }

    /**
     * @param  Collection<int, MarketPrice>  $movers
     * @return list<array<string, mixed>>
     */
    private function marketMovers(Collection $movers): array
    {
        return $movers->map(fn (MarketPrice $row): array => [
            'mandi' => [
                'id' => (int) $row->mandi_id,
                'name' => $row->mandi?->name,
            ],
            'crop' => [
                'id' => (int) $row->crop_id,
                'name' => $row->crop?->name,
            ],
            'price' => (float) $row->todays_price,
            'change_pct' => (float) $row->change_pct,
        ])->values()->all();
    }

    /**
     * @return array{lat: float, lng: float}|null
     *
     * @throws DomainException when the field is not owned or has no coordinates
     */
    private function resolveOrigin(?int $userId, ?int $fieldId, ?float $lat, ?float $lng): ?array
    {
        if ($fieldId !== null && $userId !== null) {
            $field = $this->fields->findById($fieldId);

            if ($field === null) {
                throw new DomainException(sprintf('Field [%d] does not exist.', $fieldId));
            }

            if ((int) $field->user_id !== $userId) {
                throw new DomainException('You do not own this field.');
            }

            if ($field->lat === null || $field->lng === null) {
                throw new DomainException('This field has no stored coordinates. Update the field with latitude and longitude first.');
            }

            return ['lat' => (float) $field->lat, 'lng' => (float) $field->lng];
        }

        if ($lat !== null && $lng !== null) {
            return ['lat' => $lat, 'lng' => $lng];
        }

        return null;
    }

    private function haversineKm(float $lat1, float $lng1, float $lat2, float $lng2): float
    {
        $earthRadiusKm = 6371.0;
        $dLat = deg2rad($lat2 - $lat1);
        $dLng = deg2rad($lng2 - $lng1);
        $a = sin($dLat / 2) ** 2
            + cos(deg2rad($lat1)) * cos(deg2rad($lat2)) * sin($dLng / 2) ** 2;

        return $earthRadiusKm * 2 * atan2(sqrt($a), sqrt(1 - $a));
    }
}
