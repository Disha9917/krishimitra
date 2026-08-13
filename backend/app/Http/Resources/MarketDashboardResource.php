<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MarketDashboardResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'hasData' => $this['has_data'],
            'latestDate' => $this['latest_date'],
            'highestPrice' => $this['highest_price'],
            'lowestPrice' => $this['lowest_price'],
            'averagePrice' => $this['average_price'],
            'trendDistribution' => $this['trend_distribution'],
            'topGainers' => $this->movers($this['top_gainers'] ?? []),
            'topLosers' => $this->movers($this['top_losers'] ?? []),
            'dailyAverageTrend' => collect($this['daily_average_trend'] ?? [])
                ->map(fn (array $point): array => [
                    'date' => $point['date'] ?? null,
                    'averagePrice' => $point['average_price'] ?? null,
                ])
                ->values()
                ->all(),
        ];
    }

    /**
     * @param  list<array<string, mixed>>  $movers
     * @return list<array<string, mixed>>
     */
    private function movers(array $movers): array
    {
        return array_map(
            fn (array $mover): array => [
                'mandi' => $mover['mandi'] ?? null,
                'crop' => $mover['crop'] ?? null,
                'price' => $mover['price'] ?? null,
                'changePct' => $mover['change_pct'] ?? null,
            ],
            $movers,
        );
    }
}
