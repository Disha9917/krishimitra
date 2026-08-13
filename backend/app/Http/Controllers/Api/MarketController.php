<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\BestSellingRequest;
use App\Http\Requests\ListMandisRequest;
use App\Http\Requests\ListPricesRequest;
use App\Http\Requests\MarketDashboardRequest;
use App\Http\Requests\NearbyMandisRequest;
use App\Http\Requests\PriceHistoryRequest;
use App\Http\Requests\PricePredictionRequest;
use App\Http\Requests\StoreMarketPriceRequest;
use App\Http\Resources\BestSellingResource;
use App\Http\Resources\MandiResource;
use App\Http\Resources\MarketDashboardResource;
use App\Http\Resources\MarketPriceResource;
use App\Http\Resources\PriceHistoryResource;
use App\Http\Resources\PricePredictionResource;
use App\Services\Market\MarketServiceInterface;
use App\Services\Market\Providers\PriceDataProviderInterface;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MarketController extends Controller
{
    public function __construct(
        private readonly MarketServiceInterface $market,
    ) {}

    public function index(ListPricesRequest $request): JsonResponse
    {
        return ApiResponse::success(
            MarketPriceResource::collection(
                $this->market->listPrices(
                    $this->filters($request->validated()),
                    $this->limit($request),
                ),
            ),
        );
    }

    public function today(ListPricesRequest $request): JsonResponse
    {
        return ApiResponse::success(
            MarketPriceResource::collection(
                $this->market->todayPrices(
                    $this->filters($request->validated()),
                    $this->limit($request),
                ),
            ),
        );
    }

    public function store(StoreMarketPriceRequest $request): JsonResponse
    {
        $price = $this->market->ingestPrice($this->priceAttributes($request->validated()));

        return ApiResponse::success(new MarketPriceResource($price), 'Market price recorded successfully.', 201);
    }

    public function show(Request $request, int $priceId): JsonResponse
    {
        $price = $this->market->getPrice($priceId);

        if ($price === null) {
            return ApiResponse::error('Market price record not found.', 404, 'market_price_not_found');
        }

        return ApiResponse::success(new MarketPriceResource($price));
    }

    public function mandis(ListMandisRequest $request): JsonResponse
    {
        return ApiResponse::success(
            MandiResource::collection(
                $this->market->listMandis(
                    $this->mandiFilters($request->validated()),
                    $this->limit($request),
                ),
            ),
        );
    }

    public function showMandi(Request $request, int $mandiId): JsonResponse
    {
        $mandi = $this->market->getMandi($mandiId);

        if ($mandi === null) {
            return ApiResponse::error('Mandi not found.', 404, 'mandi_not_found');
        }

        return ApiResponse::success(new MandiResource($mandi));
    }

    public function nearby(NearbyMandisRequest $request): JsonResponse
    {
        $radiusKm = $request->validated('radiusKm') !== null
            ? (float) $request->validated('radiusKm')
            : 50.0;
        $limit = $request->validated('limit') !== null
            ? (int) $request->validated('limit')
            : 10;

        if ($request->filled('fieldId')) {
            $result = $this->market->mandisNearField(
                (int) $request->user()->id,
                (int) $request->validated('fieldId'),
                $radiusKm,
                $limit,
            );
        } else {
            $result = $this->market->nearbyMandis(
                (float) $request->validated('lat'),
                (float) $request->validated('lng'),
                $radiusKm,
                $limit,
            );
        }

        return ApiResponse::success([
            'origin' => $result['origin'],
            'mandis' => MandiResource::collection($result['mandis']),
        ]);
    }

    public function history(PriceHistoryRequest $request): JsonResponse
    {
        return ApiResponse::success(
            new PriceHistoryResource(
                $this->market->priceHistory(
                    (int) $request->validated('cropId'),
                    (int) $request->validated('mandiId'),
                    (string) ($request->validated('period') ?? 'daily'),
                    $request->validated('from'),
                    $request->validated('to'),
                ),
            ),
        );
    }

    public function predict(PricePredictionRequest $request): JsonResponse
    {
        return ApiResponse::success(
            new PricePredictionResource(
                $this->market->pricePrediction(
                    (int) $request->user()->id,
                    (int) $request->validated('cropId'),
                    $request->validated('mandiId') !== null ? (int) $request->validated('mandiId') : null,
                    (int) ($request->validated('period') ?? 7),
                ),
            ),
        );
    }

    public function bestSelling(BestSellingRequest $request): JsonResponse
    {
        $recommendation = $this->market->bestSellingMarket(
            (int) $request->validated('cropId'),
            (int) $request->user()->id,
            $request->validated('fieldId') !== null ? (int) $request->validated('fieldId') : null,
            $request->validated('lat') !== null ? (float) $request->validated('lat') : null,
            $request->validated('lng') !== null ? (float) $request->validated('lng') : null,
        );

        if ($recommendation === null) {
            return ApiResponse::error('No market prices available for this crop.', 404, 'no_market_data');
        }

        return ApiResponse::success(new BestSellingResource($recommendation));
    }

    public function dashboard(MarketDashboardRequest $request): JsonResponse
    {
        return ApiResponse::success(
            new MarketDashboardResource(
                $this->market->marketDashboard($this->filters($request->validated())),
            ),
        );
    }

    public function sync(Request $request): JsonResponse
    {
        $request->validate([
            'source' => ['sometimes', 'string', 'in:agmarknet'],
            'cropId' => ['sometimes', 'nullable', 'integer', 'exists:crops,id'],
            'districtId' => ['sometimes', 'nullable', 'integer', 'exists:districts,id'],
            'state' => ['sometimes', 'nullable', 'string', 'max:50'],
        ]);

        $result = $this->market->syncFromProvider(
            app(PriceDataProviderInterface::class),
            $this->filters($request->all()),
        );

        return ApiResponse::success($result, 'Provider sync completed.');
    }

    /**
     * @param  array<string, mixed>  $validated
     * @return array<string, mixed>
     */
    private function priceAttributes(array $validated): array
    {
        return [
            'mandi_id' => (int) $validated['mandiId'],
            'crop_id' => (int) $validated['cropId'],
            'price_date' => $validated['priceDate'],
            'min_price' => $validated['minPrice'],
            'max_price' => $validated['maxPrice'],
            'todays_price' => $validated['todaysPrice'],
            'unit' => $validated['unit'] ?? 'INR/Quintal',
            'source' => $validated['source'] ?? 'manual',
        ];
    }

    /**
     * @param  array<string, mixed>  $validated
     * @return array<string, mixed>
     */
    private function filters(array $validated): array
    {
        $map = [
            'cropId' => 'crop_id',
            'mandiId' => 'mandi_id',
            'districtId' => 'district_id',
            'state' => 'state',
            'date' => 'date',
            'from' => 'from',
            'to' => 'to',
        ];

        return $this->mapAttributes($validated, $map);
    }

    /**
     * @param  array<string, mixed>  $validated
     * @return array<string, mixed>
     */
    private function mandiFilters(array $validated): array
    {
        $map = [
            'districtId' => 'district_id',
            'state' => 'state',
            'search' => 'search',
        ];

        return $this->mapAttributes($validated, $map);
    }

    private function limit(Request $request): int
    {
        return $request->validated('limit') !== null
            ? (int) $request->validated('limit')
            : 20;
    }

    /**
     * @param  array<string, mixed>  $validated
     * @param  array<string, string>  $map
     * @return array<string, mixed>
     */
    private function mapAttributes(array $validated, array $map): array
    {
        $attributes = [];

        foreach ($map as $requestKey => $modelKey) {
            if (array_key_exists($requestKey, $validated)) {
                $attributes[$modelKey] = $validated[$requestKey];
            }
        }

        return $attributes;
    }
}
