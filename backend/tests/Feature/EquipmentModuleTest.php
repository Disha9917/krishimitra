<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\District;
use App\Models\Equipment;
use App\Models\EquipmentBooking;
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
 * End-to-end tests for the Enterprise Equipment Rental Module (Phase 9H).
 *
 * NOTE: These tests run against the configured Supabase PostgreSQL
 * connection (no RefreshDatabase — the shared database must not be reset).
 * Every record is created with unique identifiers so test runs never clash.
 */
class EquipmentModuleTest extends TestCase
{
    use WithFaker;

    public function test_unauthenticated_requests_are_rejected(): void
    {
        $this->getJson('/v1/equipment')->assertUnauthorized();
        $this->postJson('/v1/equipment', [])->assertUnauthorized();
        $this->getJson('/v1/equipment/dashboard')->assertUnauthorized();
        $this->getJson('/v1/equipment/bookings')->assertUnauthorized();
        $this->getJson('/v1/equipment/bookings/owner')->assertUnauthorized();
        $this->postJson('/v1/equipment/1/bookings', [])->assertUnauthorized();
    }

    public function test_listing_supports_type_category_location_availability_price_rating_and_search_filters(): void
    {
        $user = $this->makeUser();
        $districtA = $this->makeDistrict($this->makeRegion(), 'AHM-'.Str::random(4), 'Ahmedabad');
        $talukaA = $this->makeTaluka($districtA, 'TLK-'.Str::random(4), 'Sanand');
        $villageA = $this->makeVillage($talukaA, 'VLG-'.Str::random(4), 'Jolva');
        $districtB = $this->makeDistrict($this->makeRegion(), 'SUR-'.Str::random(4), 'Surat');

        $tagA = Str::random(6);
        $tagB = Str::random(6);
        $tagC = Str::random(6);

        $a = $this->makeEquipment([
            'provider_id' => (int) $user->id,
            'name' => 'Tractor '.$tagA,
            'brand' => 'Mahindra',
            'equipment_type' => 'tractor',
            'category' => 'tillage',
            'daily_rate' => 2500.00,
            'rating_avg' => 4.5,
            'district_id' => (int) $districtA->id,
            'taluka_id' => (int) $talukaA->id,
            'village_id' => (int) $villageA->id,
        ]);
        $b = $this->makeEquipment([
            'provider_id' => (int) $user->id,
            'name' => 'Harvester '.$tagB,
            'brand' => 'John Deere',
            'equipment_type' => 'harvester',
            'category' => 'harvesting',
            'daily_rate' => 5000.00,
            'rating_avg' => 4.0,
            'district_id' => (int) $districtB->id,
        ]);
        $c = $this->makeEquipment([
            'provider_id' => (int) $user->id,
            'name' => 'Pump '.$tagC,
            'brand' => 'Kirloskar',
            'equipment_type' => 'pump',
            'category' => 'irrigation',
            'daily_rate' => 800.00,
            'rating_avg' => 3.5,
            'is_available' => false,
            'district_id' => (int) $districtA->id,
        ]);

        $list = $this->actingAsUser($user)->getJson('/v1/equipment?limit=100')->assertOk();
        $titles = array_column($list->json('data'), 'name');
        $this->assertContains('Tractor '.$tagA, $titles);
        $this->assertContains('Harvester '.$tagB, $titles);
        $this->assertContains('Pump '.$tagC, $titles);

        $this->actingAsUser($user)->getJson('/v1/equipment?equipmentType=tractor')
            ->assertOk()
            ->assertJsonPath('data.0.name', 'Tractor '.$tagA);

        $this->actingAsUser($user)->getJson('/v1/equipment?category=irrigation')
            ->assertOk()
            ->assertJsonPath('data.0.name', 'Pump '.$tagC);

        $this->actingAsUser($user)->getJson('/v1/equipment?districtId='.$districtA->id)
            ->assertOk()
            ->assertJsonCount(2, 'data');

        $this->actingAsUser($user)->getJson('/v1/equipment?talukaId='.$talukaA->id)
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.name', 'Tractor '.$tagA);

        $this->actingAsUser($user)->getJson('/v1/equipment?villageId='.$villageA->id)
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.name', 'Tractor '.$tagA);

        $this->actingAsUser($user)->getJson('/v1/equipment?availability=1')
            ->assertOk()
            ->assertJsonPath('data.0.name', 'Harvester '.$tagB);

        $this->actingAsUser($user)->getJson('/v1/equipment?minPrice=1000&maxPrice=6000')
            ->assertOk()
            ->assertJsonPath('data.0.name', 'Harvester '.$tagB);

        $this->actingAsUser($user)->getJson('/v1/equipment?minRating=4.0')
            ->assertOk()
            ->assertJsonPath('data.0.name', 'Harvester '.$tagB);

        $this->actingAsUser($user)->getJson('/v1/equipment?ownerId='.$user->id)
            ->assertOk()
            ->assertJsonCount(3, 'data');

        $this->actingAsUser($user)->getJson('/v1/equipment?search='.$tagB)
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.name', 'Harvester '.$tagB);
    }

    public function test_details_returns_404_for_unknown_and_soft_deleted_equipment(): void
    {
        $user = $this->makeUser();
        $active = $this->makeEquipment([
            'provider_id' => (int) $user->id,
            'name' => 'Active Tractor '.Str::random(6),
        ]);
        $deleted = $this->makeEquipment([
            'provider_id' => (int) $user->id,
            'name' => 'Retired Harvester '.Str::random(6),
        ]);
        $deleted->delete();

        $this->actingAsUser($user)->getJson('/v1/equipment/'.$active->id)
            ->assertOk()
            ->assertJsonPath('data.id', (int) $active->id)
            ->assertJsonPath('data.isAvailable', true);

        $this->actingAsUser($user)->getJson('/v1/equipment/'.$deleted->id)
            ->assertStatus(404);

        $this->actingAsUser($user)->getJson('/v1/equipment/999999999')
            ->assertStatus(404);
    }

    public function test_create_validates_price_type_and_location(): void
    {
        $user = $this->makeUser();
        $district = $this->makeDistrict($this->makeRegion(), 'VDR-'.Str::random(4), 'Vadodara');

        $payload = [
            'name' => 'Bad Listing',
            'equipmentType' => 'flying_saucer',
            'category' => 'space',
            'dailyRate' => 0,
            'depositAmount' => -5,
            'pincode' => '12',
            'districtId' => (int) $district->id,
        ];

        $this->actingAsUser($user)->postJson('/v1/equipment', $payload)
            ->assertStatus(422);

        $this->actingAsUser($user)->postJson('/v1/equipment', [
            'name' => 'Good Tractor '.Str::random(6),
            'equipmentType' => 'tractor',
            'category' => 'tillage',
            'dailyRate' => 1500,
            'depositAmount' => 5000,
            'pincode' => '380001',
            'districtId' => (int) $district->id,
        ])->assertStatus(201)
            ->assertJsonPath('data.dailyRate', 1500)
            ->assertJsonPath('data.depositAmount', 5000)
            ->assertJsonPath('data.isAvailable', true);
    }

    public function test_owner_can_update_and_soft_delete_their_listing(): void
    {
        $user = $this->makeUser();
        $listing = $this->makeEquipment([
            'provider_id' => (int) $user->id,
            'name' => 'Update Me '.Str::random(6),
            'daily_rate' => 1200.00,
        ]);

        $this->actingAsUser($user)->putJson('/v1/equipment/'.$listing->id, [
            'dailyRate' => 1800,
            'isAvailable' => false,
        ])->assertOk()
            ->assertJsonPath('data.dailyRate', 1800)
            ->assertJsonPath('data.isAvailable', false);

        $this->actingAsUser($user)->deleteJson('/v1/equipment/'.$listing->id)
            ->assertOk();

        $this->assertSoftDeleted('equipment_listings', ['id' => (int) $listing->id]);

        $this->actingAsUser($user)->getJson('/v1/equipment/'.$listing->id)
            ->assertStatus(404);
    }

    public function test_ownership_is_enforced_on_update_and_delete(): void
    {
        $owner = $this->makeUser();
        $intruder = $this->makeUser();
        $listing = $this->makeEquipment([
            'provider_id' => (int) $owner->id,
            'name' => 'Owned Listing '.Str::random(6),
        ]);

        $this->actingAsUser($intruder)->putJson('/v1/equipment/'.$listing->id, [
            'name' => 'Hijacked',
            'equipmentType' => 'tractor',
            'dailyRate' => 999,
            'pincode' => '380001',
            'districtId' => (int) $listing->district_id,
        ])->assertStatus(422)
            ->assertJsonPath('errorCode', 'domain_error');

        $this->actingAsUser($intruder)->deleteJson('/v1/equipment/'.$listing->id)
            ->assertStatus(422)
            ->assertJsonPath('errorCode', 'domain_error');

        $this->assertDatabaseHas('equipment_listings', ['id' => (int) $listing->id, 'deleted_at' => null]);
    }

    public function test_listing_creation_filters_image_files_to_owner(): void
    {
        $user = $this->makeUser();
        $other = $this->makeUser();
        $district = $this->makeDistrict($this->makeRegion(), 'RJK-'.Str::random(4), 'Rajkot');

        $ownedFile = UploadedFile::create([
            'user_id' => (int) $user->id,
            'disk' => 'local',
            'path' => 'equipment/owned.jpg',
            'original_name' => 'owned.jpg',
            'mime_type' => 'image/jpeg',
            'size_bytes' => 100,
            'visibility' => 'private',
        ]);
        $foreignFile = UploadedFile::create([
            'user_id' => (int) $other->id,
            'disk' => 'local',
            'path' => 'equipment/foreign.jpg',
            'original_name' => 'foreign.jpg',
            'mime_type' => 'image/jpeg',
            'size_bytes' => 100,
            'visibility' => 'private',
        ]);

        $response = $this->actingAsUser($user)->postJson('/v1/equipment', [
            'name' => 'Tractor With Photos '.Str::random(6),
            'equipmentType' => 'tractor',
            'category' => 'tillage',
            'dailyRate' => 2000,
            'pincode' => '360001',
            'districtId' => (int) $district->id,
            'imageFileIds' => [(int) $ownedFile->id, (int) $foreignFile->id],
        ]);

        $response->assertStatus(201)
            ->assertJsonCount(1, 'data.images')
            ->assertJsonPath('data.images.0.originalName', 'owned.jpg');
    }

    public function test_owner_cannot_rent_their_own_equipment(): void
    {
        $owner = $this->makeUser();
        $listing = $this->makeEquipment([
            'provider_id' => (int) $owner->id,
            'name' => 'Self Tractor '.Str::random(6),
        ]);

        $this->actingAsUser($owner)->postJson('/v1/equipment/'.$listing->id.'/bookings', [
            'startAt' => $this->inDays(5),
            'endAt' => $this->inDays(8),
        ])->assertStatus(422)
            ->assertJsonPath('errorCode', 'domain_error');
    }

    public function test_booking_request_creates_booking_with_computed_amount_and_payment_fields(): void
    {
        $owner = $this->makeUser();
        $renter = $this->makeUser();
        $listing = $this->makeEquipment([
            'provider_id' => (int) $owner->id,
            'name' => 'Rent Me '.Str::random(6),
            'daily_rate' => 1000.00,
            'deposit_amount' => 2000.00,
        ]);

        $response = $this->actingAsUser($renter)->postJson('/v1/equipment/'.$listing->id.'/bookings', [
            'startAt' => $this->inDays(5),
            'endAt' => $this->inDays(8),
            'location' => 'Jolva, Sanand',
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.status', 'requested')
            ->assertJsonPath('data.totalAmount', 3000)
            ->assertJsonPath('data.depositAmount', 2000)
            ->assertJsonPath('data.paymentStatus', 'unpaid')
            ->assertJsonPath('data.paymentMethod', 'cash_on_pickup')
            ->assertJsonPath('data.location', 'Jolva, Sanand')
            ->assertJsonPath('data.equipment.name', $listing->name)
            ->assertJsonPath('data.renter.id', (int) $renter->id);
    }

    public function test_overlapping_booking_requests_are_blocked(): void
    {
        $owner = $this->makeUser();
        $renterA = $this->makeUser();
        $renterB = $this->makeUser();
        $listing = $this->makeEquipment([
            'provider_id' => (int) $owner->id,
            'name' => 'Busy Tractor '.Str::random(6),
            'daily_rate' => 1000.00,
        ]);

        $this->actingAsUser($renterA)->postJson('/v1/equipment/'.$listing->id.'/bookings', [
            'startAt' => $this->inDays(5),
            'endAt' => $this->inDays(8),
        ])->assertStatus(201);

        $this->actingAsUser($renterB)->postJson('/v1/equipment/'.$listing->id.'/bookings', [
            'startAt' => $this->inDays(7),
            'endAt' => $this->inDays(10),
        ])->assertStatus(422)
            ->assertJsonPath('errorCode', 'domain_error');
    }

    public function test_non_overlapping_bookings_are_allowed(): void
    {
        $owner = $this->makeUser();
        $renterA = $this->makeUser();
        $renterB = $this->makeUser();
        $listing = $this->makeEquipment([
            'provider_id' => (int) $owner->id,
            'name' => 'Free Tractor '.Str::random(6),
        ]);

        $this->actingAsUser($renterA)->postJson('/v1/equipment/'.$listing->id.'/bookings', [
            'startAt' => $this->inDays(5),
            'endAt' => $this->inDays(8),
        ])->assertStatus(201);

        $this->actingAsUser($renterB)->postJson('/v1/equipment/'.$listing->id.'/bookings', [
            'startAt' => $this->inDays(9),
            'endAt' => $this->inDays(11),
        ])->assertStatus(201);
    }

    public function test_unavailable_equipment_cannot_be_booked(): void
    {
        $owner = $this->makeUser();
        $renter = $this->makeUser();
        $listing = $this->makeEquipment([
            'provider_id' => (int) $owner->id,
            'name' => 'Offline Tractor '.Str::random(6),
            'is_available' => false,
        ]);

        $this->actingAsUser($renter)->postJson('/v1/equipment/'.$listing->id.'/bookings', [
            'startAt' => $this->inDays(5),
            'endAt' => $this->inDays(8),
        ])->assertStatus(422)
            ->assertJsonPath('errorCode', 'domain_error');
    }

    public function test_booking_dates_are_validated(): void
    {
        $owner = $this->makeUser();
        $renter = $this->makeUser();
        $listing = $this->makeEquipment([
            'provider_id' => (int) $owner->id,
            'name' => 'Date Tractor '.Str::random(6),
        ]);

        $this->actingAsUser($renter)->postJson('/v1/equipment/'.$listing->id.'/bookings', [
            'startAt' => $this->inDays(8),
            'endAt' => $this->inDays(5),
        ])->assertStatus(422);

        $this->actingAsUser($renter)->postJson('/v1/equipment/'.$listing->id.'/bookings', [
            'startAt' => $this->inDays(-2),
            'endAt' => $this->inDays(2),
        ])->assertStatus(422)
            ->assertJsonPath('errorCode', 'domain_error');
    }

    public function test_accept_flow_flips_availability_and_enforces_ownership(): void
    {
        $owner = $this->makeUser();
        $renter = $this->makeUser();
        $listing = $this->makeEquipment([
            'provider_id' => (int) $owner->id,
            'name' => 'Accept Tractor '.Str::random(6),
        ]);

        $booking = EquipmentBooking::create([
            'user_id' => (int) $renter->id,
            'equipment_id' => (int) $listing->id,
            'start_at' => now()->addDays(5),
            'end_at' => now()->addDays(8),
            'total_amount' => 3000.00,
            'status' => 'requested',
            'payment_status' => 'unpaid',
        ]);

        $this->actingAsUser($renter)->postJson('/v1/equipment/bookings/'.$booking->id.'/accept')
            ->assertStatus(422)
            ->assertJsonPath('errorCode', 'domain_error');

        $this->actingAsUser($owner)->postJson('/v1/equipment/bookings/'.$booking->id.'/accept')
            ->assertOk()
            ->assertJsonPath('data.status', 'accepted');

        $this->assertDatabaseHas('equipment_listings', [
            'id' => (int) $listing->id,
            'is_available' => false,
        ]);

        $this->actingAsUser($owner)->postJson('/v1/equipment/bookings/'.$booking->id.'/accept')
            ->assertStatus(422)
            ->assertJsonPath('errorCode', 'domain_error');
    }

    public function test_reject_flow_records_reason_and_keeps_availability(): void
    {
        $owner = $this->makeUser();
        $renter = $this->makeUser();
        $listing = $this->makeEquipment([
            'provider_id' => (int) $owner->id,
            'name' => 'Reject Tractor '.Str::random(6),
        ]);

        $booking = EquipmentBooking::create([
            'user_id' => (int) $renter->id,
            'equipment_id' => (int) $listing->id,
            'start_at' => now()->addDays(5),
            'end_at' => now()->addDays(8),
            'total_amount' => 3000.00,
            'status' => 'requested',
            'payment_status' => 'unpaid',
        ]);

        $this->actingAsUser($owner)->postJson('/v1/equipment/bookings/'.$booking->id.'/reject', [
            'reason' => 'Machine under maintenance',
        ])->assertOk()
            ->assertJsonPath('data.status', 'rejected')
            ->assertJsonPath('data.reason', 'Machine under maintenance');

        $this->assertDatabaseHas('equipment_listings', [
            'id' => (int) $listing->id,
            'is_available' => true,
        ]);
    }

    public function test_cancel_flow_is_open_to_renter_and_owner(): void
    {
        $owner = $this->makeUser();
        $renter = $this->makeUser();
        $listing = $this->makeEquipment([
            'provider_id' => (int) $owner->id,
            'name' => 'Cancel Tractor '.Str::random(6),
        ]);

        $booking = EquipmentBooking::create([
            'user_id' => (int) $renter->id,
            'equipment_id' => (int) $listing->id,
            'start_at' => now()->addDays(5),
            'end_at' => now()->addDays(8),
            'total_amount' => 3000.00,
            'status' => 'requested',
            'payment_status' => 'unpaid',
        ]);

        $this->actingAsUser($renter)->postJson('/v1/equipment/bookings/'.$booking->id.'/cancel', [
            'reason' => 'Changed plans',
        ])->assertOk()
            ->assertJsonPath('data.status', 'cancelled')
            ->assertJsonPath('data.reason', 'Changed plans');

        $stranger = $this->makeUser();
        $other = EquipmentBooking::create([
            'user_id' => (int) $renter->id,
            'equipment_id' => (int) $listing->id,
            'start_at' => now()->addDays(5),
            'end_at' => now()->addDays(8),
            'total_amount' => 3000.00,
            'status' => 'accepted',
            'payment_status' => 'unpaid',
        ]);

        $this->actingAsUser($stranger)->postJson('/v1/equipment/bookings/'.$other->id.'/cancel')
            ->assertStatus(422)
            ->assertJsonPath('errorCode', 'domain_error');

        $this->actingAsUser($owner)->postJson('/v1/equipment/bookings/'.$other->id.'/cancel')
            ->assertOk()
            ->assertJsonPath('data.status', 'cancelled');
    }

    public function test_complete_flow_restores_availability_and_records_earnings(): void
    {
        $owner = $this->makeUser();
        $renter = $this->makeUser();
        $listing = $this->makeEquipment([
            'provider_id' => (int) $owner->id,
            'name' => 'Complete Tractor '.Str::random(6),
            'daily_rate' => 1000.00,
            'deposit_amount' => 2000.00,
        ]);

        $booking = EquipmentBooking::create([
            'user_id' => (int) $renter->id,
            'equipment_id' => (int) $listing->id,
            'start_at' => now()->addDays(5),
            'end_at' => now()->addDays(8),
            'total_amount' => 3000.00,
            'deposit_amount' => 2000.00,
            'status' => 'accepted',
            'payment_status' => 'unpaid',
        ]);

        $this->actingAsUser($renter)->postJson('/v1/equipment/bookings/'.$booking->id.'/complete')
            ->assertStatus(422)
            ->assertJsonPath('errorCode', 'domain_error');

        $this->actingAsUser($owner)->postJson('/v1/equipment/bookings/'.$booking->id.'/complete')
            ->assertOk()
            ->assertJsonPath('data.status', 'completed');

        $this->assertDatabaseHas('equipment_listings', [
            'id' => (int) $listing->id,
            'is_available' => true,
        ]);

        $dashboard = $this->actingAsUser($owner)->getJson('/v1/equipment/dashboard')->assertOk();
        $this->assertSame(3000, $dashboard->json('data.statistics.earningsSummary.totalEarnings'));
        $this->assertSame(2000, $dashboard->json('data.statistics.earningsSummary.depositsHeld'));
    }

    public function test_delete_is_blocked_while_active_bookings_exist(): void
    {
        $owner = $this->makeUser();
        $renter = $this->makeUser();
        $listing = $this->makeEquipment([
            'provider_id' => (int) $owner->id,
            'name' => 'Protected Tractor '.Str::random(6),
        ]);

        EquipmentBooking::create([
            'user_id' => (int) $renter->id,
            'equipment_id' => (int) $listing->id,
            'start_at' => now()->addDays(5),
            'end_at' => now()->addDays(8),
            'total_amount' => 3000.00,
            'status' => 'requested',
            'payment_status' => 'unpaid',
        ]);

        $this->actingAsUser($owner)->deleteJson('/v1/equipment/'.$listing->id)
            ->assertStatus(422)
            ->assertJsonPath('errorCode', 'domain_error');

        $this->assertDatabaseHas('equipment_listings', ['id' => (int) $listing->id, 'deleted_at' => null]);
    }

    public function test_renter_history_lists_and_filters_by_status(): void
    {
        $owner = $this->makeUser();
        $renter = $this->makeUser();
        $listing = $this->makeEquipment([
            'provider_id' => (int) $owner->id,
            'name' => 'History Tractor '.Str::random(6),
        ]);

        $requested = EquipmentBooking::create([
            'user_id' => (int) $renter->id,
            'equipment_id' => (int) $listing->id,
            'start_at' => now()->addDays(5),
            'end_at' => now()->addDays(8),
            'total_amount' => 3000.00,
            'status' => 'requested',
            'payment_status' => 'unpaid',
        ]);
        $completed = EquipmentBooking::create([
            'user_id' => (int) $renter->id,
            'equipment_id' => (int) $listing->id,
            'start_at' => now()->addDays(1),
            'end_at' => now()->addDays(2),
            'total_amount' => 1000.00,
            'status' => 'completed',
            'payment_status' => 'paid',
            'completed_at' => now(),
        ]);

        $this->actingAsUser($renter)->getJson('/v1/equipment/bookings')
            ->assertOk()
            ->assertJsonCount(2, 'data');

        $this->actingAsUser($renter)->getJson('/v1/equipment/bookings?status=requested')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', (int) $requested->id);

        $this->actingAsUser($renter)->getJson('/v1/equipment/bookings?status=completed')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', (int) $completed->id)
            ->assertJsonPath('data.0.paymentStatus', 'paid');

        $stranger = $this->makeUser();
        $this->actingAsUser($stranger)->getJson('/v1/equipment/bookings/'.$requested->id)
            ->assertStatus(404);
    }

    public function test_owner_history_shows_received_bookings(): void
    {
        $owner = $this->makeUser();
        $renterA = $this->makeUser();
        $renterB = $this->makeUser();
        $listing = $this->makeEquipment([
            'provider_id' => (int) $owner->id,
            'name' => 'Owner History '.Str::random(6),
        ]);

        EquipmentBooking::create([
            'user_id' => (int) $renterA->id,
            'equipment_id' => (int) $listing->id,
            'start_at' => now()->addDays(5),
            'end_at' => now()->addDays(8),
            'total_amount' => 3000.00,
            'status' => 'requested',
            'payment_status' => 'unpaid',
        ]);
        $rejected = EquipmentBooking::create([
            'user_id' => (int) $renterB->id,
            'equipment_id' => (int) $listing->id,
            'start_at' => now()->addDays(3),
            'end_at' => now()->addDays(4),
            'total_amount' => 1000.00,
            'status' => 'rejected',
            'payment_status' => 'unpaid',
        ]);

        $this->actingAsUser($owner)->getJson('/v1/equipment/bookings/owner')
            ->assertOk()
            ->assertJsonCount(2, 'data');

        $this->actingAsUser($owner)->getJson('/v1/equipment/bookings/owner?status=rejected')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', (int) $rejected->id);

        $this->actingAsUser($renterA)->getJson('/v1/equipment/bookings/owner')
            ->assertOk()
            ->assertJsonCount(0, 'data');
    }

    public function test_dashboard_returns_equipment_and_booking_statistics(): void
    {
        $owner = $this->makeUser();
        $renter = $this->makeUser();
        $listing = $this->makeEquipment([
            'provider_id' => (int) $owner->id,
            'name' => 'Dash Tractor '.Str::random(6),
            'daily_rate' => 1000.00,
        ]);
        $offline = $this->makeEquipment([
            'provider_id' => (int) $owner->id,
            'name' => 'Dash Offline '.Str::random(6),
            'is_available' => false,
        ]);

        EquipmentBooking::create([
            'user_id' => (int) $renter->id,
            'equipment_id' => (int) $listing->id,
            'start_at' => now()->addDays(5),
            'end_at' => now()->addDays(8),
            'total_amount' => 3000.00,
            'status' => 'requested',
            'payment_status' => 'unpaid',
        ]);

        $response = $this->actingAsUser($owner)->getJson('/v1/equipment/dashboard');

        $response->assertOk()
            ->assertJsonPath('data.statistics.totalEquipment', 2)
            ->assertJsonPath('data.statistics.availableEquipment', 1)
            ->assertJsonPath('data.statistics.activeRentals', 1)
            ->assertJsonPath('data.statistics.pendingRequests', 1)
            ->assertJsonPath('data.statistics.bookingStatistics.requested', 1)
            ->assertJsonPath('data.statistics.myBookingsCount', 0)
            ->assertJsonCount(1, 'data.recentBookings')
            ->assertJsonPath('data.recentBookings.0.status', 'requested');

        $renterDashboard = $this->actingAsUser($renter)->getJson('/v1/equipment/dashboard')->assertOk();
        $this->assertSame(0, $renterDashboard->json('data.statistics.totalEquipment'));
        $this->assertSame(1, $renterDashboard->json('data.statistics.myBookingsCount'));
    }

    /**
     * @param  array<string, mixed>  $attributes
     */
    private function makeEquipment(array $attributes): Equipment
    {
        $district = $attributes['district_id'] ?? $this->makeDistrict(
            $this->makeRegion(),
            'DST-'.Str::random(4),
            $this->faker->word().' District',
        );

        return Equipment::create([
            'provider_id' => 1,
            'name' => 'Test Equipment '.Str::random(6),
            'equipment_type' => 'tractor',
            'category' => 'tillage',
            'description' => 'Test equipment listing.',
            'hourly_rate' => null,
            'daily_rate' => 1000.00,
            'deposit_amount' => 2000.00,
            'pincode' => '380001',
            'district_id' => $district instanceof District ? (int) $district->id : (int) $district,
            'taluka_id' => null,
            'village_id' => null,
            'lat' => null,
            'lng' => null,
            'is_available' => true,
            'image_file_id' => null,
            'images_json' => [],
            'rating_avg' => null,
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
        return Carbon::now()->addDays($days)->format('Y-m-d H:i:s');
    }
}
