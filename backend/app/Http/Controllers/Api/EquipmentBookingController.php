<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\BookingHistoryRequest;
use App\Http\Requests\CancelBookingRequest;
use App\Http\Requests\RejectBookingRequest;
use App\Http\Requests\StoreBookingRequest;
use App\Http\Resources\BookingResource;
use App\Services\Equipment\EquipmentServiceInterface;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EquipmentBookingController extends Controller
{
    public function __construct(
        private readonly EquipmentServiceInterface $equipment,
    ) {}

    public function store(StoreBookingRequest $request, int $equipmentId): JsonResponse
    {
        $booking = $this->equipment->requestBooking(
            (int) $request->user()->id,
            $equipmentId,
            $this->attributes($request->validated()),
        );

        return ApiResponse::success(
            new BookingResource($booking),
            'Booking request sent to the equipment owner.',
            201,
        );
    }

    public function index(BookingHistoryRequest $request): JsonResponse
    {
        return ApiResponse::success(
            BookingResource::collection(
                $this->equipment->myBookings(
                    (int) $request->user()->id,
                    $this->filters($request->validated()),
                    $this->limit($request),
                ),
            ),
        );
    }

    public function owner(BookingHistoryRequest $request): JsonResponse
    {
        return ApiResponse::success(
            BookingResource::collection(
                $this->equipment->ownerBookings(
                    (int) $request->user()->id,
                    $this->filters($request->validated()),
                    $this->limit($request),
                ),
            ),
        );
    }

    public function show(Request $request, int $bookingId): JsonResponse
    {
        $booking = $this->equipment->findBooking((int) $request->user()->id, $bookingId);

        if ($booking === null) {
            return ApiResponse::error('Booking not found.', 404, 'booking_not_found');
        }

        return ApiResponse::success(new BookingResource($booking));
    }

    public function accept(Request $request, int $bookingId): JsonResponse
    {
        $booking = $this->equipment->acceptBooking((int) $request->user()->id, $bookingId);

        return ApiResponse::success(
            new BookingResource($booking),
            'Booking accepted.',
        );
    }

    public function reject(RejectBookingRequest $request, int $bookingId): JsonResponse
    {
        $booking = $this->equipment->rejectBooking(
            (int) $request->user()->id,
            $bookingId,
            $request->validated('reason'),
        );

        return ApiResponse::success(
            new BookingResource($booking),
            'Booking rejected.',
        );
    }

    public function cancel(CancelBookingRequest $request, int $bookingId): JsonResponse
    {
        $booking = $this->equipment->cancelBooking(
            (int) $request->user()->id,
            $bookingId,
            $request->validated('reason'),
        );

        return ApiResponse::success(
            new BookingResource($booking),
            'Booking cancelled.',
        );
    }

    public function complete(Request $request, int $bookingId): JsonResponse
    {
        $booking = $this->equipment->completeBooking((int) $request->user()->id, $bookingId);

        return ApiResponse::success(
            new BookingResource($booking),
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
            'startAt' => 'start_at',
            'endAt' => 'end_at',
            'location' => 'location',
            'depositAmount' => 'deposit_amount',
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
            'equipmentId' => 'equipment_id',
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
