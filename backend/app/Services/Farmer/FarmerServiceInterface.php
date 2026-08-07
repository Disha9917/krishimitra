<?php

declare(strict_types=1);

namespace App\Services\Farmer;

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
     * Fetch the farmer profile, or null when none exists yet.
     */
    public function getProfile(int $userId): ?FarmerProfile;

    /**
     * Aggregate every farmer-scoped record into a dashboard payload.
     */
    public function dashboard(int $userId): FarmerDashboardDTO;

    /**
     * Register a new field owned by the user.
     */
    public function addField(int $userId, array $data): FarmerField;

    /**
     * List every field owned by the user (with soil type and current crop).
     */
    public function fieldsForUser(int $userId): Collection;

    /**
     * Fetch one of the user's fields, or null when missing or not owned.
     */
    public function getField(int $userId, int $fieldId): ?FarmerField;

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
}
