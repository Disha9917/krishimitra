<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CancelTransportBookingRequest;
use App\Http\Requests\RejectTransportBookingRequest;
use App\Http\Requests\StoreTransportBookingRequest;
use App\Http\Requests\TransportBookingHistoryRequest;
use App\Http\Resources\TransportBookingResource;
use App\Services\Transport\TransportServiceInterface;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TransportBookingController extends Controller
{
    public function __construct(
        private readonly TransportServiceInterface $transport,
    ) {}

    public function store(StoreTransportBookingRequest $request, int $vehicleId): JsonResponse
    {
        $booking = $this->transport->requestBooking(
            (int) $request->user()->id,
            $vehicleId,
            $this->attributes($request->validated()),
        );

        return ApiResponse::success(
            new TransportBookingResource($booking),
            'Booking request sent to the vehicle owner.',
            201,
        );
    }

    public function index(TransportBookingHistoryRequest $request): JsonResponse
    {
        return ApiResponse::success(
            TransportBookingResource::collection(
                $this->transport->myBookings(
                    (int) $request->user()->id,
                    $this->filters($request->validated()),
                    $this->limit($request),
                ),
            ),
        );
    }

    public function owner(TransportBookingHistoryRequest $request): JsonResponse
    {
        return ApiResponse::success(
            TransportBookingResource::collection(
                $this->transport->ownerBookings(
                    (int) $request->user()->id,
                    $this->filters($request->validated()),
                    $this->limit($request),
                ),
            ),
        );
    }

    public function show(Request $request, int $bookingId): JsonResponse
    {
        $booking = $this->transport->findBooking((int) $request->user()->id, $bookingId);

        if ($booking === null) {
            return ApiResponse::error('Booking not found.', 404, 'booking_not_found');
        }

        return ApiResponse::success(new TransportBookingResource($booking));
    }

    public function approve(Request $request, int $bookingId): JsonResponse
    {
        $booking = $this->transport->approveBooking((int) $request->user()->id, $bookingId);

        return ApiResponse::success(
            new TransportBookingResource($booking),
            'Booking approved.',
        );
    }

    public function reject(RejectTransportBookingRequest $request, int $bookingId): JsonResponse
    {
        $booking = $this->transport->rejectBooking(
            (int) $request->user()->id,
            $bookingId,
            $request->validated('reason'),
        );

        return ApiResponse::success(
            new TransportBookingResource($booking),
            'Booking rejected.',
        );
    }

    public function cancel(CancelTransportBookingRequest $request, int $bookingId): JsonResponse
    {
        $booking = $this->transport->cancelBooking(
            (int) $request->user()->id,
            $bookingId,
            $request->validated('reason'),
        );

        return ApiResponse::success(
            new TransportBookingResource($booking),
            'Booking cancelled.',
        );
    }

    public function complete(Request $request, int $bookingId): JsonResponse
    {
        $booking = $this->transport->completeBooking((int) $request->user()->id, $bookingId);

        return ApiResponse::success(
            new TransportBookingResource($booking),
            'Booking completed.',
        );
    }

    /**
     * @param  array<string, mixed>  $validated
     * @return array<string, mixed>
     */
    private function attributes(array $validated): array
    {
        $map = [
            'quantityKg' => 'quantity_kg',
            'distanceKm' => 'distance_km',
            'pickupLocation' => 'pickup_location',
            'dropoffLocation' => 'dropoff_location',
            'pickupAt' => 'pickup_at',
            'dropoffAt' => 'dropoff_at',
            'loadingCharges' => 'loading_charges',
            'tollCharges' => 'toll_charges',
            'fuelRatePerLitre' => 'fuel_rate_per_litre',
        ];

        $out = [];

        foreach ($map as $requestKey => $attribute) {
            if (array_key_exists($requestKey, $validated) && $validated[$requestKey] !== null) {
                $out[$attribute] = $validated[$requestKey];
            }
        }

        return $out;
    }

    /**
     * @param  array<string, mixed>  $validated
     * @return array<string, mixed>
     */
    private function filters(array $validated): array
    {
        $map = [
            'status' => 'status',
            'vehicleId' => 'vehicle_id',
        ];

        $out = [];

        foreach ($map as $requestKey => $attribute) {
            if (array_key_exists($requestKey, $validated) && $validated[$requestKey] !== null) {
                $out[$attribute] = $validated[$requestKey];
            }
        }

        return $out;
    }

    private function limit(Request $request): int
    {
        return $request->validated('limit') !== null
            ? (int) $request->validated('limit')
            : 20;
    }
}
