<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Models\ColdStorage;
use App\Models\UploadedFile;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

/** @mixin ColdStorage */
class ColdStorageResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $capacity = (float) $this->capacity_tonnes;
        $occupied = (float) $this->occupied_tonnes;

        return [
            'id' => (int) $this->id,
            'uuid' => $this->uuid,
            'name' => $this->name,
            'description' => $this->description,
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
            'capacityTonnes' => $capacity,
            'occupiedTonnes' => $occupied,
            'availableTonnes' => max(0.0, $capacity - $occupied),
            'temperatureRange' => [
                'display' => $this->temp_range_c,
                'minC' => $this->min_temp_c !== null ? (float) $this->min_temp_c : null,
                'maxC' => $this->max_temp_c !== null ? (float) $this->max_temp_c : null,
            ],
            'humidityRange' => $this->humidity_range,
            'supportedCrops' => $this->supported_crops ?? [],
            'images' => $this->images(),
            'ratePerTonneMonth' => $this->rate_per_tonne_month !== null ? (float) $this->rate_per_tonne_month : null,
            'isActive' => (bool) $this->is_active,
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
