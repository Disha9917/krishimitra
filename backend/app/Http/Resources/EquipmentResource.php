<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Models\Equipment;
use App\Models\UploadedFile;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

/** @mixin Equipment */
class EquipmentResource extends JsonResource
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
            'type' => $this->equipment_type,
            'category' => $this->category,
            'brand' => $this->brand,
            'model' => $this->model,
            'description' => $this->description,
            'dailyRate' => $this->daily_rate !== null ? (float) $this->daily_rate : null,
            'hourlyRate' => $this->hourly_rate !== null ? (float) $this->hourly_rate : null,
            'depositAmount' => $this->deposit_amount !== null ? (float) $this->deposit_amount : null,
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
            'isAvailable' => (bool) $this->is_available,
            'images' => $this->images(),
            'ratingAvg' => $this->rating_avg !== null ? (float) $this->rating_avg : null,
            'owner' => $this->provider !== null ? [
                'id' => (int) $this->provider->id,
                'fullName' => $this->provider->full_name,
                'phone' => $this->provider->phone,
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
