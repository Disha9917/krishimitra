<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Models\UploadedFile;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

/** @mixin Vehicle */
class VehicleResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => (int) $this->id,
            'uuid' => $this->uuid,
            'name' => $this->name,
            'vehicleNumber' => $this->vehicle_number,
            'vehicleType' => $this->vehicleType !== null ? [
                'id' => (int) $this->vehicleType->id,
                'code' => $this->vehicleType->code,
                'name' => $this->vehicleType->name,
                'minCapacityKg' => (int) $this->vehicleType->min_capacity_kg,
                'maxCapacityKg' => (int) $this->vehicleType->max_capacity_kg,
                'avgSpeedKmph' => (int) $this->vehicleType->avg_speed_kmph,
            ] : null,
            'capacityKg' => $this->capacity_kg !== null ? (float) $this->capacity_kg : null,
            'pricePerKm' => $this->price_per_km !== null ? (float) $this->price_per_km : null,
            'loadingCharges' => $this->loading_charges !== null ? (float) $this->loading_charges : null,
            'driver' => [
                'name' => $this->driver_name,
                'phone' => $this->driver_phone,
            ],
            'contactPhone' => $this->contact_phone,
            'pincode' => $this->pincode,
            'district' => $this->district !== null ? [
                'id' => (int) $this->district->id,
                'name' => $this->district->name,
            ] : null,
            'taluka' => $this->taluka !== null ? [
                'id' => (int) $this->taluka->id,
                'name' => $this->taluka->name,
            ] : null,
            'village' => $this->village !== null ? [
                'id' => (int) $this->village->id,
                'name' => $this->village->name,
            ] : null,
            'lat' => $this->lat !== null ? (float) $this->lat : null,
            'lng' => $this->lng !== null ? (float) $this->lng : null,
            'serviceAreas' => $this->service_areas ?? [],
            'isAvailable' => (bool) $this->is_available,
            'isActive' => (bool) $this->is_active,
            'images' => $this->images(),
            'ratingAvg' => $this->rating_avg !== null ? (float) $this->rating_avg : null,
            'owner' => $this->owner !== null ? [
                'id' => (int) $this->owner->id,
                'fullName' => $this->owner->full_name,
                'phone' => $this->owner->phone,
            ] : null,
            'createdAt' => $this->created_at?->toIso8601String(),
            'updatedAt' => $this->updated_at?->toIso8601String(),
        ];
    }

    /**
     * @return list<array<string, mixed>>
     */
    private function images(): array
    {
        $result = [];

        if ($this->image_file_id !== null && $this->imageFile !== null) {
            $result[] = $this->mapFile($this->imageFile);
        }

        foreach ($this->imageFiles() as $file) {
            if ($this->image_file_id !== null && (int) $file->id === (int) $this->image_file_id) {
                continue;
            }

            $result[] = $this->mapFile($file);
        }

        return $result;
    }

    /**
     * @return array<string, mixed>
     */
    private function mapFile(UploadedFile $file): array
    {
        return [
            'id' => (int) $file->id,
            'uuid' => $file->uuid,
            'url' => Storage::disk($file->disk)->url($file->path),
            'originalName' => $file->original_name,
            'mimeType' => $file->mime_type,
            'sizeBytes' => (int) $file->size_bytes,
        ];
    }
}
