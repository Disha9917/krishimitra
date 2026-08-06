<?php

declare(strict_types=1);

namespace App\Services\Soil;

use App\Models\SoilHistory;
use App\Models\SoilTest;
use App\Repositories\Contracts\FarmerFieldRepositoryInterface;
use App\Repositories\Contracts\SoilHistoryRepositoryInterface;
use App\Repositories\Contracts\SoilTestRepositoryInterface;
use DomainException;
use Illuminate\Database\Eloquent\Collection;

class SoilService implements SoilServiceInterface
{
    public function __construct(
        private readonly SoilTestRepositoryInterface $soilTests,
        private readonly SoilHistoryRepositoryInterface $soilHistory,
        private readonly FarmerFieldRepositoryInterface $fields,
    ) {
    }

    public function recordSoilTest(int $userId, int $fieldId, array $data): SoilTest
    {
        $field = $this->fields->findById($fieldId);

        if ($field === null) {
            throw new DomainException(sprintf('Field [%d] does not exist.', $fieldId));
        }

        if ((int) $field->user_id !== $userId) {
            throw new DomainException('You do not own this field.');
        }

        $test = $this->soilTests->create([
            'user_id' => $userId,
            'field_id' => $fieldId,
            'report_date' => $data['report_date'] ?? today()->toDateString(),
            ...$this->testAttributes($data),
        ]);

        $this->soilHistory->create([
            'field_id' => $fieldId,
            'soil_test_id' => (int) $test->id,
            'sampled_on' => $data['report_date'] ?? today()->toDateString(),
            'parameters_json' => $this->parameterSnapshot($test),
        ]);

        return $test;
    }

    public function latestTests(int $userId, int $limit = 5): Collection
    {
        return $this->soilTests->latestForFarmer($userId, $limit);
    }

    public function historyForField(int $fieldId): Collection
    {
        return $this->soilHistory->historyForField($fieldId);
    }

    public function soilHealthSummary(int $fieldId): array
    {
        $history = $this->soilHistory->historyForField($fieldId)->first();

        if ($history === null) {
            return [
                'field_id' => $fieldId,
                'has_data' => false,
            ];
        }

        $parameters = (array) ($history->parameters_json ?? []);

        $ph = isset($parameters['ph']) ? (float) $parameters['ph'] : null;

        return [
            'field_id' => $fieldId,
            'has_data' => true,
            'sampled_on' => $history->sampled_on?->toDateString(),
            'ph' => $ph,
            'ph_band' => $ph !== null ? $this->classifyPh($ph) : null,
            'nitrogen_band' => $this->classifyNutrient($parameters['nitrogen_kg_ha'] ?? null),
            'phosphorus_band' => $this->classifyNutrient($parameters['phosphorus_kg_ha'] ?? null),
            'potassium_band' => $this->classifyNutrient($parameters['potassium_kg_ha'] ?? null),
            'organic_carbon_pct' => isset($parameters['organic_carbon_pct'])
                ? (float) $parameters['organic_carbon_pct']
                : null,
        ];
    }

    public function applyLatestHistory(int $fieldId): ?SoilHistory
    {
        $latest = $this->soilHistory->historyForField($fieldId)->first();

        if ($latest === null) {
            return null;
        }

        return $latest;
    }

    /**
     * @return array<string, mixed>
     */
    private function testAttributes(array $data): array
    {
        $allowed = [
            'lab_name',
            'ph',
            'ec',
            'nitrogen_kg_ha',
            'phosphorus_kg_ha',
            'potassium_kg_ha',
            'organic_carbon_pct',
            'report_file_id',
        ];

        return array_intersect_key($data, array_flip($allowed));
    }

    /**
     * @return array<string, mixed>
     */
    private function parameterSnapshot(SoilTest $test): array
    {
        return [
            'ph' => $test->ph,
            'ec' => $test->ec,
            'nitrogen_kg_ha' => $test->nitrogen_kg_ha,
            'phosphorus_kg_ha' => $test->phosphorus_kg_ha,
            'potassium_kg_ha' => $test->potassium_kg_ha,
            'organic_carbon_pct' => $test->organic_carbon_pct,
        ];
    }

    private function classifyPh(float $ph): string
    {
        return match (true) {
            $ph < 6.0 => 'acidic',
            $ph <= 7.5 => 'neutral',
            default => 'alkaline',
        };
    }

    private function classifyNutrient(mixed $value): ?string
    {
        if ($value === null) {
            return null;
        }

        $level = (float) $value;

        return match (true) {
            $level < 200 => 'low',
            $level <= 400 => 'medium',
            default => 'high',
        };
    }
}
