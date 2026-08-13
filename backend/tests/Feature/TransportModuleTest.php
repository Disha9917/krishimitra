<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\District;
use App\Models\Region;
use App\Models\Taluka;
use App\Models\TransportBooking;
use App\Models\TransportVehicleType;
use App\Models\UploadedFile;
use App\Models\User;
use App\Models\Vehicle;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Tests\TestCase;

class TransportModuleTest extends TestCase
{
    use WithFaker;

    public function test_unauthenticated_requests_are_rejected(): void
    {
        $this->getJson('/v1/transport')->assertUnauthorized();
        $this->postJson('/v1/transport', [])->assertUnauthorized();
        $this->getJson('/v1/transport/dashboard')->assertUnauthorized();
        $this->getJson('/v1/transport/bookings')->assertUnauthorized();
        $this->getJson('/v1/transport/bookings/owner')->assertUnauthorized();
        $this->postJson('/v1/transport/1/bookings', [])->assertUnauthorized();
        $this->postJson('/v1/transport/cost-estimate', [])->assertUnauthorized();
        $this->getJson('/v1/transport/route-estimate')->assertUnauthorized();
    }

    public function test_listing_supports_location_vehicle_type_capacity_availability_and_price_filters(): void
    {
        $user = $this->makeUser();
        $region = $this->makeRegion();
        $districtA = $this->makeDistrict($region, 'SRT-'.Str::random(4), 'Surat');
        $districtB = $this->makeDistrict($region, 'AMD-'.Str::random(4), 'Ahmedabad');
        $talukaA = $this->makeTaluka($districtA, 'KAM-'.Str::random(4), 'Kamrej');
        $talukaB = $this->makeTaluka($districtB, 'BVM-'.Str::random(4), 'Bavla');

        $typeA = $this->makeVehicleType('TRK-'.Str::random(6), 'Truck', 1000, 6000, 2.5, 40);
        $typeB = $this->makeVehicleType('MIN-'.Str::random(6), 'Mini Truck', 2000, 10000, 1.8, 35);

        $tagA = Str::random(6);
        $tagB = Str::random(6);
        $tagC = Str::random(6);

        $this->makeVehicle([
            'owner_id' => (int) $user->id,
            'vehicle_type_id' => (int) $typeA->id,
            'name' => 'Truck A '.$tagA,
            'capacity_kg' => 4000.00,
            'price_per_km' => 20.00,
            'is_available' => true,
            'district_id' => (int) $districtA->id,
            'taluka_id' => (int) $talukaA->id,
        ]);
        $this->makeVehicle([
            'owner_id' => (int) $user->id,
            'vehicle_type_id' => (int) $typeB->id,
            'name' => 'Truck B '.$tagB,
            'capacity_kg' => 8000.00,
            'price_per_km' => 30.00,
            'is_available' => false,
            'district_id' => (int) $districtB->id,
            'taluka_id' => (int) $talukaB->id,
        ]);
        $this->makeVehicle([
            'owner_id' => (int) $user->id,
            'vehicle_type_id' => (int) $typeB->id,
            'name' => 'Truck C '.$tagC,
            'capacity_kg' => 2000.00,
            'price_per_km' => 50.00,
            'is_available' => true,
            'district_id' => (int) $districtA->id,
        ]);

        $list = $this->actingAsUser($user)->getJson('/v1/transport?limit=100')->assertOk();
        $names = array_column($list->json('data'), 'name');
        $this->assertContains('Truck A '.$tagA, $names);
        $this->assertContains('Truck B '.$tagB, $names);
        $this->assertContains('Truck C '.$tagC, $names);

        $this->actingAsUser($user)->getJson('/v1/transport?districtId='.$districtA->id)
            ->assertOk()
            ->assertJsonCount(2, 'data');

        $this->actingAsUser($user)->getJson('/v1/transport?talukaId='.$talukaA->id)
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.name', 'Truck A '.$tagA);

        $this->actingAsUser($user)->getJson('/v1/transport?vehicleTypeId='.$typeA->id)
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.name', 'Truck A '.$tagA);

        $this->actingAsUser($user)->getJson('/v1/transport?minCapacityKg=5000')
            ->assertOk()
            ->assertJsonPath('data.0.name', 'Truck B '.$tagB);

        $this->actingAsUser($user)->getJson('/v1/transport?maxCapacityKg=5000')
            ->assertOk()
            ->assertJsonPath('data.0.name', 'Truck C '.$tagC);

        $this->actingAsUser($user)->getJson('/v1/transport?isAvailable=0')
            ->assertOk()
            ->assertJsonPath('data.0.name', 'Truck B '.$tagB);

        $this->actingAsUser($user)->getJson('/v1/transport?minPrice=25&maxPrice=40')
            ->assertOk()
            ->assertJsonPath('data.0.name', 'Truck B '.$tagB);

        $this->actingAsUser($user)->getJson('/v1/transport?search='.$tagC)
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.name', 'Truck C '.$tagC);
    }

    public function test_details_returns_404_for_unknown_and_soft_deleted_vehicles(): void
    {
        $user = $this->makeUser();
        $type = $this->makeVehicleType('TRK-'.Str::random(6), 'Truck', 1000, 6000, 2.5, 40);
        $active = $this->makeVehicle([
            'owner_id' => (int) $user->id,
            'vehicle_type_id' => (int) $type->id,
            'name' => 'Active Truck '.Str::random(6),
        ]);
        $deleted = $this->makeVehicle([
            'owner_id' => (int) $user->id,
            'vehicle_type_id' => (int) $type->id,
            'name' => 'Deleted Truck '.Str::random(6),
        ]);
        $deleted->delete();

        $this->actingAsUser($user)->getJson('/v1/transport/'.$active->id)
            ->assertOk()
            ->assertJsonPath('data.name', $active->name);

        $this->actingAsUser($user)->getJson('/v1/transport/'.$deleted->id)
            ->assertStatus(404)
            ->assertJsonPath('errorCode', 'vehicle_not_found');

        $this->actingAsUser($user)->getJson('/v1/transport/999999999')
            ->assertStatus(404)
            ->assertJsonPath('errorCode', 'vehicle_not_found');
    }

    public function test_create_validates_capacity_price_and_vehicle_type(): void
    {
        $user = $this->makeUser();
        $district = $this->makeDistrict($this->makeRegion(), 'RJK-'.Str::random(4), 'Rajkot');

        $this->actingAsUser($user)->postJson('/v1/transport', [
            'name' => 'No Type '.Str::random(6),
            'capacityKg' => 4000,
            'pricePerKm' => 20,
            'districtId' => (int) $district->id,
        ])->assertStatus(422);

        $type = $this->makeVehicleType('TRK-'.Str::random(6), 'Truck', 1000, 6000, 2.5, 40);

        $this->actingAsUser($user)->postJson('/v1/transport', [
            'vehicleTypeId' => (int) $type->id,
            'name' => 'Zero Capacity '.Str::random(6),
            'capacityKg' => 0,
            'pricePerKm' => 20,
        ])->assertStatus(422);

        $this->actingAsUser($user)->postJson('/v1/transport', [
            'vehicleTypeId' => (int) $type->id,
            'name' => 'No Price '.Str::random(6),
            'capacityKg' => 4000,
        ])->assertStatus(422);

        $this->actingAsUser($user)->postJson('/v1/transport', [
            'vehicleTypeId' => (int) $type->id,
            'name' => 'Valid Truck '.Str::random(6),
            'capacityKg' => 4000,
            'pricePerKm' => 20,
            'districtId' => (int) $district->id,
        ])->assertStatus(201)
            ->assertJsonPath('data.capacityKg', 4000)
            ->assertJsonPath('data.pricePerKm', 20)
            ->assertJsonPath('data.isAvailable', true);
    }

    public function test_owner_can_update_and_soft_delete_their_vehicle(): void
    {
        $user = $this->makeUser();
        $type = $this->makeVehicleType('TRK-'.Str::random(6), 'Truck', 1000, 6000, 2.5, 40);
        $vehicle = $this->makeVehicle([
            'owner_id' => (int) $user->id,
            'vehicle_type_id' => (int) $type->id,
            'name' => 'Update Me '.Str::random(6),
        ]);

        $this->actingAsUser($user)->putJson('/v1/transport/'.$vehicle->id, [
            'pricePerKm' => 28,
            'isAvailable' => false,
        ])->assertOk()
            ->assertJsonPath('data.pricePerKm', 28)
            ->assertJsonPath('data.isAvailable', false);

        $this->actingAsUser($user)->deleteJson('/v1/transport/'.$vehicle->id)
            ->assertOk();

        $this->actingAsUser($user)->getJson('/v1/transport/'.$vehicle->id)
            ->assertStatus(404);
    }

    public function test_ownership_is_enforced_on_update_and_delete(): void
    {
        $owner = $this->makeUser();
        $intruder = $this->makeUser();
        $type = $this->makeVehicleType('TRK-'.Str::random(6), 'Truck', 1000, 6000, 2.5, 40);
        $vehicle = $this->makeVehicle([
            'owner_id' => (int) $owner->id,
            'vehicle_type_id' => (int) $type->id,
            'name' => 'Mine Only '.Str::random(6),
        ]);

        $this->actingAsUser($intruder)->putJson('/v1/transport/'.$vehicle->id, [
            'pricePerKm' => 99,
        ])->assertStatus(422)
            ->assertJsonPath('errorCode', 'domain_error');

        $this->actingAsUser($intruder)->deleteJson('/v1/transport/'.$vehicle->id)
            ->assertStatus(422)
            ->assertJsonPath('errorCode', 'domain_error');

        $this->actingAsUser($owner)->deleteJson('/v1/transport/'.$vehicle->id)
            ->assertOk();
    }

    public function test_vehicle_creation_filters_image_files_to_owner(): void
    {
        $user = $this->makeUser();
        $other = $this->makeUser();
        $type = $this->makeVehicleType('TRK-'.Str::random(6), 'Truck', 1000, 6000, 2.5, 40);
        $district = $this->makeDistrict($this->makeRegion(), 'BHV-'.Str::random(4), 'Bhavnagar');

        $ownedFile = UploadedFile::create([
            'user_id' => (int) $user->id,
            'disk' => 'local',
            'path' => 'transport/owned.jpg',
            'original_name' => 'owned.jpg',
            'mime_type' => 'image/jpeg',
            'size_bytes' => 100,
            'visibility' => 'private',
        ]);
        $foreignFile = UploadedFile::create([
            'user_id' => (int) $other->id,
            'disk' => 'local',
            'path' => 'transport/foreign.jpg',
            'original_name' => 'foreign.jpg',
            'mime_type' => 'image/jpeg',
            'size_bytes' => 100,
            'visibility' => 'private',
        ]);

        $response = $this->actingAsUser($user)->postJson('/v1/transport', [
            'vehicleTypeId' => (int) $type->id,
            'name' => 'Truck With Photos '.Str::random(6),
            'capacityKg' => 4000,
            'pricePerKm' => 20,
            'districtId' => (int) $district->id,
            'imageFileIds' => [(int) $ownedFile->id, (int) $foreignFile->id],
        ]);

        $response->assertStatus(201)
            ->assertJsonCount(1, 'data.images')
            ->assertJsonPath('data.images.0.originalName', 'owned.jpg');
    }

    public function test_owner_cannot_book_their_own_vehicle(): void
    {
        $owner = $this->makeUser();
        $type = $this->makeVehicleType('TRK-'.Str::random(6), 'Truck', 1000, 6000, 2.5, 40);
        $vehicle = $this->makeVehicle([
            'owner_id' => (int) $owner->id,
            'vehicle_type_id' => (int) $type->id,
            'name' => 'Self Truck '.Str::random(6),
        ]);

        $this->actingAsUser($owner)->postJson('/v1/transport/'.$vehicle->id.'/bookings', [
            'quantityKg' => 1000,
            'distanceKm' => 50,
            'pickupAt' => $this->atTime(2, '10:00'),
            'dropoffAt' => $this->atTime(2, '14:00'),
        ])->assertStatus(422)
            ->assertJsonPath('errorCode', 'domain_error');
    }

    public function test_booking_request_computes_cost_and_validates_quantity_and_dates(): void
    {
        $owner = $this->makeUser();
        $renter = $this->makeUser();
        $type = $this->makeVehicleType('TRK-'.Str::random(6), 'Truck', 1000, 6000, 2.5, 40);
        $vehicle = $this->makeVehicle([
            'owner_id' => (int) $owner->id,
            'vehicle_type_id' => (int) $type->id,
            'name' => 'Book Me '.Str::random(6),
            'capacity_kg' => 4000.00,
            'price_per_km' => 20.00,
            'loading_charges' => 500.00,
        ]);

        $this->actingAsUser($renter)->postJson('/v1/transport/'.$vehicle->id.'/bookings', [
            'quantityKg' => 5000,
            'distanceKm' => 100,
            'pickupAt' => $this->atTime(2, '10:00'),
            'dropoffAt' => $this->atTime(2, '14:00'),
        ])->assertStatus(422)
            ->assertJsonPath('errorCode', 'domain_error');

        $this->actingAsUser($renter)->postJson('/v1/transport/'.$vehicle->id.'/bookings', [
            'quantityKg' => 2000,
            'distanceKm' => 100,
            'pickupAt' => $this->atTime(2, '18:00'),
            'dropoffAt' => $this->atTime(2, '10:00'),
        ])->assertStatus(422);

        $response = $this->actingAsUser($renter)->postJson('/v1/transport/'.$vehicle->id.'/bookings', [
            'quantityKg' => 2000,
            'distanceKm' => 100,
            'pickupLocation' => 'Kamrej APMC',
            'dropoffLocation' => 'Ahmedabad APMC',
            'pickupAt' => $this->atTime(2, '10:00'),
            'dropoffAt' => $this->atTime(2, '18:00'),
            'loadingCharges' => 500,
            'tollCharges' => 200,
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.status', 'requested')
            ->assertJsonPath('data.paymentStatus', 'unpaid')
            ->assertJsonPath('data.distanceKm', 100)
            ->assertJsonPath('data.costBreakdown.baseCost', 2000)
            ->assertJsonPath('data.costBreakdown.loadingCharges', 500)
            ->assertJsonPath('data.costBreakdown.tollCharges', 200)
            ->assertJsonPath('data.costBreakdown.fuelCharges', 1350)
            ->assertJsonPath('data.totalAmount', 4050);
    }

    public function test_overlapping_bookings_are_blocked_but_non_overlapping_are_allowed(): void
    {
        $owner = $this->makeUser();
        $renterA = $this->makeUser();
        $renterB = $this->makeUser();
        $type = $this->makeVehicleType('TRK-'.Str::random(6), 'Truck', 1000, 6000, 2.5, 40);
        $vehicle = $this->makeVehicle([
            'owner_id' => (int) $owner->id,
            'vehicle_type_id' => (int) $type->id,
            'name' => 'Busy Truck '.Str::random(6),
        ]);

        $this->actingAsUser($renterA)->postJson('/v1/transport/'.$vehicle->id.'/bookings', [
            'quantityKg' => 1000,
            'distanceKm' => 60,
            'pickupAt' => $this->atTime(3, '08:00'),
            'dropoffAt' => $this->atTime(3, '14:00'),
        ])->assertStatus(201);

        $this->actingAsUser($renterB)->postJson('/v1/transport/'.$vehicle->id.'/bookings', [
            'quantityKg' => 1000,
            'distanceKm' => 60,
            'pickupAt' => $this->atTime(3, '10:00'),
            'dropoffAt' => $this->atTime(3, '16:00'),
        ])->assertStatus(422)
            ->assertJsonPath('errorCode', 'domain_error');

        $this->actingAsUser($renterB)->postJson('/v1/transport/'.$vehicle->id.'/bookings', [
            'quantityKg' => 1000,
            'distanceKm' => 60,
            'pickupAt' => $this->atTime(3, '15:00'),
            'dropoffAt' => $this->atTime(3, '20:00'),
        ])->assertStatus(201);

        $this->actingAsUser($renterB)->postJson('/v1/transport/'.$vehicle->id.'/bookings', [
            'quantityKg' => 1000,
            'distanceKm' => 60,
            'pickupAt' => $this->atTime(4, '08:00'),
            'dropoffAt' => $this->atTime(4, '14:00'),
        ])->assertStatus(201);
    }

    public function test_approve_enforces_ownership_and_reserves_the_window(): void
    {
        $owner = $this->makeUser();
        $renter = $this->makeUser();
        $stranger = $this->makeUser();
        $type = $this->makeVehicleType('TRK-'.Str::random(6), 'Truck', 1000, 6000, 2.5, 40);
        $vehicle = $this->makeVehicle([
            'owner_id' => (int) $owner->id,
            'vehicle_type_id' => (int) $type->id,
            'name' => 'Approve Me '.Str::random(6),
        ]);

        $booking = $this->makeBooking([
            'user_id' => (int) $renter->id,
            'vehicle_id' => (int) $vehicle->id,
            'vehicle_type_id' => (int) $type->id,
            'pickup_at' => $this->atTime(2, '09:00'),
            'dropoff_at' => $this->atTime(2, '13:00'),
        ]);

        $this->actingAsUser($stranger)->postJson('/v1/transport/bookings/'.$booking->id.'/approve')
            ->assertStatus(422)
            ->assertJsonPath('errorCode', 'domain_error');

        $this->actingAsUser($renter)->postJson('/v1/transport/bookings/'.$booking->id.'/approve')
            ->assertStatus(422)
            ->assertJsonPath('errorCode', 'domain_error');

        $this->actingAsUser($owner)->postJson('/v1/transport/bookings/'.$booking->id.'/approve')
            ->assertOk()
            ->assertJsonPath('data.status', 'approved')
            ->assertJsonPath('data.totalAmount', 2010);
    }

    public function test_approve_is_blocked_when_the_window_was_taken_meanwhile(): void
    {
        $owner = $this->makeUser();
        $renterA = $this->makeUser();
        $renterB = $this->makeUser();
        $type = $this->makeVehicleType('TRK-'.Str::random(6), 'Truck', 1000, 6000, 2.5, 40);
        $vehicle = $this->makeVehicle([
            'owner_id' => (int) $owner->id,
            'vehicle_type_id' => (int) $type->id,
            'name' => 'Race Truck '.Str::random(6),
        ]);

        $first = $this->makeBooking([
            'user_id' => (int) $renterA->id,
            'vehicle_id' => (int) $vehicle->id,
            'vehicle_type_id' => (int) $type->id,
            'pickup_at' => $this->atTime(2, '09:00'),
            'dropoff_at' => $this->atTime(2, '13:00'),
        ]);
        $taken = $this->makeBooking([
            'user_id' => (int) $renterB->id,
            'vehicle_id' => (int) $vehicle->id,
            'vehicle_type_id' => (int) $type->id,
            'status' => 'approved',
            'pickup_at' => $this->atTime(2, '10:00'),
            'dropoff_at' => $this->atTime(2, '16:00'),
        ]);

        $this->actingAsUser($owner)->postJson('/v1/transport/bookings/'.$first->id.'/approve')
            ->assertStatus(422)
            ->assertJsonPath('errorCode', 'domain_error');
    }

    public function test_reject_records_reason(): void
    {
        $owner = $this->makeUser();
        $renter = $this->makeUser();
        $type = $this->makeVehicleType('TRK-'.Str::random(6), 'Truck', 1000, 6000, 2.5, 40);
        $vehicle = $this->makeVehicle([
            'owner_id' => (int) $owner->id,
            'vehicle_type_id' => (int) $type->id,
            'name' => 'Reject Me '.Str::random(6),
        ]);

        $booking = $this->makeBooking([
            'user_id' => (int) $renter->id,
            'vehicle_id' => (int) $vehicle->id,
            'vehicle_type_id' => (int) $type->id,
            'pickup_at' => $this->atTime(2, '09:00'),
            'dropoff_at' => $this->atTime(2, '13:00'),
        ]);

        $this->actingAsUser($renter)->postJson('/v1/transport/bookings/'.$booking->id.'/reject', [
            'reason' => 'Driver unavailable',
        ])->assertStatus(422)
            ->assertJsonPath('errorCode', 'domain_error');

        $this->actingAsUser($owner)->postJson('/v1/transport/bookings/'.$booking->id.'/reject', [
            'reason' => 'Vehicle under maintenance',
        ])->assertOk()
            ->assertJsonPath('data.status', 'rejected')
            ->assertJsonPath('data.reason', 'Vehicle under maintenance');
    }

    public function test_cancel_releases_the_window_and_guards_access(): void
    {
        $owner = $this->makeUser();
        $renter = $this->makeUser();
        $stranger = $this->makeUser();
        $type = $this->makeVehicleType('TRK-'.Str::random(6), 'Truck', 1000, 6000, 2.5, 40);
        $vehicle = $this->makeVehicle([
            'owner_id' => (int) $owner->id,
            'vehicle_type_id' => (int) $type->id,
            'name' => 'Cancel Me '.Str::random(6),
        ]);

        $booking = $this->makeBooking([
            'user_id' => (int) $renter->id,
            'vehicle_id' => (int) $vehicle->id,
            'vehicle_type_id' => (int) $type->id,
            'pickup_at' => $this->atTime(2, '09:00'),
            'dropoff_at' => $this->atTime(2, '13:00'),
        ]);

        $this->actingAsUser($stranger)->postJson('/v1/transport/bookings/'.$booking->id.'/cancel')
            ->assertStatus(422)
            ->assertJsonPath('errorCode', 'domain_error');

        $this->actingAsUser($renter)->postJson('/v1/transport/bookings/'.$booking->id.'/cancel', [
            'reason' => 'Plan changed',
        ])->assertOk()
            ->assertJsonPath('data.status', 'cancelled')
            ->assertJsonPath('data.reason', 'Plan changed');

        $this->actingAsUser($renter)->postJson('/v1/transport/'.$vehicle->id.'/bookings', [
            'quantityKg' => 1000,
            'distanceKm' => 60,
            'pickupAt' => $this->atTime(2, '10:00'),
            'dropoffAt' => $this->atTime(2, '12:00'),
        ])->assertStatus(201);
    }

    public function test_owner_can_cancel_and_complete_their_bookings(): void
    {
        $owner = $this->makeUser();
        $renter = $this->makeUser();
        $type = $this->makeVehicleType('TRK-'.Str::random(6), 'Truck', 1000, 6000, 2.5, 40);
        $vehicle = $this->makeVehicle([
            'owner_id' => (int) $owner->id,
            'vehicle_type_id' => (int) $type->id,
            'name' => 'Owner Flow '.Str::random(6),
        ]);

        $toCancel = $this->makeBooking([
            'user_id' => (int) $renter->id,
            'vehicle_id' => (int) $vehicle->id,
            'vehicle_type_id' => (int) $type->id,
            'pickup_at' => $this->atTime(2, '08:00'),
            'dropoff_at' => $this->atTime(2, '12:00'),
        ]);
        $toComplete = $this->makeBooking([
            'user_id' => (int) $renter->id,
            'vehicle_id' => (int) $vehicle->id,
            'vehicle_type_id' => (int) $type->id,
            'status' => 'approved',
            'pickup_at' => $this->atTime(3, '08:00'),
            'dropoff_at' => $this->atTime(3, '12:00'),
        ]);

        $this->actingAsUser($owner)->postJson('/v1/transport/bookings/'.$toCancel->id.'/cancel')
            ->assertOk()
            ->assertJsonPath('data.status', 'cancelled');

        $this->actingAsUser($renter)->postJson('/v1/transport/bookings/'.$toComplete->id.'/complete')
            ->assertStatus(422)
            ->assertJsonPath('errorCode', 'domain_error');

        $this->actingAsUser($owner)->postJson('/v1/transport/bookings/'.$toComplete->id.'/complete')
            ->assertOk()
            ->assertJsonPath('data.status', 'completed');
    }

    public function test_delete_is_blocked_while_active_bookings_exist(): void
    {
        $owner = $this->makeUser();
        $renter = $this->makeUser();
        $type = $this->makeVehicleType('TRK-'.Str::random(6), 'Truck', 1000, 6000, 2.5, 40);
        $vehicle = $this->makeVehicle([
            'owner_id' => (int) $owner->id,
            'vehicle_type_id' => (int) $type->id,
            'name' => 'Guarded Truck '.Str::random(6),
        ]);

        $booking = $this->makeBooking([
            'user_id' => (int) $renter->id,
            'vehicle_id' => (int) $vehicle->id,
            'vehicle_type_id' => (int) $type->id,
            'pickup_at' => $this->atTime(2, '09:00'),
            'dropoff_at' => $this->atTime(2, '13:00'),
        ]);

        $this->actingAsUser($owner)->deleteJson('/v1/transport/'.$vehicle->id)
            ->assertStatus(422)
            ->assertJsonPath('errorCode', 'domain_error');

        $this->actingAsUser($renter)->postJson('/v1/transport/bookings/'.$booking->id.'/cancel')
            ->assertOk();

        $this->actingAsUser($owner)->deleteJson('/v1/transport/'.$vehicle->id)
            ->assertOk();
    }

    public function test_renter_history_lists_and_filters_by_status(): void
    {
        $owner = $this->makeUser();
        $renter = $this->makeUser();
        $type = $this->makeVehicleType('TRK-'.Str::random(6), 'Truck', 1000, 6000, 2.5, 40);
        $vehicle = $this->makeVehicle([
            'owner_id' => (int) $owner->id,
            'vehicle_type_id' => (int) $type->id,
            'name' => 'History Truck '.Str::random(6),
        ]);

        $requested = $this->makeBooking([
            'user_id' => (int) $renter->id,
            'vehicle_id' => (int) $vehicle->id,
            'vehicle_type_id' => (int) $type->id,
            'pickup_at' => $this->atTime(2, '09:00'),
            'dropoff_at' => $this->atTime(2, '13:00'),
        ]);
        $completed = $this->makeBooking([
            'user_id' => (int) $renter->id,
            'vehicle_id' => (int) $vehicle->id,
            'vehicle_type_id' => (int) $type->id,
            'status' => 'completed',
            'pickup_at' => $this->atTime(5, '09:00'),
            'dropoff_at' => $this->atTime(5, '13:00'),
        ]);
        $rejected = $this->makeBooking([
            'user_id' => (int) $renter->id,
            'vehicle_id' => (int) $vehicle->id,
            'vehicle_type_id' => (int) $type->id,
            'status' => 'rejected',
            'pickup_at' => $this->atTime(6, '09:00'),
            'dropoff_at' => $this->atTime(6, '13:00'),
        ]);

        $this->actingAsUser($renter)->getJson('/v1/transport/bookings')
            ->assertOk()
            ->assertJsonCount(3, 'data');

        $this->actingAsUser($renter)->getJson('/v1/transport/bookings?status=requested')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', (int) $requested->id);

        $this->actingAsUser($renter)->getJson('/v1/transport/bookings?status=completed')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', (int) $completed->id);

        $this->actingAsUser($renter)->getJson('/v1/transport/bookings?status=rejected')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', (int) $rejected->id);

        $this->actingAsUser($renter)->getJson('/v1/transport/bookings?status=cancelled')
            ->assertOk()
            ->assertJsonCount(0, 'data');

        $stranger = $this->makeUser();
        $this->actingAsUser($stranger)->getJson('/v1/transport/bookings/'.$requested->id)
            ->assertStatus(404)
            ->assertJsonPath('errorCode', 'booking_not_found');
    }

    public function test_owner_history_shows_received_bookings(): void
    {
        $owner = $this->makeUser();
        $renterA = $this->makeUser();
        $renterB = $this->makeUser();
        $type = $this->makeVehicleType('TRK-'.Str::random(6), 'Truck', 1000, 6000, 2.5, 40);
        $vehicle = $this->makeVehicle([
            'owner_id' => (int) $owner->id,
            'vehicle_type_id' => (int) $type->id,
            'name' => 'Owner View '.Str::random(6),
        ]);
        $otherVehicle = $this->makeVehicle([
            'owner_id' => (int) $this->makeUser()->id,
            'vehicle_type_id' => (int) $type->id,
            'name' => 'Other Owners Truck '.Str::random(6),
        ]);

        $this->makeBooking([
            'user_id' => (int) $renterA->id,
            'vehicle_id' => (int) $vehicle->id,
            'vehicle_type_id' => (int) $type->id,
            'pickup_at' => $this->atTime(2, '09:00'),
            'dropoff_at' => $this->atTime(2, '13:00'),
        ]);
        $rejected = $this->makeBooking([
            'user_id' => (int) $renterB->id,
            'vehicle_id' => (int) $vehicle->id,
            'vehicle_type_id' => (int) $type->id,
            'status' => 'rejected',
            'pickup_at' => $this->atTime(3, '09:00'),
            'dropoff_at' => $this->atTime(3, '13:00'),
        ]);
        $this->makeBooking([
            'user_id' => (int) $renterA->id,
            'vehicle_id' => (int) $otherVehicle->id,
            'vehicle_type_id' => (int) $type->id,
            'pickup_at' => $this->atTime(2, '09:00'),
            'dropoff_at' => $this->atTime(2, '13:00'),
        ]);

        $this->actingAsUser($owner)->getJson('/v1/transport/bookings/owner')
            ->assertOk()
            ->assertJsonCount(2, 'data');

        $this->actingAsUser($owner)->getJson('/v1/transport/bookings/owner?status=rejected')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', (int) $rejected->id);

        $this->actingAsUser($renterA)->getJson('/v1/transport/bookings/owner')
            ->assertOk()
            ->assertJsonCount(0, 'data');
    }

    public function test_dashboard_returns_vehicle_and_booking_statistics(): void
    {
        $owner = $this->makeUser();
        $renter = $this->makeUser();
        $type = $this->makeVehicleType('TRK-'.Str::random(6), 'Truck', 1000, 6000, 2.5, 40);
        $vehicle = $this->makeVehicle([
            'owner_id' => (int) $owner->id,
            'vehicle_type_id' => (int) $type->id,
            'name' => 'Dash Truck '.Str::random(6),
        ]);
        $this->makeVehicle([
            'owner_id' => (int) $owner->id,
            'vehicle_type_id' => (int) $type->id,
            'name' => 'Dash Truck 2 '.Str::random(6),
            'is_available' => false,
        ]);

        $this->makeBooking([
            'user_id' => (int) $renter->id,
            'vehicle_id' => (int) $vehicle->id,
            'vehicle_type_id' => (int) $type->id,
            'status' => 'approved',
            'pickup_at' => $this->atTime(2, '09:00'),
            'dropoff_at' => $this->atTime(2, '13:00'),
        ]);
        $this->makeBooking([
            'user_id' => (int) $renter->id,
            'vehicle_id' => (int) $vehicle->id,
            'vehicle_type_id' => (int) $type->id,
            'status' => 'completed',
            'total_amount' => 4050.00,
            'pickup_at' => $this->atTime(1, '09:00'),
            'dropoff_at' => $this->atTime(1, '13:00'),
        ]);

        $response = $this->actingAsUser($owner)->getJson('/v1/transport/dashboard')
            ->assertOk()
            ->assertJsonPath('data.statistics.totalVehicles', 2)
            ->assertJsonPath('data.statistics.availableVehicles', 1)
            ->assertJsonPath('data.statistics.activeTrips', 1)
            ->assertJsonPath('data.statistics.pendingRequests', 0)
            ->assertJsonPath('data.statistics.revenueSummary.totalRevenue', 4050)
            ->assertJsonPath('data.statistics.bookingStatistics.approved', 1)
            ->assertJsonPath('data.statistics.bookingStatistics.completed', 1)
            ->assertJsonPath('data.statistics.myBookingsCount', 0);

        $response->assertJsonCount(2, 'data.recentBookings');

        $renterDashboard = $this->actingAsUser($renter)->getJson('/v1/transport/dashboard')
            ->assertOk()
            ->assertJsonPath('data.statistics.myBookingsCount', 2);
    }

    public function test_cost_estimate_returns_full_breakdown(): void
    {
        $owner = $this->makeUser();
        $renter = $this->makeUser();
        $type = $this->makeVehicleType('TRK-'.Str::random(6), 'Truck', 1000, 6000, 2.5, 40);
        $vehicle = $this->makeVehicle([
            'owner_id' => (int) $owner->id,
            'vehicle_type_id' => (int) $type->id,
            'name' => 'Quote Truck '.Str::random(6),
            'price_per_km' => 20.00,
            'loading_charges' => 500.00,
        ]);

        $this->actingAsUser($renter)->postJson('/v1/transport/cost-estimate', [
            'vehicleId' => (int) $vehicle->id,
            'distanceKm' => 100,
            'quantityKg' => 2000,
            'loadingCharges' => 500,
            'tollCharges' => 200,
            'fuelRatePerLitre' => 90,
        ])->assertOk()
            ->assertJsonPath('data.vehicle.id', (int) $vehicle->id)
            ->assertJsonPath('data.input.distanceKm', 100)
            ->assertJsonPath('data.costBreakdown.baseCost', 2000)
            ->assertJsonPath('data.costBreakdown.loadingCharges', 500)
            ->assertJsonPath('data.costBreakdown.tollCharges', 200)
            ->assertJsonPath('data.costBreakdown.fuelCharges', 1350)
            ->assertJsonPath('data.totalCost', 4050)
            ->assertJsonPath('data.estimatedTravelTimeHours', 2.5);

        $this->actingAsUser($renter)->postJson('/v1/transport/cost-estimate', [
            'vehicleId' => 999999999,
            'distanceKm' => 100,
            'quantityKg' => 2000,
        ])->assertStatus(422);
    }

    public function test_route_estimate_returns_distance_and_duration(): void
    {
        $user = $this->makeUser();

        $this->actingAsUser($user)->getJson('/v1/transport/route-estimate?origin=Surat&destination=Ahmedabad&distanceKm=120')
            ->assertOk()
            ->assertJsonPath('data.source', 'Surat')
            ->assertJsonPath('data.destination', 'Ahmedabad')
            ->assertJsonPath('data.estimatedDistanceKm', 120)
            ->assertJsonPath('data.estimatedDurationHours', 3)
            ->assertJsonPath('data.provider', 'rule-based');

        $response = $this->actingAsUser($user)->getJson('/v1/transport/route-estimate?origin=Vadodara&destination=Surat&originLat=22.3072&originLng=73.1812&destinationLat=21.1702&destinationLng=72.8311')
            ->assertOk()
            ->assertJsonPath('data.provider', 'rule-based');

        $this->assertGreaterThan(150, $response->json('data.estimatedDistanceKm'));
        $this->assertLessThan(200, $response->json('data.estimatedDistanceKm'));
        $this->assertGreaterThan(4, $response->json('data.estimatedDurationHours'));
        $this->assertLessThan(4.5, $response->json('data.estimatedDurationHours'));

        $this->actingAsUser($user)->getJson('/v1/transport/route-estimate?origin=Kutch&destination=Rann')
            ->assertStatus(422)
            ->assertJsonPath('errorCode', 'domain_error');
    }

    private function makeVehicle(array $attributes): Vehicle
    {
        return Vehicle::create([
            'owner_id' => 1,
            'vehicle_type_id' => 1,
            'name' => 'Test Truck '.Str::random(6),
            'capacity_kg' => 4000.00,
            'price_per_km' => 20.00,
            'loading_charges' => 500.00,
            'driver_name' => 'Ramesh',
            'driver_phone' => '9876500000',
            'contact_phone' => '9876500000',
            'pincode' => '382210',
            'district_id' => null,
            'taluka_id' => null,
            'village_id' => null,
            'lat' => null,
            'lng' => null,
            'service_areas' => [],
            'is_available' => true,
            'is_active' => true,
            'image_file_id' => null,
            'images_json' => [],
            'rating_avg' => 0,
            ...$attributes,
        ]);
    }

    private function makeVehicleType(string $code, string $name, int $min, int $max, float $rate, int $speed): TransportVehicleType
    {
        return TransportVehicleType::create([
            'code' => $code,
            'name' => $name,
            'min_capacity_kg' => $min,
            'max_capacity_kg' => $max,
            'rate_per_km_per_qtl' => $rate,
            'avg_speed_kmph' => $speed,
            'is_active' => true,
        ]);
    }

    private function makeBooking(array $attributes): TransportBooking
    {
        return TransportBooking::create([
            'user_id' => 1,
            'vehicle_id' => 1,
            'vehicle_type_id' => 1,
            'quantity_kg' => 2000.00,
            'distance_km' => 60.00,
            'pickup_location' => 'Source APMC',
            'dropoff_location' => 'Destination APMC',
            'pickup_at' => $this->atTime(2, '09:00'),
            'dropoff_at' => $this->atTime(2, '13:00'),
            'base_cost' => 1200.00,
            'loading_charges' => 0.00,
            'toll_charges' => 0.00,
            'fuel_charges' => 810.00,
            'total_amount' => 2010.00,
            'status' => 'requested',
            'payment_status' => 'unpaid',
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

    private function atTime(int $days, string $time): string
    {
        return Carbon::now()->addDays($days)->format('Y-m-d').' '.$time;
    }
}
