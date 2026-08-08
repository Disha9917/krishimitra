<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\Crop;
use App\Models\DiseaseDetection;
use App\Models\Equipment;
use App\Models\EquipmentBooking;
use App\Models\FarmerCrop;
use App\Models\FarmerField;
use App\Models\FarmerProfile;
use App\Models\Notification;
use App\Models\SoilTest;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Tests\TestCase;

class UnifiedDashboardModuleTest extends TestCase
{
    use WithFaker;

    private const SECTIONS = [
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
    ];

    public function test_unauthenticated_requests_are_rejected(): void
    {
        $this->getJson('/v1/dashboard/unified')->assertUnauthorized();
        $this->getJson('/v1/dashboard/unified?sections=weather')->assertUnauthorized();
        $this->getJson('/v1/dashboard/unified?refresh=1')->assertUnauthorized();
    }

    public function test_unified_dashboard_returns_all_sections(): void
    {
        $user = $this->makeUser();
        $this->makeProfile($user);

        $response = $this->actingAsUser($user)->getJson('/v1/dashboard/unified')->assertOk();

        $data = $response->json('data');

        foreach (self::SECTIONS as $section) {
            $this->assertArrayHasKey($section, $data);
        }

        $this->assertArrayHasKey('cached', $data);
        $this->assertFalse($data['cached']);
        $this->assertIsString($data['generatedAt']);
        $this->assertNotEmpty($data['quickActions']);
        $this->assertSame(0, $data['overview']['fields_count']);
        $this->assertSame(0, $data['statistics']['fields']);
    }

    public function test_weather_section_degrades_gracefully_without_location(): void
    {
        $user = $this->makeUser();
        $this->makeProfile($user);

        $this->actingAsUser($user)->getJson('/v1/dashboard/unified')->assertOk()
            ->assertJsonPath('data.weather.available', false)
            ->assertJsonPath('data.weather.reason', 'No location available for this farmer.');
    }

    public function test_sections_parameter_filters_payload(): void
    {
        $user = $this->makeUser();
        $this->makeProfile($user);

        $this->actingAsUser($user)->getJson('/v1/dashboard/unified?sections=weather,market')->assertOk()
            ->assertJsonPath('data.weather.available', false)
            ->assertJsonPath('data.overview', null)
            ->assertJsonPath('data.soil', null)
            ->assertJsonPath('data.statistics', null)
            ->assertJsonStructure(['data' => ['market' => ['has_data']]]);
    }

    public function test_invalid_sections_parameter_is_rejected(): void
    {
        $user = $this->makeUser();

        $this->actingAsUser($user)->getJson('/v1/dashboard/unified?sections=weather,bogus')->assertStatus(422);
        $this->actingAsUser($user)->getJson('/v1/dashboard/unified?sections=Weather')->assertStatus(422);
        $this->actingAsUser($user)->getJson('/v1/dashboard/unified?sections=overview;weather')->assertStatus(422);
    }

    public function test_dashboard_is_cached_and_second_call_served_from_cache(): void
    {
        $user = $this->makeUser();
        $this->makeProfile($user);

        $first = $this->actingAsUser($user)->getJson('/v1/dashboard/unified')->assertOk();
        $this->assertFalse($first->json('data.cached'));
        $this->assertTrue(Cache::has('unified_dashboard:'.$user->id));

        $second = $this->actingAsUser($user)->getJson('/v1/dashboard/unified')->assertOk();
        $this->assertTrue($second->json('data.cached'));
        $this->assertSame($first->json('data.generatedAt'), $second->json('data.generatedAt'));
    }

    public function test_refresh_parameter_forces_rebuild(): void
    {
        $user = $this->makeUser();
        $this->makeProfile($user);

        $this->actingAsUser($user)->getJson('/v1/dashboard/unified')->assertOk();
        $this->assertTrue(Cache::has('unified_dashboard:'.$user->id));

        $refreshed = $this->actingAsUser($user)->getJson('/v1/dashboard/unified?refresh=1')->assertOk();
        $this->assertFalse($refreshed->json('data.cached'));
    }

    public function test_notification_creation_invalidates_cache_and_updates_unread_count(): void
    {
        $user = $this->makeUser();
        $this->makeProfile($user);

        $this->actingAsUser($user)->getJson('/v1/dashboard/unified')->assertOk();
        $this->assertTrue(Cache::has('unified_dashboard:'.$user->id));

        $this->makeNotification($user, 'PRICE', 'Price Alert '.Str::random(6));

        $this->assertFalse(Cache::has('unified_dashboard:'.$user->id));

        $after = $this->actingAsUser($user)->getJson('/v1/dashboard/unified')->assertOk();
        $this->assertFalse($after->json('data.cached'));
        $this->assertSame(1, $after->json('data.notifications.unread_count'));
        $this->assertSame(1, $after->json('data.statistics.unread_notifications'));
    }

    public function test_profile_update_invalidates_cache(): void
    {
        $user = $this->makeUser();
        $this->makeProfile($user);

        $this->actingAsUser($user)->getJson('/v1/dashboard/unified')->assertOk();
        $this->assertTrue(Cache::has('unified_dashboard:'.$user->id));

        FarmerProfile::query()->where('user_id', $user->id)->first()
            ->update(['village' => 'Updated Village '.Str::random(6)]);

        $this->assertFalse(Cache::has('unified_dashboard:'.$user->id));
    }

    public function test_equipment_booking_invalidates_owner_and_renter_caches(): void
    {
        $owner = $this->makeUser();
        $renter = $this->makeUser();
        $equipment = $this->makeEquipment($owner);

        $this->actingAsUser($owner)->getJson('/v1/dashboard/unified')->assertOk();
        $this->actingAsUser($renter)->getJson('/v1/dashboard/unified')->assertOk();
        $this->assertTrue(Cache::has('unified_dashboard:'.$owner->id));
        $this->assertTrue(Cache::has('unified_dashboard:'.$renter->id));

        $this->makeEquipmentBooking($renter, $equipment);

        $this->assertFalse(Cache::has('unified_dashboard:'.$owner->id));
        $this->assertFalse(Cache::has('unified_dashboard:'.$renter->id));
    }

    public function test_overview_reflects_profile_fields_and_crops(): void
    {
        $user = $this->makeUser();
        $profile = $this->makeProfile($user);
        $field = $this->makeField($user);
        $this->makeCrop($user, $field);

        $this->actingAsUser($user)->getJson('/v1/dashboard/unified')->assertOk()
            ->assertJsonPath('data.overview.profile.pincode', $profile->pincode)
            ->assertJsonPath('data.overview.fields_count', 1)
            ->assertJsonPath('data.overview.crops_count', 1)
            ->assertJsonPath('data.overview.active_crops', 1)
            ->assertJsonPath('data.statistics.crops_total', 1)
            ->assertJsonPath('data.quickActions.0.enabled', true);
    }

    public function test_notifications_section_contains_by_type_breakdown(): void
    {
        $user = $this->makeUser();
        $this->makeNotification($user, 'WEATHER', 'Heavy Rain '.Str::random(6));
        $this->makeNotification($user, 'DISEASE', 'Blast Detected '.Str::random(6));

        $this->actingAsUser($user)->getJson('/v1/dashboard/unified')->assertOk()
            ->assertJsonPath('data.notifications.unread_count', 2)
            ->assertJsonPath('data.notifications.by_type.WEATHER', 1)
            ->assertJsonPath('data.notifications.by_type.DISEASE', 1)
            ->assertJsonCount(2, 'data.notifications.recent');
    }

    public function test_statistics_section_aggregates_counts(): void
    {
        $user = $this->makeUser();
        $field = $this->makeField($user);
        $this->makeSoilTest($user, $field);
        $this->makeNotification($user, 'ADVISORY', 'Welcome '.Str::random(6));

        $this->actingAsUser($user)->getJson('/v1/dashboard/unified')->assertOk()
            ->assertJsonPath('data.statistics.fields', 1)
            ->assertJsonPath('data.statistics.soil_tests', 1)
            ->assertJsonPath('data.statistics.unread_notifications', 1);
    }

    public function test_dashboards_are_scoped_per_user(): void
    {
        $userA = $this->makeUser();
        $this->makeProfile($userA);
        $this->makeNotification($userA, 'PRICE', 'Private Alert '.Str::random(6));

        $userB = $this->makeUser();

        $this->actingAsUser($userA)->getJson('/v1/dashboard/unified')->assertOk()
            ->assertJsonPath('data.notifications.unread_count', 1);

        $this->actingAsUser($userB)->getJson('/v1/dashboard/unified')->assertOk()
            ->assertJsonPath('data.notifications.unread_count', 0)
            ->assertJsonCount(0, 'data.notifications.recent')
            ->assertJsonPath('data.statistics.fields', 0);
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

    private function actingAsUser(User $user): static
    {
        return $this->actingAs($user, 'sanctum');
    }

    private function makeProfile(User $user): FarmerProfile
    {
        return FarmerProfile::create([
            'user_id' => (int) $user->id,
            'farm_size_acres' => 5.50,
            'pincode' => '382210',
            'state' => 'Gujarat',
            'village' => 'Test Village',
            'alert_preferences' => ['weather' => true],
        ]);
    }

    private function makeField(User $user): FarmerField
    {
        return FarmerField::create([
            'user_id' => (int) $user->id,
            'name' => 'Field '.Str::random(6),
            'size_acres' => 2.50,
        ]);
    }

    private function makeCrop(User $user, FarmerField $field): FarmerCrop
    {
        $crop = Crop::query()->first();

        if ($crop === null) {
            $crop = Crop::create([
                'code' => 'CROP-'.Str::random(6),
                'name' => $this->faker->word().' Crop',
                'name_gujarati' => 'પાક',
                'category' => 'traditional',
                'is_active' => true,
            ]);
        }

        return FarmerCrop::create([
            'user_id' => (int) $user->id,
            'crop_id' => (int) $crop->id,
            'field_id' => (int) $field->id,
            'season' => 'Kharif',
            'sowing_date' => Carbon::now()->subDays(30)->toDateString(),
            'expected_harvest_date' => Carbon::now()->addDays(60)->toDateString(),
            'is_current' => true,
        ]);
    }

    private function makeEquipment(User $owner): Equipment
    {
        return Equipment::create([
            'provider_id' => (int) $owner->id,
            'name' => 'Tractor '.Str::random(6),
            'equipment_type' => 'tractor',
            'description' => 'Test tractor',
            'daily_rate' => 1500.00,
            'pincode' => '382210',
            'is_available' => true,
        ]);
    }

    private function makeEquipmentBooking(User $renter, Equipment $equipment): EquipmentBooking
    {
        return EquipmentBooking::create([
            'user_id' => (int) $renter->id,
            'equipment_id' => (int) $equipment->id,
            'start_at' => Carbon::now()->addDays(2)->format('Y-m-d 09:00:00'),
            'end_at' => Carbon::now()->addDays(4)->format('Y-m-d 18:00:00'),
            'total_amount' => 4500.00,
            'deposit_amount' => 1000.00,
            'status' => 'pending',
            'payment_status' => 'unpaid',
        ]);
    }

    private function makeNotification(User $user, string $type, string $title): Notification
    {
        return Notification::create([
            'user_id' => (int) $user->id,
            'type' => $type,
            'title' => $title,
            'message' => $this->faker->sentence(),
        ]);
    }

    private function makeSoilTest(User $user, FarmerField $field): SoilTest
    {
        return SoilTest::create([
            'user_id' => (int) $user->id,
            'field_id' => (int) $field->id,
            'lab_name' => 'Lab '.Str::random(6),
            'health_score' => 85.00,
        ]);
    }
}
