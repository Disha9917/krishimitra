<?php

declare(strict_types=1);

namespace App\Services\Farmer;

use App\Models\FarmerCrop;
use App\Models\FarmerField;
use App\Models\FarmerProfile;
use App\Models\User;
use App\Services\Common\DTO\FarmerDashboardDTO;
use Illuminate\Database\Eloquent\Collection;

interface FarmerServiceInterface
{
    /**
     * Create a farmer account: user, profile, default role, and audit trail.
     *
     * @throws \DomainException when the phone number is already registered
     */
    public function registerFarmer(string $phone, string $fullName, string $pincode, string $preferredLanguage = 'gu'): User;

    /**
     * Create or refresh the farmer profile and the linked user record.
     */
    public function updateProfile(int $userId, array $attributes): ?FarmerProfile;

    /**
     * Aggregate every farmer-scoped record into a dashboard payload.
     */
    public function dashboard(int $userId): FarmerDashboardDTO;

    /**
     * Register a new field owned by the user.
     */
    public function addField(int $userId, array $data): FarmerField;

    /**
     * Update an existing field, enforcing ownership.
     *
     * @throws \DomainException when the field belongs to another user
     */
    public function updateField(int $userId, int $fieldId, array $data): ?FarmerField;

    /**
     * Soft-delete an existing field, enforcing ownership.
     *
     * @throws \DomainException when the field belongs to another user
     */
    public function deleteField(int $userId, int $fieldId): bool;

    /**
     * Register a planted crop for a farmer.
     */
    public function recordCrop(int $userId, array $data): FarmerCrop;

    /**
     * List every planted crop for a farmer.
     */
    public function cropsForUser(int $userId): Collection;
}
