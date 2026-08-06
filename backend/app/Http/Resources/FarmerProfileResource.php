<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Models\FarmerProfile;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin FarmerProfile */
class FarmerProfileResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $user = $this->user;

        return [
            'id' => (int) $this->id,
            'userId' => (int) $this->user_id,
            'fullName' => $user?->full_name,
            'phone' => $user?->phone,
            'email' => $user?->email,
            'preferredLanguage' => $user?->preferred_language,
            'farmSizeAcres' => $this->farm_size_acres !== null ? (float) $this->farm_size_acres : null,
            'primaryCrop' => $this->primaryCrop !== null ? [
                'id' => (int) $this->primaryCrop->id,
                'name' => $this->primaryCrop->name,
                'nameGujarati' => $this->primaryCrop->name_gujarati,
            ] : null,
            'pinCode' => $this->pincode,
            'state' => $this->state,
            'district' => $this->district !== null ? [
                'id' => (int) $this->district->id,
                'name' => $this->district->name,
            ] : null,
            'taluka' => $this->taluka !== null ? [
                'id' => (int) $this->taluka->id,
                'name' => $this->taluka->name,
            ] : null,
            'village' => $this->village,
            'alertPreferences' => $this->alert_preferences,
        ];
    }
}
