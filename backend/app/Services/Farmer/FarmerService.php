<?php

declare(strict_types=1);

namespace App\Services\Farmer;

use App\Models\FarmerCrop;
use App\Models\FarmerField;
use App\Models\FarmerProfile;
use App\Models\User;
use App\Repositories\Contracts\ActivityLogRepositoryInterface;
use App\Repositories\Contracts\DiseaseDetectionRepositoryInterface;
use App\Repositories\Contracts\FarmerCropRepositoryInterface;
use App\Repositories\Contracts\FarmerFieldRepositoryInterface;
use App\Repositories\Contracts\FarmerProfileRepositoryInterface;
use App\Repositories\Contracts\HarvestRepositoryInterface;
use App\Repositories\Contracts\NotificationRepositoryInterface;
use App\Repositories\Contracts\RoleRepositoryInterface;
use App\Repositories\Contracts\UserRepositoryInterface;
use App\Repositories\Contracts\UserRoleRepositoryInterface;
use App\Services\Common\DTO\FarmerDashboardDTO;
use DomainException;
use Illuminate\Database\Eloquent\Collection;

class FarmerService implements FarmerServiceInterface
{
    public function __construct(
        private readonly UserRepositoryInterface $users,
        private readonly FarmerProfileRepositoryInterface $profiles,
        private readonly RoleRepositoryInterface $roles,
        private readonly UserRoleRepositoryInterface $userRoles,
        private readonly ActivityLogRepositoryInterface $activityLogs,
        private readonly FarmerFieldRepositoryInterface $fields,
        private readonly FarmerCropRepositoryInterface $farmerCrops,
        private readonly HarvestRepositoryInterface $harvests,
        private readonly DiseaseDetectionRepositoryInterface $detections,
        private readonly NotificationRepositoryInterface $notifications,
    ) {
    }

    public function registerFarmer(string $phone, string $fullName, string $pincode, string $preferredLanguage = 'gu'): User
    {
        if ($this->users->findByPhone($phone) !== null) {
            throw new DomainException('A farmer with this phone number is already registered.');
        }

        $user = $this->users->create([
            'full_name' => $fullName,
            'phone' => $phone,
            'preferred_language' => $preferredLanguage,
            'is_active' => true,
        ]);

        $this->profiles->create([
            'user_id' => (int) $user->id,
            'pincode' => $pincode,
        ]);

        $role = $this->roles->findFirstWhere(['code' => 'farmer']);

        if ($role !== null) {
            $this->userRoles->create([
                'user_id' => (int) $user->id,
                'role_id' => (int) $role->id,
            ]);
        }

        $this->activityLogs->create([
            'user_id' => (int) $user->id,
            'activity_type' => 'ACCOUNT',
            'title' => 'Farmer registered',
            'description' => sprintf('New farmer account created for %s.', $phone),
            'performed_at' => now(),
        ]);

        return $user;
    }

    public function updateProfile(int $userId, array $attributes): ?FarmerProfile
    {
        if (isset($attributes['full_name'])) {
            $this->users->update($userId, [
                'full_name' => (string) $attributes['full_name'],
            ]);
        }

        if (isset($attributes['preferred_language'])) {
            $this->users->update($userId, [
                'preferred_language' => (string) $attributes['preferred_language'],
            ]);
        }

        $profile = $this->profiles->findFirstWhere(['user_id' => $userId]);

        if ($profile === null) {
            return $this->profiles->create([
                'user_id' => $userId,
                ...$this->profileAttributes($attributes),
            ]);
        }

        return $this->profiles->update((int) $profile->id, $this->profileAttributes($attributes));
    }

    public function dashboard(int $userId): FarmerDashboardDTO
    {
        return FarmerDashboardDTO::assemble(
            profile: $this->profiles->farmerDashboard($userId),
            fields: $this->fields->linkedFields($userId),
            crops: $this->farmerCrops->cropsForUser($userId),
            harvests: $this->harvests->harvestsForFarmer($userId),
            detections: $this->detections->detectionsForFarmer($userId),
            unreadCount: $this->notifications->unreadCount($userId),
        );
    }

    public function addField(int $userId, array $data): FarmerField
    {
        return $this->fields->create([
            'user_id' => $userId,
            ...$data,
        ]);
    }

    public function updateField(int $userId, int $fieldId, array $data): ?FarmerField
    {
        $field = $this->assertFieldOwnership($userId, $fieldId);

        return $this->fields->update((int) $field->id, $data);
    }

    public function deleteField(int $userId, int $fieldId): bool
    {
        $field = $this->assertFieldOwnership($userId, $fieldId);

        return $this->fields->delete((int) $field->id);
    }

    public function recordCrop(int $userId, array $data): FarmerCrop
    {
        return $this->farmerCrops->create([
            'user_id' => $userId,
            ...$data,
        ]);
    }

    public function cropsForUser(int $userId): Collection
    {
        return $this->farmerCrops->cropsForUser($userId);
    }

    /**
     * @return array<string, mixed>
     */
    private function profileAttributes(array $attributes): array
    {
        $allowed = [
            'farm_size_acres',
            'primary_crop_id',
            'pincode',
            'state',
            'district_id',
            'taluka_id',
            'village',
            'alert_preferences',
        ];

        return array_intersect_key($attributes, array_flip($allowed));
    }

    private function assertFieldOwnership(int $userId, int $fieldId): FarmerField
    {
        $field = $this->fields->findById($fieldId);

        if ($field === null) {
            throw new DomainException(sprintf('Field [%d] does not exist.', $fieldId));
        }

        if ((int) $field->user_id !== $userId) {
            throw new DomainException('You do not own this field.');
        }

        return $field;
    }
}
