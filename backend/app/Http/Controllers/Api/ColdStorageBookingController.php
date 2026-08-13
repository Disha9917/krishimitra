<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CancelStorageBookingRequest;
use App\Http\Requests\RejectStorageBookingRequest;
use App\Http\Requests\StorageBookingHistoryRequest;
use App\Http\Requests\StoreStorageBookingRequest;
use App\Http\Resources\ColdStorageBookingResource;
use App\Services\ColdStorage\ColdStorageServiceInterface;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ColdStorageBookingController extends Controller
{
    public function __construct(
        private readonly ColdStorageServiceInterface $storage,
    ) {}

    public function store(StoreStorageBookingRequest $request, int $storageId): JsonResponse
    {
        $booking = $this->storage->requestBooking(
            (int) $request->user()->id,
            $storageId,
            $this->attributes($request->validated()),
        );

        return ApiResponse::success(
            new ColdStorageBookingResource($booking),
            'Booking request sent to the facility owner.',
            201,
        );
    }

    public function index(StorageBookingHistoryRequest $request): JsonResponse
    {
        return ApiResponse::success(
            ColdStorageBookingResource::collection(
                $this->storage->myBookings(
                    (int) $request->user()->id,
                    $this->filters($request->validated()),
                    $this->limit($request),
                ),
            ),
        );
    }

    public function owner(StorageBookingHistoryRequest $request): JsonResponse
    {
        return ApiResponse::success(
            ColdStorageBookingResource::collection(
                $this->storage->ownerBookings(
                    (int) $request->user()->id,
                    $this->filters($request->validated()),
                    $this->limit($request),
                ),
            ),
        );
    }

    public function show(Request $request, int $bookingId): JsonResponse
    {
        $booking = $this->storage->findBooking((int) $request->user()->id, $bookingId);

        if ($booking === null) {
            return ApiResponse::error('Booking not found.', 404, 'booking_not_found');
        }

        return ApiResponse::success(new ColdStorageBookingResource($booking));
    }

    public function approve(Request $request, int $bookingId): JsonResponse
    {
        $booking = $this->storage->approveBooking((int) $request->user()->id, $bookingId);

        return ApiResponse::success(
            new ColdStorageBookingResource($booking),
            'Booking approved and capacity reserved.',
        );
    }

    public function reject(RejectStorageBookingRequest $request, int $bookingId): JsonResponse
    {
        $booking = $this->storage->rejectBooking(
            (int) $request->user()->id,
            $bookingId,
            $request->validated('reason'),
        );

        return ApiResponse::success(
            new ColdStorageBookingResource($booking),
            'Booking rejected.',
        );
    }

    public function cancel(CancelStorageBookingRequest $request, int $bookingId): JsonResponse
    {
        $booking = $this->storage->cancelBooking(
            (int) $request->user()->id,
            $bookingId,
            $request->validated('reason'),
        );

        return ApiResponse::success(
            new ColdStorageBookingResource($booking),
            'Booking cancelled and capacity released.',
        );
    }

    public function complete(Request $request, int $bookingId): JsonResponse
    {
        $booking = $this->storage->completeBooking((int) $request->user()->id, $bookingId);

        return ApiResponse::success(
            new ColdStorageBookingResource($booking),
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
            'cropId' => 'crop_id',
            'quantityKg' => 'quantity_kg',
            'startDate' => 'start_date',
            'endDate' => 'end_date',
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
            'storageId' => 'storage_id',
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
