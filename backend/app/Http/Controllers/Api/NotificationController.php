<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ListNotificationsRequest;
use App\Http\Requests\UpdateNotificationPreferencesRequest;
use App\Http\Resources\NotificationPreferenceResource;
use App\Http\Resources\NotificationResource;
use App\Services\Notification\NotificationServiceInterface;
use App\Support\ApiResponse;
use DomainException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function __construct(
        private readonly NotificationServiceInterface $notifications,
    ) {
    }

    public function index(ListNotificationsRequest $request): JsonResponse
    {
        $userId = (int) $request->user()->id;
        $perPage = (int) ($request->validated('perPage') ?? 15);

        $filters = array_filter([
            'type' => $request->validated('type'),
            'is_read' => $request->validated('isRead'),
        ], static fn ($v): bool => $v !== null);

        $paginator = $this->notifications->listNotifications($userId, $filters, $perPage);

        return ApiResponse::success([
            'notifications' => NotificationResource::collection($paginator->getCollection()),
            'pagination' => [
                'total' => $paginator->total(),
                'perPage' => $paginator->perPage(),
                'currentPage' => $paginator->currentPage(),
                'lastPage' => $paginator->lastPage(),
            ],
        ]);
    }

    public function unreadCount(Request $request): JsonResponse
    {
        $userId = (int) $request->user()->id;

        return ApiResponse::success([
            'unreadCount' => $this->notifications->unreadCount($userId),
            'unreadCountByType' => $this->notifications->unreadCountByType($userId),
        ]);
    }

    public function show(Request $request, int $notificationId): JsonResponse
    {
        try {
            $notification = $this->notifications->findNotification(
                (int) $request->user()->id,
                $notificationId,
            );

            return ApiResponse::success(new NotificationResource($notification));
        } catch (DomainException $e) {
            return ApiResponse::error($e->getMessage(), 404, 'notification_not_found');
        }
    }

    public function markAsRead(Request $request, int $notificationId): JsonResponse
    {
        try {
            $this->notifications->markAsRead((int) $request->user()->id, $notificationId);

            return ApiResponse::success(null, 'Notification marked as read.');
        } catch (DomainException $e) {
            return ApiResponse::error($e->getMessage(), 404, 'notification_not_found');
        }
    }

    public function markAllRead(Request $request): JsonResponse
    {
        $count = $this->notifications->markAllRead((int) $request->user()->id);

        return ApiResponse::success([
            'markedCount' => $count,
        ], sprintf('%d notification(s) marked as read.', $count));
    }

    public function destroy(Request $request, int $notificationId): JsonResponse
    {
        try {
            $this->notifications->deleteNotification((int) $request->user()->id, $notificationId);

            return ApiResponse::success(null, 'Notification deleted.');
        } catch (DomainException $e) {
            return ApiResponse::error($e->getMessage(), 404, 'notification_not_found');
        }
    }

    public function preferences(Request $request): JsonResponse
    {
        $preferences = $this->notifications->getPreferences((int) $request->user()->id);

        return ApiResponse::success(new NotificationPreferenceResource($preferences));
    }

    public function updatePreferences(UpdateNotificationPreferencesRequest $request): JsonResponse
    {
        $data = $this->mapAttributes($request->validated());

        $preferences = $this->notifications->updatePreferences((int) $request->user()->id, $data);

        return ApiResponse::success(
            new NotificationPreferenceResource($preferences),
            'Notification preferences updated.',
        );
    }

    private function mapAttributes(array $validated): array
    {
        $map = [
            'weatherAlerts' => 'weather_alerts',
            'diseaseAlerts' => 'disease_alerts',
            'marketAlerts' => 'market_alerts',
            'governmentSchemeAlerts' => 'government_scheme_alerts',
            'equipmentAlerts' => 'equipment_alerts',
            'coldStorageAlerts' => 'cold_storage_alerts',
            'transportAlerts' => 'transport_alerts',
            'aiAdvisoryAlerts' => 'ai_advisory_alerts',
            'systemAlerts' => 'system_alerts',
            'emailEnabled' => 'email_enabled',
        ];

        $out = [];
        foreach ($map as $requestKey => $attribute) {
            if (array_key_exists($requestKey, $validated) && $validated[$requestKey] !== null) {
                $out[$attribute] = $validated[$requestKey];
            }
        }

        return $out;
    }
}
