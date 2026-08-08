<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\Crop;
use App\Models\District;
use App\Models\FarmerField;
use App\Models\Mandi;
use App\Models\MarketPrice;
use App\Models\Region;
use App\Models\User;
use App\Services\Market\Providers\PriceDataProviderInterface;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Tests\TestCase;

class MarketModuleTest extends TestCase
{
    use WithFaker;

    private const MARKET_PATH = '/v1/market';

    protected function setUp(): void
    {
        parent::setUp();

        DB::table('prediction_history')->delete();
        DB::table('nearby_mandis')->delete();
        DB::table('price_predictions')->delete();
        DB::table('market_prices')->delete();
        DB::table('mandis')->delete();
    }

    public function test_unauthenticated_requests_are_rejected(): void
    {
        $this->getJson(self::MARKET_PATH.'/prices')->assertUnauthorized();
        $this->postJson(self::MARKET_PATH.'/prices')->assertUnauthorized();
        $this->getJson(self::MARKET_PATH.'/prices/today')->assertUnauthorized();
        $this->getJson(self::MARKET_PATH.'/prices/history')->assertUnauthorized();
        $this->getJson(self::MARKET_PATH.'/mandis')->assertUnauthorized();
        $this->getJson(self::MARKET_PATH.'/mandis/nearby')->assertUnauthorized();
        $this->getJson(self::MARKET_PATH.'/predictions')->assertUnauthorized();
        $this->getJson(self::MARKET_PATH.'/best-selling')->assertUnauthorized();
        $this->getJson(self::MARKET_PATH.'/dashboard')->assertUnauthorized();
        $this->postJson(self::MARKET_PATH.'/sync')->assertUnauthorized();
    }

    public function test_mandis_can_be_listed_with_filters(): void
    {
        $user = $this->makeUser();
        $region = $this->makeRegion();
        $district = $this->makeDistrict($region, 'Surat');
        $otherDistrict = $this->makeDistrict($region, 'Vadodara');

        $this->makeMandi($district, 'SUR-001', 'Surat APMC', 21.2, 72.85);
        $this->makeMandi($district, 'SUR-002', 'Kamrej APMC', 21.28, 72.92);
        $this->makeMandi($otherDistrict, 'VAD-001', 'Vadodara APMC', 22.3, 73.18);

        $this->actingAsUser($user)->getJson(self::MARKET_PATH.'/mandis')
            ->assertOk()
            ->assertJsonCount(3, 'data');

        $response = $this->actingAsUser($user)->getJson(self::MARKET_PATH.'/mandis?districtId='.$district->id)
            ->assertOk()
            ->assertJsonCount(2, 'data');
        $this->assertSame('Kamrej APMC', $response->json('data.0.name'));
        $this->assertSame('Surat APMC', $response->json('data.1.name'));

        $response = $this->actingAsUser($user)->getJson(self::MARKET_PATH.'/mandis?search=kamrej')
            ->assertOk()
            ->assertJsonCount(1, 'data');
        $this->assertSame('Kamrej APMC', $response->json('data.0.name'));

        $this->actingAsUser($user)->getJson(self::MARKET_PATH.'/mandis?limit=2')
            ->assertOk()
            ->assertJsonCount(2, 'data');
    }

    public function test_farmer_can_ingest_an_immutable_price_record(): void
    {
        $user = $this->makeUser();
        $mandi = $this->makeMandi($this->makeDistrict($this->makeRegion(), 'Surat'), 'SUR-001', 'Surat APMC', 21.2, 72.85);
        $crop = $this->makeCrop('wheat-'.Str::random(6), 'Wheat', 'ઘઉં');

        $response = $this->actingAsUser($user)->postJson(self::MARKET_PATH.'/prices', [
            'mandiId' => $mandi->id,
            'cropId' => $crop->id,
            'priceDate' => today()->toDateString(),
            'minPrice' => 2100,
            'maxPrice' => 2300,
            'todaysPrice' => 2200,
        ])->assertCreated();

        $this->assertSame('INR/Quintal', $response->json('data.unit'));
        $this->assertSame('STABLE', $response->json('data.trend'));
        $this->assertEquals(0.0, $response->json('data.changePct'));
        $this->assertEquals(2200.0, $response->json('data.todaysPrice'));

        $this->assertDatabaseHas('market_prices', [
            'mandi_id' => $mandi->id,
            'crop_id' => $crop->id,
            'price_date' => today()->toDateString(),
            'todays_price' => 2200,
        ]);

        $this->actingAsUser($user)->postJson(self::MARKET_PATH.'/prices', [
            'mandiId' => $mandi->id,
            'cropId' => $crop->id,
            'priceDate' => today()->toDateString(),
            'minPrice' => 2100,
            'maxPrice' => 2300,
            'todaysPrice' => 2200,
        ])->assertStatus(422)
            ->assertJsonPath('errorCode', 'domain_error')
            ->assertJsonPath('message', 'A price record already exists for this mandi, crop and date. Price history is immutable.');
    }

    public function test_ingest_derives_trend_from_the_previous_day(): void
    {
        $user = $this->makeUser();
        $mandi = $this->makeMandi($this->makeDistrict($this->makeRegion(), 'Surat'), 'SUR-001', 'Surat APMC', 21.2, 72.85);
        $crop = $this->makeCrop('wheat-'.Str::random(6), 'Wheat', 'ઘઉં');

        $this->actingAsUser($user)->postJson(self::MARKET_PATH.'/prices', [
            'mandiId' => $mandi->id,
            'cropId' => $crop->id,
            'priceDate' => today()->subDay()->toDateString(),
            'minPrice' => 2000,
            'maxPrice' => 2200,
            'todaysPrice' => 2100,
        ])->assertCreated();

        $response = $this->actingAsUser($user)->postJson(self::MARKET_PATH.'/prices', [
            'mandiId' => $mandi->id,
            'cropId' => $crop->id,
            'priceDate' => today()->toDateString(),
            'minPrice' => 2200,
            'maxPrice' => 2300,
            'todaysPrice' => 2250,
        ])->assertCreated();

        $this->assertSame('UP', $response->json('data.trend'));
        $this->assertEquals(7.14, $response->json('data.changePct'));
    }

    public function test_validation_rejects_invalid_price_inputs(): void
    {
        $user = $this->makeUser();
        $mandi = $this->makeMandi($this->makeDistrict($this->makeRegion(), 'Surat'), 'SUR-001', 'Surat APMC', 21.2, 72.85);
        $crop = $this->makeCrop('wheat-'.Str::random(6), 'Wheat', 'ઘઉં');

        $this->actingAsUser($user)->postJson(self::MARKET_PATH.'/prices', [
            'mandiId' => $mandi->id,
            'cropId' => $crop->id,
            'priceDate' => today()->toDateString(),
            'minPrice' => 2300,
            'maxPrice' => 2100,
            'todaysPrice' => 2200,
        ])->assertStatus(422);

        $this->actingAsUser($user)->postJson(self::MARKET_PATH.'/prices', [
            'mandiId' => 999999,
            'cropId' => $crop->id,
            'priceDate' => today()->toDateString(),
            'minPrice' => 2100,
            'maxPrice' => 2300,
            'todaysPrice' => 2200,
        ])->assertStatus(422);

        $this->actingAsUser($user)->postJson(self::MARKET_PATH.'/prices', [
            'mandiId' => $mandi->id,
            'cropId' => $crop->id,
            'priceDate' => today()->toDateString(),
            'minPrice' => 2100,
            'maxPrice' => 2300,
            'todaysPrice' => 2200,
            'source' => 'unknown',
        ])->assertStatus(422);

        $this->assertDatabaseCount('market_prices', 0);
    }

    public function test_live_prices_support_crop_district_and_date_filters(): void
    {
        $user = $this->makeUser();
        $region = $this->makeRegion();
        $district = $this->makeDistrict($region, 'Surat');
        $otherDistrict = $this->makeDistrict($region, 'Vadodara');
        $mandi = $this->makeMandi($district, 'SUR-001', 'Surat APMC', 21.2, 72.85);
        $otherMandi = $this->makeMandi($otherDistrict, 'VAD-001', 'Vadodara APMC', 22.3, 73.18);
        $crop = $this->makeCrop('wheat-'.Str::random(6), 'Wheat', 'ઘઉં');
        $otherCrop = $this->makeCrop('cotton-'.Str::random(6), 'Cotton', 'કપાસ');

        $this->makePrice($mandi, $crop, today()->toDateString(), 2200, ['trend' => 'UP', 'change_pct' => 2.5]);
        $this->makePrice($otherMandi, $crop, today()->toDateString(), 2100);
        $this->makePrice($mandi, $otherCrop, today()->toDateString(), 6100);
        $this->makePrice($mandi, $crop, today()->subDays(3)->toDateString(), 2000);

        $response = $this->actingAsUser($user)->getJson(self::MARKET_PATH.'/prices?cropId='.$crop->id)
            ->assertOk()
            ->assertJsonCount(3, 'data');
        $this->assertEquals(2200.0, $response->json('data.0.todaysPrice'));

        $response = $this->actingAsUser($user)->getJson(self::MARKET_PATH.'/prices?cropId='.$crop->id.'&districtId='.$district->id)
            ->assertOk()
            ->assertJsonCount(2, 'data');
        $this->assertSame('Surat APMC', $response->json('data.0.mandi.name'));

        $response = $this->actingAsUser($user)->getJson(self::MARKET_PATH.'/prices?cropId='.$crop->id.'&date='.today()->toDateString())
            ->assertOk()
            ->assertJsonCount(2, 'data');

        $response = $this->actingAsUser($user)->getJson(self::MARKET_PATH.'/prices?cropId='.$crop->id.'&from='.today()->subDays(1)->toDateString().'&to='.today()->toDateString())
            ->assertOk()
            ->assertJsonCount(2, 'data');

        $this->actingAsUser($user)->getJson(self::MARKET_PATH.'/prices?cropId=999999')
            ->assertStatus(422);
    }

    public function test_today_prices_return_only_live_records(): void
    {
        $user = $this->makeUser();
        $mandi = $this->makeMandi($this->makeDistrict($this->makeRegion(), 'Surat'), 'SUR-001', 'Surat APMC', 21.2, 72.85);
        $crop = $this->makeCrop('wheat-'.Str::random(6), 'Wheat', 'ઘઉં');

        $this->makePrice($mandi, $crop, today()->toDateString(), 2200);
        $this->makePrice($mandi, $crop, today()->subDays(2)->toDateString(), 2000);
        $this->makePrice($mandi, $crop, today()->subDays(1)->toDateString(), 2100);

        $response = $this->actingAsUser($user)->getJson(self::MARKET_PATH.'/prices/today')
            ->assertOk()
            ->assertJsonCount(1, 'data');
        $this->assertEquals(2200.0, $response->json('data.0.todaysPrice'));
    }

    public function test_single_price_record_can_be_fetched(): void
    {
        $user = $this->makeUser();
        $mandi = $this->makeMandi($this->makeDistrict($this->makeRegion(), 'Surat'), 'SUR-001', 'Surat APMC', 21.2, 72.85);
        $crop = $this->makeCrop('wheat-'.Str::random(6), 'Wheat', 'ઘઉં');
        $price = $this->makePrice($mandi, $crop, today()->toDateString(), 2200);

        $response = $this->actingAsUser($user)->getJson(self::MARKET_PATH.'/prices/'.$price->id)
            ->assertOk()
            ->assertJsonPath('data.id', (int) $price->id);
        $this->assertEquals(2200.0, $response->json('data.todaysPrice'));

        $this->actingAsUser($user)->getJson(self::MARKET_PATH.'/prices/999999')
            ->assertStatus(404)
            ->assertJsonPath('errorCode', 'market_price_not_found');
    }

    public function test_price_history_returns_daily_points(): void
    {
        $user = $this->makeUser();
        $mandi = $this->makeMandi($this->makeDistrict($this->makeRegion(), 'Surat'), 'SUR-001', 'Surat APMC', 21.2, 72.85);
        $crop = $this->makeCrop('wheat-'.Str::random(6), 'Wheat', 'ઘઉં');

        for ($day = 9; $day >= 0; $day--) {
            $this->makePrice($mandi, $crop, today()->subDays($day)->toDateString(), 2100 + $day * 10);
        }

        $response = $this->actingAsUser($user)->getJson(self::MARKET_PATH.'/prices/history?cropId='.$crop->id.'&mandiId='.$mandi->id)
            ->assertOk();

        $this->assertSame('daily', $response->json('data.period'));
        $this->assertCount(10, $response->json('data.points'));
        $this->assertEquals(2190.0, $response->json('data.points.0.price'));
        $this->assertEquals(2100.0, $response->json('data.points.9.price'));
        $this->assertSame(10, $response->json('data.pointsCount'));
    }

    public function test_price_history_supports_weekly_monthly_and_yearly_aggregation(): void
    {
        $user = $this->makeUser();
        $mandi = $this->makeMandi($this->makeDistrict($this->makeRegion(), 'Surat'), 'SUR-001', 'Surat APMC', 21.2, 72.85);
        $crop = $this->makeCrop('wheat-'.Str::random(6), 'Wheat', 'ઘઉં');

        $this->makePrice($mandi, $crop, today()->subDays(400)->toDateString(), 1800);
        $this->makePrice($mandi, $crop, today()->subDays(30)->toDateString(), 2000);
        $this->makePrice($mandi, $crop, today()->subDays(10)->toDateString(), 2050);
        $this->makePrice($mandi, $crop, today()->toDateString(), 2100);

        $weekly = $this->actingAsUser($user)->getJson(self::MARKET_PATH.'/prices/history?cropId='.$crop->id.'&mandiId='.$mandi->id.'&period=weekly')
            ->assertOk()
            ->json('data.points');
        $this->assertTrue(count($weekly) >= 3);

        $monthly = $this->actingAsUser($user)->getJson(self::MARKET_PATH.'/prices/history?cropId='.$crop->id.'&mandiId='.$mandi->id.'&period=monthly&from='.today()->subDays(40)->toDateString().'&to='.today()->toDateString())
            ->assertOk()
            ->json('data.points');
        $this->assertGreaterThanOrEqual(2, count($monthly));

        $yearly = $this->actingAsUser($user)->getJson(self::MARKET_PATH.'/prices/history?cropId='.$crop->id.'&mandiId='.$mandi->id.'&period=yearly&from='.today()->subDays(450)->toDateString().'&to='.today()->toDateString())
            ->assertOk()
            ->json('data.points');
        $this->assertGreaterThanOrEqual(2, count($yearly));

        $this->actingAsUser($user)->getJson(self::MARKET_PATH.'/prices/history?cropId='.$crop->id.'&mandiId='.$mandi->id.'&period=hourly')
            ->assertStatus(422);
    }

    public function test_nearby_mandis_are_ranked_by_distance(): void
    {
        $user = $this->makeUser();
        $district = $this->makeDistrict($this->makeRegion(), 'Surat');
        $near = $this->makeMandi($district, 'SUR-001', 'Surat APMC', 21.2, 72.85);
        $far = $this->makeMandi($district, 'SUR-002', 'Bardoli APMC', 21.12, 73.4);

        $response = $this->actingAsUser($user)->getJson(self::MARKET_PATH.'/mandis/nearby?lat=21.2&lng=72.84&radiusKm=50')
            ->assertOk();

        $this->assertSame('coordinates', $response->json('data.origin.type'));
        $this->assertCount(1, $response->json('data.mandis'));
        $this->assertSame('Surat APMC', $response->json('data.mandis.0.name'));
        $this->assertLessThan(5.0, $response->json('data.mandis.0.distanceKm'));

        $response = $this->actingAsUser($user)->getJson(self::MARKET_PATH.'/mandis/nearby?lat=21.2&lng=72.84&radiusKm=500')
            ->assertOk()
            ->assertJsonCount(2, 'data.mandis');
        $this->assertSame('Surat APMC', $response->json('data.mandis.0.name'));
        $this->assertSame('Bardoli APMC', $response->json('data.mandis.1.name'));
        $this->assertLessThan($response->json('data.mandis.1.distanceKm'), $response->json('data.mandis.0.distanceKm'));
    }

    public function test_nearby_mandis_from_field_enforce_ownership(): void
    {
        $user = $this->makeUser();
        $intruder = $this->makeUser();
        $district = $this->makeDistrict($this->makeRegion(), 'Surat');
        $this->makeMandi($district, 'SUR-001', 'Surat APMC', 21.2, 72.85);
        $field = $this->makeField($user, ['lat' => 21.2, 'lng' => 72.84]);

        $this->actingAsUser($user)->getJson(self::MARKET_PATH.'/mandis/nearby?fieldId='.$field->id)
            ->assertOk()
            ->assertJsonPath('data.origin.type', 'field')
            ->assertJsonCount(1, 'data.mandis');

        $this->actingAsUser($intruder)->getJson(self::MARKET_PATH.'/mandis/nearby?fieldId='.$field->id)
            ->assertStatus(422)
            ->assertJsonPath('errorCode', 'domain_error');

        $noCoords = $this->makeField($user);
        $this->actingAsUser($user)->getJson(self::MARKET_PATH.'/mandis/nearby?fieldId='.$noCoords->id)
            ->assertStatus(422)
            ->assertJsonPath('errorCode', 'domain_error');

        $this->actingAsUser($user)->getJson(self::MARKET_PATH.'/mandis/nearby?lat=21.2&lng=72.84&fieldId='.$field->id)
            ->assertStatus(422);
    }

    public function test_prediction_returns_insufficient_data_without_history(): void
    {
        $user = $this->makeUser();
        $crop = $this->makeCrop('wheat-'.Str::random(6), 'Wheat', 'ઘઉં');

        $response = $this->actingAsUser($user)->getJson(self::MARKET_PATH.'/predictions?cropId='.$crop->id.'&period=7')
            ->assertOk();

        $this->assertFalse($response->json('data.hasPrediction'));
        $this->assertSame('insufficient_data', $response->json('data.reason'));
        $this->assertSame($crop->id, $response->json('data.cropId'));
        $this->assertDatabaseCount('price_predictions', 0);
        $this->assertDatabaseCount('prediction_history', 0);
    }

    public function test_prediction_generates_forecast_and_persists_records(): void
    {
        $user = $this->makeUser();
        $mandi = $this->makeMandi($this->makeDistrict($this->makeRegion(), 'Surat'), 'SUR-001', 'Surat APMC', 21.2, 72.85);
        $crop = $this->makeCrop('wheat-'.Str::random(6), 'Wheat', 'ઘઉં');

        for ($day = 14; $day >= 1; $day--) {
            $this->makePrice($mandi, $crop, today()->subDays($day)->toDateString(), 100.0 + (15 - $day) * 2.0);
        }

        $response = $this->actingAsUser($user)->getJson(self::MARKET_PATH.'/predictions?cropId='.$crop->id.'&mandiId='.$mandi->id.'&period=7')
            ->assertOk();

        $this->assertTrue($response->json('data.hasPrediction'));
        $this->assertSame('UP', $response->json('data.trend'));
        $this->assertSame('rising', $response->json('data.indicator'));
        $this->assertEquals(128.0, $response->json('data.currentPrice'));
        $this->assertEquals(12.96, $response->json('data.changePct'));
        $this->assertSame(7, $response->json('data.periodDays'));
        $this->assertCount(7, $response->json('data.predictedPrices'));
        $this->assertEquals(130.0, $response->json('data.predictedPrices.0.price'));
        $this->assertEquals(142.0, $response->json('data.predictedPrices.6.price'));
        $this->assertSame('High', $response->json('data.confidence'));

        $this->assertDatabaseHas('price_predictions', [
            'crop_id' => $crop->id,
            'mandi_id' => $mandi->id,
            'period' => 7,
            'model_version' => 'rule-based-v1',
        ]);
        $this->assertDatabaseHas('prediction_history', [
            'user_id' => $user->id,
            'prediction_type' => 'market_price',
            'source_table' => 'price_predictions',
            'crop_id' => $crop->id,
            'status' => 'Active',
        ]);
    }

    public function test_best_selling_market_weights_price_and_distance(): void
    {
        $user = $this->makeUser();
        $district = $this->makeDistrict($this->makeRegion(), 'Surat');
        $near = $this->makeMandi($district, 'SUR-001', 'Surat APMC', 21.2, 72.85);
        $far = $this->makeMandi($district, 'SUR-002', 'Bardoli APMC', 21.12, 73.4);
        $crop = $this->makeCrop('wheat-'.Str::random(6), 'Wheat', 'ઘઉં');

        $this->makePrice($near, $crop, today()->toDateString(), 2200, ['trend' => 'UP', 'change_pct' => 3.0]);
        $this->makePrice($far, $crop, today()->toDateString(), 2500, ['trend' => 'DOWN', 'change_pct' => -2.0]);

        $response = $this->actingAsUser($user)->getJson(self::MARKET_PATH.'/best-selling?cropId='.$crop->id.'&lat=21.2&lng=72.84')
            ->assertOk();

        $this->assertSame('Surat APMC', $response->json('data.mandi.name'));
        $this->assertEquals(2200.0, $response->json('data.expectedPrice'));
        $this->assertLessThan(5.0, $response->json('data.estimatedDistanceKm'));
        $this->assertEquals(3.0, $response->json('data.basis.changePct'));
        $this->assertNotNull($response->json('data.suggestedSellingTime'));
    }

    public function test_best_selling_requires_a_valid_origin(): void
    {
        $user = $this->makeUser();
        $intruder = $this->makeUser();
        $district = $this->makeDistrict($this->makeRegion(), 'Surat');
        $mandi = $this->makeMandi($district, 'SUR-001', 'Surat APMC', 21.2, 72.85);
        $crop = $this->makeCrop('wheat-'.Str::random(6), 'Wheat', 'ઘઉં');
        $this->makePrice($mandi, $crop, today()->toDateString(), 2200);

        $field = $this->makeField($user, ['lat' => 21.2, 'lng' => 72.84]);

        $response = $this->actingAsUser($user)->getJson(self::MARKET_PATH.'/best-selling?cropId='.$crop->id.'&fieldId='.$field->id)
            ->assertOk();
        $this->assertEquals(1.04, $response->json('data.estimatedDistanceKm'));

        $this->actingAsUser($intruder)->getJson(self::MARKET_PATH.'/best-selling?cropId='.$crop->id.'&fieldId='.$field->id)
            ->assertStatus(422)
            ->assertJsonPath('errorCode', 'domain_error');

        $noCoords = $this->makeField($user);
        $this->actingAsUser($user)->getJson(self::MARKET_PATH.'/best-selling?cropId='.$crop->id.'&fieldId='.$noCoords->id)
            ->assertStatus(422)
            ->assertJsonPath('errorCode', 'domain_error');
    }

    public function test_best_selling_returns_not_found_without_market_data(): void
    {
        $user = $this->makeUser();
        $crop = $this->makeCrop('wheat-'.Str::random(6), 'Wheat', 'ઘઉં');

        $this->actingAsUser($user)->getJson(self::MARKET_PATH.'/best-selling?cropId='.$crop->id.'&lat=21.2&lng=72.84')
            ->assertStatus(404)
            ->assertJsonPath('errorCode', 'no_market_data');
    }

    public function test_dashboard_returns_stats_distribution_and_trends(): void
    {
        $user = $this->makeUser();
        $region = $this->makeRegion();
        $district = $this->makeDistrict($region, 'Surat');
        $otherDistrict = $this->makeDistrict($region, 'Vadodara');
        $mandi = $this->makeMandi($district, 'SUR-001', 'Surat APMC', 21.2, 72.85);
        $otherMandi = $this->makeMandi($otherDistrict, 'VAD-001', 'Vadodara APMC', 22.3, 73.18);
        $crop = $this->makeCrop('wheat-'.Str::random(6), 'Wheat', 'ઘઉં');
        $otherCrop = $this->makeCrop('cotton-'.Str::random(6), 'Cotton', 'કપાસ');

        $this->makePrice($mandi, $crop, today()->toDateString(), 2200, ['trend' => 'UP', 'change_pct' => 5.0]);
        $this->makePrice($otherMandi, $crop, today()->toDateString(), 1500, ['trend' => 'DOWN', 'change_pct' => -3.0]);
        $this->makePrice($mandi, $otherCrop, today()->toDateString(), 1000, ['trend' => 'STABLE', 'change_pct' => 0.0]);
        $this->makePrice($mandi, $crop, today()->subDay()->toDateString(), 1800);

        $response = $this->actingAsUser($user)->getJson(self::MARKET_PATH.'/dashboard')
            ->assertOk();

        $this->assertTrue($response->json('data.hasData'));
        $this->assertEquals(2200.0, $response->json('data.highestPrice'));
        $this->assertEquals(1000.0, $response->json('data.lowestPrice'));
        $this->assertEquals(1566.67, $response->json('data.averagePrice'));
        $this->assertSame(1, $response->json('data.trendDistribution.UP'));
        $this->assertSame(1, $response->json('data.trendDistribution.DOWN'));
        $this->assertSame(1, $response->json('data.trendDistribution.STABLE'));
        $this->assertSame('Surat APMC', $response->json('data.topGainers.0.mandi.name'));
        $this->assertEquals(5.0, $response->json('data.topGainers.0.changePct'));
        $this->assertSame('Vadodara APMC', $response->json('data.topLosers.0.mandi.name'));
        $this->assertEquals(-3.0, $response->json('data.topLosers.0.changePct'));
        $this->assertCount(2, $response->json('data.dailyAverageTrend'));
        $this->assertEquals(1800.0, $response->json('data.dailyAverageTrend.0.averagePrice'));
        $this->assertEquals(1566.67, $response->json('data.dailyAverageTrend.1.averagePrice'));

        $response = $this->actingAsUser($user)->getJson(self::MARKET_PATH.'/dashboard?cropId='.$crop->id)
            ->assertOk();
        $this->assertEquals(1850.0, $response->json('data.averagePrice'));
    }

    public function test_sync_from_provider_ingests_immutable_records(): void
    {
        $user = $this->makeUser();
        $mandi = $this->makeMandi($this->makeDistrict($this->makeRegion(), 'Surat'), 'SUR-001', 'Surat APMC', 21.2, 72.85);
        $crop = $this->makeCrop('wheat-'.Str::random(6), 'Wheat', 'ઘઉં');

        $provider = new class implements PriceDataProviderInterface
        {
            public function name(): string
            {
                return 'agmarknet';
            }

            public function fetch(array $filters = []): array
            {
                $mandiId = (int) $filters['mandi_id'];
                $cropId = (int) $filters['crop_id'];

                return [
                    [
                        'mandi_id' => $mandiId,
                        'crop_id' => $cropId,
                        'price_date' => today()->toDateString(),
                        'min_price' => 2000.0,
                        'max_price' => 2200.0,
                        'todays_price' => 2100.0,
                        'unit' => 'INR/Quintal',
                        'source' => 'agmarknet',
                    ],
                    [
                        'mandi_id' => $mandiId,
                        'crop_id' => $cropId,
                        'price_date' => today()->subDay()->toDateString(),
                        'min_price' => 1900.0,
                        'max_price' => 2100.0,
                        'todays_price' => 2000.0,
                        'unit' => 'INR/Quintal',
                        'source' => 'agmarknet',
                    ],
                ];
            }
        };

        $this->app->bind(PriceDataProviderInterface::class, fn () => $provider);

        $response = $this->actingAsUser($user)->postJson(self::MARKET_PATH.'/sync?mandiId='.$mandi->id.'&cropId='.$crop->id)
            ->assertOk();

        $this->assertSame(2, $response->json('data.ingested'));
        $this->assertSame(0, $response->json('data.skipped'));
        $this->assertDatabaseCount('market_prices', 2);

        $response = $this->actingAsUser($user)->postJson(self::MARKET_PATH.'/sync?mandiId='.$mandi->id.'&cropId='.$crop->id)
            ->assertOk();
        $this->assertSame(0, $response->json('data.ingested'));
        $this->assertSame(2, $response->json('data.skipped'));
        $this->assertDatabaseCount('market_prices', 2);
    }

    private function makeUser(): User
    {
        $phone = '9'.str_pad((string) mt_rand(0, 999999999), 9, '0', STR_PAD_LEFT);

        return User::create([
            'full_name' => $this->faker->name(),
            'phone' => $phone,
            'password_hash' => Hash::make('secret123'),
            'preferred_language' => 'gu',
            'is_active' => true,
        ]);
    }

    private function makeRegion(): Region
    {
        return Region::create([
            'code' => 'GJ-'.Str::random(8),
            'name' => 'Gujarat Region '.uniqid(),
            'name_gujarati' => 'ગુજરાત',
            'display_order' => 1,
            'is_active' => true,
        ]);
    }

    private function makeDistrict(Region $region, string $name): District
    {
        return District::create([
            'region_id' => (int) $region->id,
            'code' => 'DIST-'.Str::random(8),
            'name' => $name.' '.uniqid(),
            'name_gujarati' => $name,
            'default_pincode' => '395001',
            'is_active' => true,
        ]);
    }

    private function makeMandi(District $district, string $code, string $name, float $lat, float $lng): Mandi
    {
        return Mandi::create([
            'code' => $code,
            'name' => $name,
            'state' => 'Gujarat',
            'district_id' => (int) $district->id,
            'pincode' => '395001',
            'lat' => $lat,
            'lng' => $lng,
            'apmc_id_external' => null,
            'is_active' => true,
        ]);
    }

    /**
     * @param  array<string, mixed>  $attributes
     */
    private function makePrice(Mandi $mandi, Crop $crop, string $date, float $price, array $attributes = []): MarketPrice
    {
        return MarketPrice::create(array_merge([
            'mandi_id' => (int) $mandi->id,
            'crop_id' => (int) $crop->id,
            'price_date' => $date,
            'min_price' => $price - 20,
            'max_price' => $price + 20,
            'todays_price' => $price,
            'change_pct' => 0,
            'trend' => 'STABLE',
            'unit' => 'INR/Quintal',
            'source' => 'agmarknet',
        ], $attributes));
    }

    /**
     * @param  array<string, mixed>  $attributes
     */
    private function makeField(User $user, array $attributes = []): FarmerField
    {
        return FarmerField::create(array_merge([
            'user_id' => (int) $user->id,
            'name' => $this->faker->word().' Field',
            'size_acres' => 3.5,
        ], $attributes));
    }

    private function makeCrop(string $code, string $name, string $nameGujarati): Crop
    {
        return Crop::create([
            'code' => $code,
            'name' => $name,
            'name_gujarati' => $nameGujarati,
            'category' => 'traditional',
            'is_active' => true,
        ]);
    }

    private function actingAsUser(User $user): static
    {
        app('auth')->forgetGuards();

        return $this->withToken($user->createToken('market-test')->plainTextToken);
    }
}
