<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\ColdStorage;
use App\Models\ColdStorageBooking;
use App\Models\Crop;
use App\Models\District;
use App\Models\Region;
use App\Models\Taluka;
use App\Models\UploadedFile;
use App\Models\User;
use App\Models\Village;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Tests\TestCase;

/**
 * End-to-end tests for the Enterprise Cold Storage Module (Phase 9I).
 *
 * NOTE: These tests run against the configured Supabase PostgreSQL
 * connection (no RefreshDatabase — the shared database must not be reset).
 * Every record is created with unique identifiers so test runs never clash.
 */
class ColdStorageModuleTest extends TestCase
{
    use WithFaker;

    public function test_unauthenticated_requests_are_rejected(): void
    {
        $this->getJson('/v1/cold-storage')->assertUnauthorized();
        $this->postJson('/v1/cold-storage', [])->assertUnauthorized();
        $this->getJson('/v1/cold-storage/dashboard')->assertUnauthorized();
        $this->getJson('/v1/cold-storage/bookings')->assertUnauthorized();
        $this->getJson('/v1/cold-storage/bookings/owner')->assertUnauthorized();
        $this->postJson('/v1/cold-storage/1/bookings', [])->assertUnauthorized();
        $this->getJson('/v1/cold-storage/1/monitoring')->assertUnauthorized();
    }

    public function test_listing_supports_location_crop_price_temperature_and_capacity_filters(): void
    {
        $user = $this->makeUser();
        $districtA = $this->makeDistrict($this->makeRegion(), 'AHM-'.Str::random(4), 'Ahmedabad');
        $talukaA = $this->makeTaluka($districtA, 'TLK-'.Str::random(4), 'Sanand');
        $villageA = $this->makeVillage($talukaA, 'VLG-'.Str::random(4), 'Jolva');
        $districtB = $this->makeDistrict($this->makeRegion(), 'SUR-'.Str::random(4), 'Surat');
        $wheat = $this->makeCrop('wheat-cs-'.Str::random(6), 'Wheat', 'ઘઉં');
        $potato = $this->makeCrop('potato-cs-'.Str::random(6), 'Potato', 'બટાટા');

        $tagA = Str::random(6);
        $tagB = Str::random(6);
        $tagC = Str::random(6);

        $this->makeStorage([
            'owner_id' => (int) $user->id,
            'name' => 'Chamber A '.$tagA,
            'district_id' => (int) $districtA->id,
            'taluka_id' => (int) $talukaA->id,
            'village_id' => (int) $villageA->id,
            'capacity_tonnes' => 100.00,
            'occupied_tonnes' => 0,
            'min_temp_c' => -2.00,
            'max_temp_c' => 4.00,
            'supported_crops' => [(int) $wheat->id, (int) $potato->id],
            'rate_per_tonne_month' => 1500.00,
        ]);
        $this->makeStorage([
            'owner_id' => (int) $user->id,
            'name' => 'Chamber B '.$tagB,
            'district_id' => (int) $districtB->id,
            'capacity_tonnes' => 200.00,
            'occupied_tonnes' => 200.00,
            'min_temp_c' => 0.00,
            'max_temp_c' => 8.00,
            'supported_crops' => [(int) $potato->id],
            'rate_per_tonne_month' => 800.00,
        ]);
        $this->makeStorage([
            'owner_id' => (int) $user->id,
            'name' => 'Chamber C '.$tagC,
            'district_id' => (int) $districtA->id,
            'capacity_tonnes' => 50.00,
            'occupied_tonnes' => 0,
            'min_temp_c' => -10.00,
            'max_temp_c' => -2.00,
            'supported_crops' => [],
            'rate_per_tonne_month' => 2000.00,
        ]);

        $list = $this->actingAsUser($user)->getJson('/v1/cold-storage?limit=100')->assertOk();
        $names = array_column($list->json('data'), 'name');
        $this->assertContains('Chamber A '.$tagA, $names);
        $this->assertContains('Chamber B '.$tagB, $names);
        $this->assertContains('Chamber C '.$tagC, $names);

        $this->actingAsUser($user)->getJson('/v1/cold-storage?districtId='.$districtA->id)
            ->assertOk()
            ->assertJsonCount(2, 'data');

        $this->actingAsUser($user)->getJson('/v1/cold-storage?talukaId='.$talukaA->id)
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.name', 'Chamber A '.$tagA);

        $this->actingAsUser($user)->getJson('/v1/cold-storage?villageId='.$villageA->id)
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.name', 'Chamber A '.$tagA);

        $this->actingAsUser($user)->getJson('/v1/cold-storage?cropId='.$wheat->id)
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.name', 'Chamber A '.$tagA);

        $this->actingAsUser($user)->getJson('/v1/cold-storage?minPrice=1000&maxPrice=2000')
            ->assertOk()
            ->assertJsonPath('data.0.name', 'Chamber C '.$tagC);

        $this->actingAsUser($user)->getJson('/v1/cold-storage?minTemp=-5')
            ->assertOk()
            ->assertJsonPath('data.0.name', 'Chamber B '.$tagB);

        $this->actingAsUser($user)->getJson('/v1/cold-storage?maxTemp=6')
            ->assertOk()
            ->assertJsonPath('data.0.name', 'Chamber C '.$tagC);

        $this->actingAsUser($user)->getJson('/v1/cold-storage?hasCapacity=1')
            ->assertOk()
            ->assertJsonPath('data.0.name', 'Chamber C '.$tagC)
            ->assertJsonPath('data.1.name', 'Chamber A '.$tagA);

        $this->actingAsUser($user)->getJson('/v1/cold-storage?search='.$tagC)
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.name', 'Chamber C '.$tagC);
    }

    public function test_details_returns_404_for_unknown_and_soft_deleted_facilities(): void
    {
        $user = $this->makeUser();
        $active = $this->makeStorage(['owner_id' => (int) $user->id, 'name' => 'Active Chamber '.Str::random(6)]);
        $deleted = $this->makeStorage(['owner_id' => (int) $user->id, 'name' => 'Retired Chamber '.Str::random(6)]);
        $deleted->delete();

        $this->actingAsUser($user)->getJson('/v1/cold-storage/'.$active->id)
            ->assertOk()
            ->assertJsonPath('data.id', (int) $active->id)
            ->assertJsonPath('data.availableTonnes', 100);

        $this->actingAsUser($user)->getJson('/v1/cold-storage/'.$deleted->id)
            ->assertStatus(404);

        $this->actingAsUser($user)->getJson('/v1/cold-storage/999999999')
            ->assertStatus(404);
    }

    public function test_create_validates_capacity_price_and_location(): void
    {
        $user = $this->makeUser();
        $district = $this->makeDistrict($this->makeRegion(), 'VDR-'.Str::random(4), 'Vadodara');

        $this->actingAsUser($user)->postJson('/v1/cold-storage', [
            'name' => 'Bad Chamber',
            'pincode' => '38',
            'capacityTonnes' => 0,
            'ratePerTonneMonth' => -5,
            'districtId' => (int) $district->id,
        ])->assertStatus(422);

        $this->actingAsUser($user)->postJson('/v1/cold-storage', [
            'name' => 'Good Chamber '.Str::random(6),
            'pincode' => '380001',
            'districtId' => (int) $district->id,
            'capacityTonnes' => 250,
            'ratePerTonneMonth' => 1200,
            'minTempC' => -2,
            'maxTempC' => 4,
            'supportedCrops' => [],
        ])->assertStatus(201)
            ->assertJsonPath('data.capacityTonnes', 250)
            ->assertJsonPath('data.ratePerTonneMonth', 1200)
            ->assertJsonPath('data.temperatureRange.minC', -2)
            ->assertJsonPath('data.isActive', true);
    }

    public function test_owner_can_update_and_soft_delete_their_facility(): void
    {
        $user = $this->makeUser();
        $facility = $this->makeStorage([
            'owner_id' => (int) $user->id,
            'name' => 'Update Me '.Str::random(6),
            'rate_per_tonne_month' => 1000.00,
        ]);

        $this->actingAsUser($user)->putJson('/v1/cold-storage/'.$facility->id, [
            'ratePerTonneMonth' => 1400,
            'isActive' => false,
        ])->assertOk()
            ->assertJsonPath('data.ratePerTonneMonth', 1400)
            ->assertJsonPath('data.isActive', false);

        $this->actingAsUser($user)->deleteJson('/v1/cold-storage/'.$facility->id)
            ->assertOk();

        $this->assertSoftDeleted('cold_storages', ['id' => (int) $facility->id]);

        $this->actingAsUser($user)->getJson('/v1/cold-storage/'.$facility->id)
            ->assertStatus(404);
    }

    public function test_ownership_is_enforced_on_update_and_delete(): void
    {
        $owner = $this->makeUser();
        $intruder = $this->makeUser();
        $facility = $this->makeStorage([
            'owner_id' => (int) $owner->id,
            'name' => 'Owned Chamber '.Str::random(6),
        ]);

        $this->actingAsUser($intruder)->putJson('/v1/cold-storage/'.$facility->id, [
            'name' => 'Hijacked',
            'capacityTonnes' => 999,
            'ratePerTonneMonth' => 500,
            'pincode' => '380001',
            'districtId' => (int) $facility->district_id,
        ])->assertStatus(422)
            ->assertJsonPath('errorCode', 'domain_error');

        $this->actingAsUser($intruder)->deleteJson('/v1/cold-storage/'.$facility->id)
            ->assertStatus(422)
            ->assertJsonPath('errorCode', 'domain_error');

        $this->assertDatabaseHas('cold_storages', ['id' => (int) $facility->id, 'deleted_at' => null]);
    }

    public function test_facility_creation_filters_image_files_to_owner(): void
    {
        $user = $this->makeUser();
        $other = $this->makeUser();
        $district = $this->makeDistrict($this->makeRegion(), 'RJK-'.Str::random(4), 'Rajkot');

        $ownedFile = UploadedFile::create([
            'user_id' => (int) $user->id,
            'disk' => 'local',
            'path' => 'cold-storage/owned.jpg',
            'original_name' => 'owned.jpg',
            'mime_type' => 'image/jpeg',
            'size_bytes' => 100,
            'visibility' => 'private',
        ]);
        $foreignFile = UploadedFile::create([
            'user_id' => (int) $other->id,
            'disk' => 'local',
            'path' => 'cold-storage/foreign.jpg',
            'original_name' => 'foreign.jpg',
            'mime_type' => 'image/jpeg',
            'size_bytes' => 100,
            'visibility' => 'private',
        ]);

        $this->actingAsUser($user)->postJson('/v1/cold-storage', [
            'name' => 'Chamber With Photos '.Str::random(6),
            'pincode' => '360001',
            'districtId' => (int) $district->id,
            'capacityTonnes' => 100,
            'ratePerTonneMonth' => 900,
            'imageFileIds' => [(int) $ownedFile->id, (int) $foreignFile->id],
        ])->assertStatus(201)
            ->assertJsonCount(1, 'data.images')
            ->assertJsonPath('data.images.0.originalName', 'owned.jpg');
    }

    public function test_owner_cannot_book_their_own_facility(): void
    {
        $owner = $this->makeUser();
        $facility = $this->makeStorage([
            'owner_id' => (int) $owner->id,
            'name' => 'Self Chamber '.Str::random(6),
        ]);

        $this->actingAsUser($owner)->postJson('/v1/cold-storage/'.$facility->id.'/bookings', [
            'quantityKg' => 1000,
            'startDate' => $this->inDays(5),
            'endDate' => $this->inDays(35),
        ])->assertStatus(422)
            ->assertJsonPath('errorCode', 'domain_error');
    }

    public function test_booking_request_computes_amount_and_validates_quantity(): void
    {
        $owner = $this->makeUser();
        $renter = $this->makeUser();
        $facility = $this->makeStorage([
            'owner_id' => (int) $owner->id,
            'name' => 'Rent Me '.Str::random(6),
            'capacity_tonnes' => 100.00,
            'rate_per_tonne_month' => 1200.00,
        ]);

        $response = $this->actingAsUser($renter)->postJson('/v1/cold-storage/'.$facility->id.'/bookings', [
            'quantityKg' => 2000,
            'startDate' => $this->inDays(5),
            'endDate' => $this->inDays(34),
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.status', 'requested')
            ->assertJsonPath('data.quantityKg', 2000)
            ->assertJsonPath('data.totalAmount', 2400)
            ->assertJsonPath('data.paymentStatus', 'unpaid')
            ->assertJsonPath('data.paymentMethod', 'cash_on_delivery');

        $this->actingAsUser($renter)->postJson('/v1/cold-storage/'.$facility->id.'/bookings', [
            'quantityKg' => 0,
            'startDate' => $this->inDays(5),
            'endDate' => $this->inDays(35),
        ])->assertStatus(422);

        $this->actingAsUser($renter)->postJson('/v1/cold-storage/'.$facility->id.'/bookings', [
            'quantityKg' => 500,
            'startDate' => $this->inDays(35),
            'endDate' => $this->inDays(5),
        ])->assertStatus(422);
    }

    public function test_overbooking_is_blocked_but_non_overlapping_periods_are_allowed(): void
    {
        $owner = $this->makeUser();
        $renterA = $this->makeUser();
        $renterB = $this->makeUser();
        $facility = $this->makeStorage([
            'owner_id' => (int) $owner->id,
            'name' => 'Capacity Tractor '.Str::random(6),
            'capacity_tonnes' => 10.00,
        ]);

        $this->actingAsUser($renterA)->postJson('/v1/cold-storage/'.$facility->id.'/bookings', [
            'quantityKg' => 8000,
            'startDate' => $this->inDays(5),
            'endDate' => $this->inDays(35),
        ])->assertStatus(201);

        $this->actingAsUser($renterB)->postJson('/v1/cold-storage/'.$facility->id.'/bookings', [
            'quantityKg' => 3000,
            'startDate' => $this->inDays(10),
            'endDate' => $this->inDays(30),
        ])->assertStatus(422)
            ->assertJsonPath('errorCode', 'domain_error');

        $this->actingAsUser($renterB)->postJson('/v1/cold-storage/'.$facility->id.'/bookings', [
            'quantityKg' => 3000,
            'startDate' => $this->inDays(40),
            'endDate' => $this->inDays(70),
        ])->assertStatus(201);
    }

    public function test_approve_reserves_capacity_and_enforces_ownership(): void
    {
        $owner = $this->makeUser();
        $renter = $this->makeUser();
        $facility = $this->makeStorage([
            'owner_id' => (int) $owner->id,
            'name' => 'Approve Chamber '.Str::random(6),
            'capacity_tonnes' => 10.00,
        ]);

        $booking = ColdStorageBooking::create([
            'user_id' => (int) $renter->id,
            'cold_storage_id' => (int) $facility->id,
            'quantity_kg' => 2000.00,
            'start_date' => today()->addDays(5)->toDateString(),
            'end_date' => today()->addDays(35)->toDateString(),
            'total_amount' => 2400.00,
            'status' => 'requested',
            'payment_status' => 'unpaid',
        ]);

        $this->actingAsUser($renter)->postJson('/v1/cold-storage/bookings/'.$booking->id.'/approve')
            ->assertStatus(422)
            ->assertJsonPath('errorCode', 'domain_error');

        $this->actingAsUser($owner)->postJson('/v1/cold-storage/bookings/'.$booking->id.'/approve')
            ->assertOk()
            ->assertJsonPath('data.status', 'approved');

        $this->assertDatabaseHas('cold_storages', [
            'id' => (int) $facility->id,
            'occupied_tonnes' => 2.00,
        ]);

        $this->actingAsUser($owner)->postJson('/v1/cold-storage/bookings/'.$booking->id.'/approve')
            ->assertStatus(422)
            ->assertJsonPath('errorCode', 'domain_error');
    }

    public function test_approve_is_blocked_when_capacity_was_taken_meanwhile(): void
    {
        $owner = $this->makeUser();
        $renterA = $this->makeUser();
        $facility = $this->makeStorage([
            'owner_id' => (int) $owner->id,
            'name' => 'Race Chamber '.Str::random(6),
            'capacity_tonnes' => 5.00,
            'occupied_tonnes' => 3.00,
        ]);

        $first = ColdStorageBooking::create([
            'user_id' => (int) $renterA->id,
            'cold_storage_id' => (int) $facility->id,
            'quantity_kg' => 4000.00,
            'start_date' => today()->addDays(5)->toDateString(),
            'end_date' => today()->addDays(35)->toDateString(),
            'total_amount' => 1200.00,
            'status' => 'requested',
            'payment_status' => 'unpaid',
        ]);

        $this->actingAsUser($owner)->postJson('/v1/cold-storage/bookings/'.$first->id.'/approve')
            ->assertStatus(422)
            ->assertJsonPath('errorCode', 'domain_error');
    }

    public function test_reject_records_reason_and_does_not_reserve(): void
    {
        $owner = $this->makeUser();
        $renter = $this->makeUser();
        $facility = $this->makeStorage([
            'owner_id' => (int) $owner->id,
            'name' => 'Reject Chamber '.Str::random(6),
        ]);

        $booking = ColdStorageBooking::create([
            'user_id' => (int) $renter->id,
            'cold_storage_id' => (int) $facility->id,
            'quantity_kg' => 1000.00,
            'start_date' => today()->addDays(5)->toDateString(),
            'end_date' => today()->addDays(35)->toDateString(),
            'total_amount' => 1000.00,
            'status' => 'requested',
            'payment_status' => 'unpaid',
        ]);

        $this->actingAsUser($owner)->postJson('/v1/cold-storage/bookings/'.$booking->id.'/reject', [
            'reason' => 'Chamber under maintenance',
        ])->assertOk()
            ->assertJsonPath('data.status', 'rejected')
            ->assertJsonPath('data.reason', 'Chamber under maintenance');

        $this->assertDatabaseHas('cold_storages', [
            'id' => (int) $facility->id,
            'occupied_tonnes' => 0.00,
        ]);
    }

    public function test_cancel_releases_reserved_capacity(): void
    {
        $owner = $this->makeUser();
        $renter = $this->makeUser();
        $facility = $this->makeStorage([
            'owner_id' => (int) $owner->id,
            'name' => 'Cancel Chamber '.Str::random(6),
            'capacity_tonnes' => 10.00,
        ]);

        $booking = ColdStorageBooking::create([
            'user_id' => (int) $renter->id,
            'cold_storage_id' => (int) $facility->id,
            'quantity_kg' => 3000.00,
            'start_date' => today()->addDays(5)->toDateString(),
            'end_date' => today()->addDays(35)->toDateString(),
            'total_amount' => 3600.00,
            'status' => 'approved',
            'payment_status' => 'unpaid',
        ]);

        $facility->update(['occupied_tonnes' => 3.00]);

        $this->actingAsUser($renter)->postJson('/v1/cold-storage/bookings/'.$booking->id.'/cancel', [
            'reason' => 'Changed plans',
        ])->assertOk()
            ->assertJsonPath('data.status', 'cancelled')
            ->assertJsonPath('data.reason', 'Changed plans');

        $this->assertDatabaseHas('cold_storages', [
            'id' => (int) $facility->id,
            'occupied_tonnes' => 0.00,
        ]);

        $stranger = $this->makeUser();
        $other = ColdStorageBooking::create([
            'user_id' => (int) $renter->id,
            'cold_storage_id' => (int) $facility->id,
            'quantity_kg' => 1000.00,
            'start_date' => today()->addDays(5)->toDateString(),
            'end_date' => today()->addDays(35)->toDateString(),
            'total_amount' => 1200.00,
            'status' => 'approved',
            'payment_status' => 'unpaid',
        ]);
        $facility->update(['occupied_tonnes' => 1.00]);

        $this->actingAsUser($stranger)->postJson('/v1/cold-storage/bookings/'.$other->id.'/cancel')
            ->assertStatus(422)
            ->assertJsonPath('errorCode', 'domain_error');

        $this->actingAsUser($owner)->postJson('/v1/cold-storage/bookings/'.$other->id.'/cancel')
            ->assertOk()
            ->assertJsonPath('data.status', 'cancelled');
    }

    public function test_complete_flow_releases_capacity_and_records_revenue(): void
    {
        $owner = $this->makeUser();
        $renter = $this->makeUser();
        $facility = $this->makeStorage([
            'owner_id' => (int) $owner->id,
            'name' => 'Complete Chamber '.Str::random(6),
            'capacity_tonnes' => 10.00,
            'rate_per_tonne_month' => 1200.00,
        ]);

        $booking = ColdStorageBooking::create([
            'user_id' => (int) $renter->id,
            'cold_storage_id' => (int) $facility->id,
            'quantity_kg' => 2000.00,
            'start_date' => today()->addDays(5)->toDateString(),
            'end_date' => today()->addDays(35)->toDateString(),
            'total_amount' => 2400.00,
            'status' => 'approved',
            'payment_status' => 'unpaid',
        ]);
        $facility->update(['occupied_tonnes' => 2.00]);

        $this->actingAsUser($renter)->postJson('/v1/cold-storage/bookings/'.$booking->id.'/complete')
            ->assertStatus(422)
            ->assertJsonPath('errorCode', 'domain_error');

        $this->actingAsUser($owner)->postJson('/v1/cold-storage/bookings/'.$booking->id.'/complete')
            ->assertOk()
            ->assertJsonPath('data.status', 'completed');

        $this->assertDatabaseHas('cold_storages', [
            'id' => (int) $facility->id,
            'occupied_tonnes' => 0.00,
        ]);

        $dashboard = $this->actingAsUser($owner)->getJson('/v1/cold-storage/dashboard')->assertOk();
        $this->assertSame(2400, $dashboard->json('data.statistics.revenueSummary.totalRevenue'));
    }

    public function test_delete_is_blocked_while_active_bookings_exist(): void
    {
        $owner = $this->makeUser();
        $renter = $this->makeUser();
        $facility = $this->makeStorage([
            'owner_id' => (int) $owner->id,
            'name' => 'Protected Chamber '.Str::random(6),
        ]);

        ColdStorageBooking::create([
            'user_id' => (int) $renter->id,
            'cold_storage_id' => (int) $facility->id,
            'quantity_kg' => 1000.00,
            'start_date' => today()->addDays(5)->toDateString(),
            'end_date' => today()->addDays(35)->toDateString(),
            'total_amount' => 1200.00,
            'status' => 'requested',
            'payment_status' => 'unpaid',
        ]);

        $this->actingAsUser($owner)->deleteJson('/v1/cold-storage/'.$facility->id)
            ->assertStatus(422)
            ->assertJsonPath('errorCode', 'domain_error');

        $this->assertDatabaseHas('cold_storages', ['id' => (int) $facility->id, 'deleted_at' => null]);
    }

    public function test_renter_history_lists_and_filters_by_status(): void
    {
        $owner = $this->makeUser();
        $renter = $this->makeUser();
        $facility = $this->makeStorage([
            'owner_id' => (int) $owner->id,
            'name' => 'History Chamber '.Str::random(6),
        ]);

        $requested = ColdStorageBooking::create([
            'user_id' => (int) $renter->id,
            'cold_storage_id' => (int) $facility->id,
            'quantity_kg' => 1000.00,
            'start_date' => today()->addDays(5)->toDateString(),
            'end_date' => today()->addDays(35)->toDateString(),
            'total_amount' => 1200.00,
            'status' => 'requested',
            'payment_status' => 'unpaid',
        ]);
        $completed = ColdStorageBooking::create([
            'user_id' => (int) $renter->id,
            'cold_storage_id' => (int) $facility->id,
            'quantity_kg' => 500.00,
            'start_date' => today()->addDays(1)->toDateString(),
            'end_date' => today()->addDays(2)->toDateString(),
            'total_amount' => 600.00,
            'status' => 'completed',
            'payment_status' => 'paid',
            'completed_at' => now(),
        ]);

        $this->actingAsUser($renter)->getJson('/v1/cold-storage/bookings')
            ->assertOk()
            ->assertJsonCount(2, 'data');

        $this->actingAsUser($renter)->getJson('/v1/cold-storage/bookings?status=requested')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', (int) $requested->id);

        $this->actingAsUser($renter)->getJson('/v1/cold-storage/bookings?status=completed')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', (int) $completed->id)
            ->assertJsonPath('data.0.paymentStatus', 'paid');

        $stranger = $this->makeUser();
        $this->actingAsUser($stranger)->getJson('/v1/cold-storage/bookings/'.$requested->id)
            ->assertStatus(404);
    }

    public function test_owner_history_shows_received_bookings(): void
    {
        $owner = $this->makeUser();
        $renterA = $this->makeUser();
        $renterB = $this->makeUser();
        $facility = $this->makeStorage([
            'owner_id' => (int) $owner->id,
            'name' => 'Owner History '.Str::random(6),
        ]);

        ColdStorageBooking::create([
            'user_id' => (int) $renterA->id,
            'cold_storage_id' => (int) $facility->id,
            'quantity_kg' => 1000.00,
            'start_date' => today()->addDays(5)->toDateString(),
            'end_date' => today()->addDays(35)->toDateString(),
            'total_amount' => 1200.00,
            'status' => 'requested',
            'payment_status' => 'unpaid',
        ]);
        $rejected = ColdStorageBooking::create([
            'user_id' => (int) $renterB->id,
            'cold_storage_id' => (int) $facility->id,
            'quantity_kg' => 500.00,
            'start_date' => today()->addDays(3)->toDateString(),
            'end_date' => today()->addDays(33)->toDateString(),
            'total_amount' => 600.00,
            'status' => 'rejected',
            'payment_status' => 'unpaid',
        ]);

        $this->actingAsUser($owner)->getJson('/v1/cold-storage/bookings/owner')
            ->assertOk()
            ->assertJsonCount(2, 'data');

        $this->actingAsUser($owner)->getJson('/v1/cold-storage/bookings/owner?status=rejected')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', (int) $rejected->id);

        $this->actingAsUser($renterA)->getJson('/v1/cold-storage/bookings/owner')
            ->assertOk()
            ->assertJsonCount(0, 'data');
    }

    public function test_dashboard_returns_capacity_and_booking_statistics(): void
    {
        $owner = $this->makeUser();
        $renter = $this->makeUser();
        $facility = $this->makeStorage([
            'owner_id' => (int) $owner->id,
            'name' => 'Dash Chamber '.Str::random(6),
            'capacity_tonnes' => 10.00,
        ]);
        $second = $this->makeStorage([
            'owner_id' => (int) $owner->id,
            'name' => 'Dash Offline '.Str::random(6),
            'capacity_tonnes' => 5.00,
            'is_active' => false,
        ]);

        $facility->update(['occupied_tonnes' => 2.00]);

        ColdStorageBooking::create([
            'user_id' => (int) $renter->id,
            'cold_storage_id' => (int) $facility->id,
            'quantity_kg' => 2000.00,
            'start_date' => today()->addDays(5)->toDateString(),
            'end_date' => today()->addDays(35)->toDateString(),
            'total_amount' => 2400.00,
            'status' => 'approved',
            'payment_status' => 'unpaid',
        ]);

        $response = $this->actingAsUser($owner)->getJson('/v1/cold-storage/dashboard');

        $response->assertOk()
            ->assertJsonPath('data.statistics.totalStorages', 2)
            ->assertJsonPath('data.statistics.capacityTonnes', 15)
            ->assertJsonPath('data.statistics.occupiedTonnes', 2)
            ->assertJsonPath('data.statistics.availableTonnes', 13)
            ->assertJsonPath('data.statistics.activeBookings', 1)
            ->assertJsonPath('data.statistics.bookingStatistics.approved', 1)
            ->assertJsonCount(1, 'data.recentBookings');

        $this->assertSame(13.33, round($response->json('data.statistics.occupancyRate'), 2));

        $renterDashboard = $this->actingAsUser($renter)->getJson('/v1/cold-storage/dashboard')->assertOk();
        $this->assertSame(0, $renterDashboard->json('data.statistics.totalStorages'));
        $this->assertSame(1, $renterDashboard->json('data.statistics.myBookingsCount'));
    }

    public function test_monitoring_endpoint_exposes_telemetry_and_capacity(): void
    {
        $owner = $this->makeUser();
        $facility = $this->makeStorage([
            'owner_id' => (int) $owner->id,
            'name' => 'Monitored Chamber '.Str::random(6),
            'min_temp_c' => -2.00,
            'max_temp_c' => 4.00,
            'humidity_range' => '65-90%',
        ]);

        $this->actingAsUser($owner)->getJson('/v1/cold-storage/'.$facility->id.'/monitoring')
            ->assertOk()
            ->assertJsonPath('data.storageId', (int) $facility->id)
            ->assertJsonPath('data.telemetry.sensorOnline', false)
            ->assertJsonPath('data.configuredRange.minTempC', -2)
            ->assertJsonPath('data.configuredRange.humidityRange', '65-90%')
            ->assertJsonPath('data.capacity.availableTonnes', 100);
    }

    /**
     * @param  array<string, mixed>  $attributes
     */
    private function makeStorage(array $attributes): ColdStorage
    {
        $district = $attributes['district_id'] ?? $this->makeDistrict(
            $this->makeRegion(),
            'DST-'.Str::random(4),
            $this->faker->word().' District',
        );

        return ColdStorage::create([
            'owner_id' => 1,
            'name' => 'Test Chamber '.Str::random(6),
            'description' => 'Test facility.',
            'contact_phone' => null,
            'pincode' => '380001',
            'district_id' => $district instanceof District ? (int) $district->id : (int) $district,
            'taluka_id' => null,
            'village_id' => null,
            'lat' => null,
            'lng' => null,
            'capacity_tonnes' => 100.00,
            'occupied_tonnes' => 0.00,
            'temp_range_c' => '-2 to 4 C',
            'min_temp_c' => -2.00,
            'max_temp_c' => 4.00,
            'humidity_range' => '65-90%',
            'supported_crops' => [],
            'image_file_id' => null,
            'images_json' => [],
            'rate_per_tonne_month' => 1000.00,
            'is_active' => true,
            ...$attributes,
        ]);
    }

    private function makeRegion(): Region
    {
        return Region::create([
            'code' => 'RGN-'.Str::random(6),
            'name' => $this->faker->word().' Region',
            'name_gujarati' => 'પ્રદેશ',
            'is_active' => true,
        ]);
    }

    private function makeDistrict(Region $region, string $code, string $name): District
    {
        return District::create([
            'region_id' => (int) $region->id,
            'code' => $code,
            'name' => $name,
            'name_gujarati' => $name,
            'is_active' => true,
        ]);
    }

    private function makeTaluka(District $district, string $code, string $name): Taluka
    {
        return Taluka::create([
            'district_id' => (int) $district->id,
            'code' => $code,
            'name' => $name,
            'name_gujarati' => $name,
            'default_pincode' => '382210',
        ]);
    }

    private function makeVillage(Taluka $taluka, string $code, string $name): Village
    {
        return Village::create([
            'taluka_id' => (int) $taluka->id,
            'code' => $code,
            'name' => $name,
            'pincode' => '382210',
        ]);
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

    private function inDays(int $days): string
    {
        return Carbon::now()->addDays($days)->format('Y-m-d');
    }
}
