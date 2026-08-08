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
    private const SOIL_STATUS_HEALTHY = 'healthy';

    private const SOIL_STATUS_MODERATE = 'moderate';

    private const SOIL_STATUS_POOR = 'poor';

    private const FERTILITY_HIGH = 'high';

    private const FERTILITY_MEDIUM = 'medium';

    private const FERTILITY_LOW = 'low';

    /**
     * Keys stored on soil_tests that can be written through the service.
     *
     * @var list<string>
     */
    private const WRITABLE_ATTRIBUTES = [
        'crop_id',
        'lab_name',
        'report_date',
        'ph',
        'ec',
        'nitrogen_kg_ha',
        'phosphorus_kg_ha',
        'potassium_kg_ha',
        'organic_carbon_pct',
        'moisture_pct',
        'micronutrients_json',
        'soil_texture',
        'soil_type_id',
        'report_file_id',
    ];

    /**
     * Keys included in the history snapshot.
     *
     * @var list<string>
     */
    private const SNAPSHOT_KEYS = [
        'ph',
        'ec',
        'nitrogen_kg_ha',
        'phosphorus_kg_ha',
        'potassium_kg_ha',
        'organic_carbon_pct',
        'moisture_pct',
        'micronutrients_json',
        'soil_texture',
        'soil_type_id',
        'health_score',
        'soil_status',
        'fertility_level',
    ];

    /**
     * Chart series requested by the dashboard.
     *
     * @var list<string>
     */
    private const CHART_PARAMETERS = [
        'ph',
        'ec',
        'nitrogen_kg_ha',
        'phosphorus_kg_ha',
        'potassium_kg_ha',
        'organic_carbon_pct',
        'moisture_pct',
    ];

    public function __construct(
        private readonly SoilTestRepositoryInterface $soilTests,
        private readonly SoilHistoryRepositoryInterface $soilHistory,
        private readonly FarmerFieldRepositoryInterface $fields,
    ) {}

    public function recordSoilTest(int $userId, int $fieldId, array $data): SoilTest
    {
        return $this->createSoilTest($userId, $fieldId, $data);
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
        return $this->soilHistory->historyForField($fieldId)->first();
    }

    public function createSoilTest(int $userId, int $fieldId, array $data): SoilTest
    {
        $this->assertFieldOwnership($userId, $fieldId);

        $attributes = [
            'user_id' => $userId,
            'field_id' => $fieldId,
            'report_date' => $data['report_date'] ?? today()->toDateString(),
            ...$this->testAttributes($data),
        ];

        $test = $this->soilTests->create($this->withHealth($attributes));

        $this->snapshotHistory($test, (string) $attributes['report_date']);

        return $test;
    }

    public function updateSoilTest(int $userId, int $testId, array $data): ?SoilTest
    {
        $test = $this->soilTests->findForFarmer($userId, $testId);

        if ($test === null) {
            return null;
        }

        $attributes = [
            'report_date' => $data['report_date'] ?? $test->report_date?->toDateString(),
            ...$this->testAttributes($data),
        ];

        $updated = $this->soilTests->update($testId, $this->withHealth($attributes, $test));

        if ($updated !== null) {
            $this->snapshotHistory($updated, (string) $attributes['report_date']);
        }

        return $updated;
    }

    public function deleteSoilTest(int $userId, int $testId): bool
    {
        $test = $this->soilTests->findForFarmer($userId, $testId);

        if ($test === null) {
            return false;
        }

        return $this->soilTests->delete($testId);
    }

    public function getSoilTest(int $userId, int $testId): ?SoilTest
    {
        return $this->soilTests->findForFarmer($userId, $testId);
    }

    public function listSoilTests(int $userId, array $filters = [], int $limit = 20): Collection
    {
        return $this->soilTests->listForFarmer($userId, $filters, $limit);
    }

    public function soilHistory(int $userId, array $filters = [], int $limit = 20): Collection
    {
        return $this->soilHistory->historyForFarmer($userId, $filters, $limit);
    }

    public function soilHealth(int $userId, int $fieldId): array
    {
        $this->assertFieldOwnership($userId, $fieldId);

        $latest = $this->soilTests->listForFarmer($userId, ['field_id' => $fieldId], 1)->first();

        if ($latest === null) {
            return [
                'field_id' => $fieldId,
                'has_data' => false,
                'health_score' => null,
                'soil_status' => null,
                'fertility_level' => null,
                'nutrient_summary' => [],
                'alerts' => [],
            ];
        }

        return [
            'field_id' => $fieldId,
            'has_data' => true,
            'latest_test_id' => (int) $latest->id,
            'sampled_on' => $latest->report_date?->toDateString(),
            'health_score' => $latest->health_score !== null ? (float) $latest->health_score : null,
            'soil_status' => $latest->soil_status,
            'fertility_level' => $latest->fertility_level,
            'nutrient_summary' => $this->nutrientSummary($latest),
            'alerts' => $this->alertsFor($latest),
        ];
    }

    public function soilDashboard(int $userId): array
    {
        $tests = $this->soilTests->listForFarmer($userId, [], 1000);
        $history = $this->soilHistory->historyForFarmer($userId, [], 1000);

        $scores = $tests
            ->pluck('health_score')
            ->filter(fn ($score): bool => $score !== null)
            ->map(fn ($score): float => (float) $score);

        $distribution = [
            self::SOIL_STATUS_HEALTHY => 0,
            self::SOIL_STATUS_MODERATE => 0,
            self::SOIL_STATUS_POOR => 0,
        ];

        foreach ($tests as $test) {
            if (is_string($test->soil_status) && array_key_exists($test->soil_status, $distribution)) {
                $distribution[$test->soil_status]++;
            }
        }

        $alerts = [];

        foreach ($tests->groupBy('field_id') as $fieldId => $fieldTests) {
            /** @var SoilTest $latestTest */
            $latestTest = $fieldTests->first();

            if ($latestTest->field_id === null) {
                continue;
            }

            $fieldAlerts = $this->alertsFor($latestTest);

            if ($fieldAlerts !== []) {
                $alerts[] = [
                    'field_id' => (int) $latestTest->field_id,
                    'field_name' => $latestTest->field?->name,
                    'alerts' => $fieldAlerts,
                ];
            }
        }

        return [
            'latest_report' => $tests->first(),
            'average_health_score' => $scores->avg() !== null ? round($scores->avg(), 2) : null,
            'status_distribution' => $distribution,
            'nutrient_charts' => $this->chartSeries($history),
            'alerts' => $alerts,
            'tests_count' => $tests->count(),
            'fields_count' => $tests->pluck('field_id')->filter()->unique()->count(),
        ];
    }

    public function soilRecommendations(int $userId, int $testId): ?array
    {
        $test = $this->soilTests->findForFarmer($userId, $testId);

        if ($test === null) {
            return null;
        }

        return $this->buildRecommendations($test);
    }

    /**
     * @return array<string, mixed>
     */
    private function withHealth(array $attributes, ?SoilTest $existing = null): array
    {
        $merged = $existing !== null
            ? [...$existing->only([...self::WRITABLE_ATTRIBUTES, 'report_date']), ...$attributes]
            : $attributes;

        $score = $this->healthScore($merged);

        return [
            ...$attributes,
            'health_score' => $score['score'],
            'soil_status' => $score['status'],
            'fertility_level' => $score['fertility'],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function healthScore(array $data): array
    {
        $ph = isset($data['ph']) ? (float) $data['ph'] : null;
        $ec = isset($data['ec']) ? (float) $data['ec'] : null;
        $nitrogen = isset($data['nitrogen_kg_ha']) ? (float) $data['nitrogen_kg_ha'] : null;
        $phosphorus = isset($data['phosphorus_kg_ha']) ? (float) $data['phosphorus_kg_ha'] : null;
        $potassium = isset($data['potassium_kg_ha']) ? (float) $data['potassium_kg_ha'] : null;
        $organicCarbon = isset($data['organic_carbon_pct']) ? (float) $data['organic_carbon_pct'] : null;

        $parts = [
            'ph' => [$this->phScore($ph), 25],
            'ec' => [$this->ecScore($ec), 15],
            'nitrogen' => [$this->nitrogenScore($nitrogen), 20],
            'phosphorus' => [$this->phosphorusScore($phosphorus), 15],
            'potassium' => [$this->potassiumScore($potassium), 15],
            'organic_carbon' => [$this->organicCarbonScore($organicCarbon), 10],
        ];

        $earned = 0;
        $max = 0;

        foreach ($parts as [$earnedPart, $maxPart]) {
            if ($earnedPart !== null) {
                $earned += $earnedPart;
                $max += $maxPart;
            }
        }

        $score = $max > 0 ? (int) round(($earned / $max) * 100) : null;

        return [
            'score' => $score,
            'status' => $score !== null ? $this->statusForScore($score) : null,
            'fertility' => $this->fertilityLevel($data),
        ];
    }

    private function statusForScore(int $score): string
    {
        if ($score >= 75) {
            return self::SOIL_STATUS_HEALTHY;
        }

        if ($score >= 50) {
            return self::SOIL_STATUS_MODERATE;
        }

        return self::SOIL_STATUS_POOR;
    }

    /**
     * @param  array<string, mixed>  $data
     */
    private function fertilityLevel(array $data): ?string
    {
        $nutrients = [
            'nitrogen' => isset($data['nitrogen_kg_ha']) ? (float) $data['nitrogen_kg_ha'] : null,
            'phosphorus' => isset($data['phosphorus_kg_ha']) ? (float) $data['phosphorus_kg_ha'] : null,
            'potassium' => isset($data['potassium_kg_ha']) ? (float) $data['potassium_kg_ha'] : null,
            'organic_carbon' => isset($data['organic_carbon_pct']) ? (float) $data['organic_carbon_pct'] : null,
        ];

        $lowCount = 0;
        $present = 0;

        foreach ($nutrients as $name => $value) {
            if ($value === null) {
                continue;
            }

            $present++;

            if ($this->isLowNutrient($name, $value)) {
                $lowCount++;
            }
        }

        if ($present === 0) {
            return null;
        }

        return match (true) {
            $lowCount >= 2 => self::FERTILITY_LOW,
            $lowCount === 1 => self::FERTILITY_MEDIUM,
            default => self::FERTILITY_HIGH,
        };
    }

    private function isLowNutrient(string $name, float $value): bool
    {
        return match ($name) {
            'nitrogen' => $value < 280,
            'phosphorus' => $value < 10,
            'potassium' => $value < 108,
            'organic_carbon' => $value < 0.4,
            default => false,
        };
    }

    private function phScore(?float $ph): ?float
    {
        if ($ph === null) {
            return null;
        }

        if ($ph >= 6.5 && $ph <= 7.5) {
            return 25.0;
        }

        if (($ph >= 6.0 && $ph < 6.5) || ($ph > 7.5 && $ph <= 8.0)) {
            return 20.0;
        }

        if (($ph >= 5.5 && $ph < 6.0) || ($ph > 8.0 && $ph <= 8.5)) {
            return 12.0;
        }

        return 5.0;
    }

    private function ecScore(?float $ec): ?float
    {
        if ($ec === null) {
            return null;
        }

        if ($ec <= 0.2) {
            return 8.0;
        }

        if ($ec <= 0.8) {
            return 15.0;
        }

        if ($ec <= 1.6) {
            return 10.0;
        }

        if ($ec <= 2.5) {
            return 5.0;
        }

        return 2.0;
    }

    private function nitrogenScore(?float $nitrogen): ?float
    {
        if ($nitrogen === null) {
            return null;
        }

        if ($nitrogen < 280) {
            return 8.0;
        }

        if ($nitrogen <= 560) {
            return 15.0;
        }

        return 20.0;
    }

    private function phosphorusScore(?float $phosphorus): ?float
    {
        if ($phosphorus === null) {
            return null;
        }

        if ($phosphorus < 10) {
            return 6.0;
        }

        if ($phosphorus <= 25) {
            return 11.0;
        }

        return 15.0;
    }

    private function potassiumScore(?float $potassium): ?float
    {
        if ($potassium === null) {
            return null;
        }

        if ($potassium < 108) {
            return 6.0;
        }

        if ($potassium <= 280) {
            return 11.0;
        }

        return 15.0;
    }

    private function organicCarbonScore(?float $organicCarbon): ?float
    {
        if ($organicCarbon === null) {
            return null;
        }

        if ($organicCarbon < 0.4) {
            return 4.0;
        }

        if ($organicCarbon <= 0.75) {
            return 7.0;
        }

        return 10.0;
    }

    /**
     * @return array<string, mixed>
     */
    private function nutrientSummary(SoilTest $test): array
    {
        $ph = $test->ph !== null ? (float) $test->ph : null;
        $ec = $test->ec !== null ? (float) $test->ec : null;
        $nitrogen = $test->nitrogen_kg_ha !== null ? (float) $test->nitrogen_kg_ha : null;
        $phosphorus = $test->phosphorus_kg_ha !== null ? (float) $test->phosphorus_kg_ha : null;
        $potassium = $test->potassium_kg_ha !== null ? (float) $test->potassium_kg_ha : null;
        $organicCarbon = $test->organic_carbon_pct !== null ? (float) $test->organic_carbon_pct : null;
        $moisture = $test->moisture_pct !== null ? (float) $test->moisture_pct : null;

        return [
            'ph' => ['value' => $ph, 'band' => $ph !== null ? $this->classifyPh($ph) : null],
            'ec' => ['value' => $ec, 'band' => $ec !== null ? $this->classifyEc($ec) : null],
            'nitrogen_kg_ha' => ['value' => $nitrogen, 'band' => $this->classifyNitrogen($nitrogen)],
            'phosphorus_kg_ha' => ['value' => $phosphorus, 'band' => $this->classifyPhosphorus($phosphorus)],
            'potassium_kg_ha' => ['value' => $potassium, 'band' => $this->classifyPotassium($potassium)],
            'organic_carbon_pct' => ['value' => $organicCarbon, 'band' => $this->classifyOrganicCarbon($organicCarbon)],
            'moisture_pct' => ['value' => $moisture, 'band' => $moisture !== null ? $this->classifyMoisture($moisture) : null],
        ];
    }

    /**
     * @return list<array<string, mixed>>
     */
    private function alertsFor(SoilTest $test): array
    {
        $alerts = [];

        $ph = $test->ph !== null ? (float) $test->ph : null;
        $ec = $test->ec !== null ? (float) $test->ec : null;
        $nitrogen = $test->nitrogen_kg_ha !== null ? (float) $test->nitrogen_kg_ha : null;
        $phosphorus = $test->phosphorus_kg_ha !== null ? (float) $test->phosphorus_kg_ha : null;
        $potassium = $test->potassium_kg_ha !== null ? (float) $test->potassium_kg_ha : null;
        $organicCarbon = $test->organic_carbon_pct !== null ? (float) $test->organic_carbon_pct : null;
        $moisture = $test->moisture_pct !== null ? (float) $test->moisture_pct : null;

        if ($ph !== null && $ph < 5.5) {
            $alerts[] = [
                'type' => 'acidity',
                'severity' => 'high',
                'message' => sprintf('Soil is highly acidic (pH %s). Apply lime to raise the pH toward 6.5.', number_format($ph, 2)),
            ];
        } elseif ($ph !== null && $ph > 8.5) {
            $alerts[] = [
                'type' => 'alkalinity',
                'severity' => 'high',
                'message' => sprintf('Soil is highly alkaline (pH %s). Consider gypsum and acid-forming fertilizers.', number_format($ph, 2)),
            ];
        } elseif ($ph !== null && ($ph < 6.0 || $ph > 7.5)) {
            $alerts[] = [
                'type' => 'ph_imbalance',
                'severity' => 'medium',
                'message' => sprintf('Soil pH (%s) is outside the ideal 6.5–7.5 range.', number_format($ph, 2)),
            ];
        }

        if ($ec !== null && $ec > 1.6) {
            $alerts[] = [
                'type' => 'salinity',
                'severity' => $ec > 2.5 ? 'high' : 'medium',
                'message' => sprintf('Electrical conductivity (%s dS/m) indicates salinity risk.', number_format($ec, 2)),
            ];
        }

        if ($nitrogen !== null && $nitrogen < 280) {
            $alerts[] = [
                'type' => 'nitrogen_deficiency',
                'severity' => 'medium',
                'message' => sprintf('Available nitrogen (%s kg/ha) is low.', number_format($nitrogen, 2)),
            ];
        }

        if ($phosphorus !== null && $phosphorus < 10) {
            $alerts[] = [
                'type' => 'phosphorus_deficiency',
                'severity' => 'medium',
                'message' => sprintf('Available phosphorus (%s kg/ha) is low.', number_format($phosphorus, 2)),
            ];
        }

        if ($potassium !== null && $potassium < 108) {
            $alerts[] = [
                'type' => 'potassium_deficiency',
                'severity' => 'medium',
                'message' => sprintf('Available potassium (%s kg/ha) is low.', number_format($potassium, 2)),
            ];
        }

        if ($organicCarbon !== null && $organicCarbon < 0.4) {
            $alerts[] = [
                'type' => 'low_organic_carbon',
                'severity' => 'medium',
                'message' => 'Organic carbon is low; add farmyard manure or compost to improve soil structure.',
            ];
        }

        if ($moisture !== null && $moisture < 10) {
            $alerts[] = [
                'type' => 'dry_soil',
                'severity' => 'high',
                'message' => sprintf('Soil moisture is very low (%s%%). Irrigate soon.', number_format($moisture, 2)),
            ];
        }

        return $alerts;
    }

    /**
     * @param  Collection<int, SoilHistory>  $history
     * @return array<string, list<array<string, mixed>>>
     */
    private function chartSeries(Collection $history): array
    {
        $charts = [];

        foreach (self::CHART_PARAMETERS as $parameter) {
            $charts[$parameter] = $history
                ->filter(function (SoilHistory $record) use ($parameter): bool {
                    $parameters = (array) ($record->parameters_json ?? []);

                    return array_key_exists($parameter, $parameters) && $parameters[$parameter] !== null;
                })
                ->map(function (SoilHistory $record) use ($parameter): array {
                    $parameters = (array) ($record->parameters_json ?? []);

                    return [
                        'sampledOn' => $record->sampled_on?->toDateString(),
                        'value' => (float) $parameters[$parameter],
                    ];
                })
                ->values()
                ->all();
        }

        return $charts;
    }

    /**
     * @return array<string, mixed>
     */
    private function buildRecommendations(SoilTest $test): array
    {
        $ph = $test->ph !== null ? (float) $test->ph : null;
        $ec = $test->ec !== null ? (float) $test->ec : null;
        $nitrogen = $test->nitrogen_kg_ha !== null ? (float) $test->nitrogen_kg_ha : null;
        $phosphorus = $test->phosphorus_kg_ha !== null ? (float) $test->phosphorus_kg_ha : null;
        $potassium = $test->potassium_kg_ha !== null ? (float) $test->potassium_kg_ha : null;
        $organicCarbon = $test->organic_carbon_pct !== null ? (float) $test->organic_carbon_pct : null;
        $moisture = $test->moisture_pct !== null ? (float) $test->moisture_pct : null;

        return [
            'test_id' => (int) $test->id,
            'generated_at' => now()->toIso8601String(),
            'fertilizer' => $this->fertilizerRecommendations($nitrogen, $phosphorus, $potassium),
            'lime_requirement' => $this->limeRequirement($ph),
            'organic_matter' => $this->organicMatterRecommendation($organicCarbon),
            'irrigation' => $this->irrigationSuggestion($moisture, $test->soil_texture, $ec),
        ];
    }

    /**
     * @return list<array<string, mixed>>
     */
    private function fertilizerRecommendations(?float $nitrogen, ?float $phosphorus, ?float $potassium): array
    {
        $recommendations = [];

        if ($nitrogen !== null) {
            $band = $this->classifyNitrogen($nitrogen);

            $recommendations[] = [
                'nutrient' => 'Nitrogen (N)',
                'band' => $band,
                'dosage' => match ($band) {
                    'low' => 'Apply 90–120 kg N/ha in 2–3 split doses (e.g., 195–260 kg urea/ha) starting with a basal dose.',
                    'medium' => 'Apply a maintenance dose of 50–70 kg N/ha (about 110–150 kg urea/ha).',
                    default => 'Sufficient nitrogen. Avoid excess urea application; apply only if crop shows deficiency symptoms.',
                },
                'suggested_kg_per_ha' => match ($band) {
                    'low' => 100.0,
                    'medium' => 60.0,
                    default => null,
                },
            ];
        }

        if ($phosphorus !== null) {
            $band = $this->classifyPhosphorus($phosphorus);

            $recommendations[] = [
                'nutrient' => 'Phosphorus (P)',
                'band' => $band,
                'dosage' => match ($band) {
                    'low' => 'Apply 40–60 kg P2O5/ha as DAP (85–130 kg/ha) during land preparation, banded near the seed row.',
                    'medium' => 'Apply a maintenance dose of 20–30 kg P2O5/ha (about 45–65 kg DAP/ha).',
                    default => 'Sufficient phosphorus. Maintain with periodic soil testing.',
                },
                'suggested_kg_per_ha' => match ($band) {
                    'low' => 50.0,
                    'medium' => 25.0,
                    default => null,
                },
            ];
        }

        if ($potassium !== null) {
            $band = $this->classifyPotassium($potassium);

            $recommendations[] = [
                'nutrient' => 'Potassium (K)',
                'band' => $band,
                'dosage' => match ($band) {
                    'low' => 'Apply 30–40 kg K2O/ha as MOP (50–65 kg/ha) during land preparation.',
                    'medium' => 'Apply a maintenance dose of 15–25 kg K2O/ha (about 25–40 kg MOP/ha).',
                    default => 'Sufficient potassium. No immediate application needed.',
                },
                'suggested_kg_per_ha' => match ($band) {
                    'low' => 35.0,
                    'medium' => 20.0,
                    default => null,
                },
            ];
        }

        return $recommendations;
    }

    /**
     * @return array<string, mixed>
     */
    private function limeRequirement(?float $ph): array
    {
        if ($ph === null) {
            return [
                'required' => false,
                'tons_per_hectare' => null,
                'message' => 'Lime requirement could not be assessed without a pH reading.',
            ];
        }

        if ($ph >= 6.5) {
            return [
                'required' => false,
                'tons_per_hectare' => 0.0,
                'message' => 'Soil pH is adequate; no liming required.',
            ];
        }

        $tonnes = match (true) {
            $ph < 4.5 => 3.0,
            $ph < 5.0 => 2.0,
            $ph < 5.5 => 1.5,
            $ph < 6.0 => 1.0,
            default => 0.5,
        };

        return [
            'required' => true,
            'tons_per_hectare' => $tonnes,
            'message' => sprintf(
                'Soil is acidic (pH %s). Apply about %s t/ha of agricultural lime (or dolomite) and incorporate into the topsoil.',
                number_format($ph, 2),
                number_format($tonnes, 1),
            ),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function organicMatterRecommendation(?float $organicCarbon): array
    {
        if ($organicCarbon === null) {
            return [
                'level' => 'unknown',
                'recommendation' => 'Organic carbon was not measured. A soil test is recommended before applying organic amendments.',
            ];
        }

        if ($organicCarbon < 0.4) {
            return [
                'level' => 'low',
                'recommendation' => 'Apply 8–10 t/ha of well-decomposed farmyard manure/compost and sow green-manure crops (dhaincha, sunhemp) to rebuild organic carbon.',
            ];
        }

        if ($organicCarbon <= 0.75) {
            return [
                'level' => 'medium',
                'recommendation' => 'Maintain organic matter by applying 4–5 t/ha compost each season and retaining crop residues.',
            ];
        }

        return [
            'level' => 'good',
            'recommendation' => 'Organic carbon is adequate. Continue current organic-matter management practices.',
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function irrigationSuggestion(?float $moisture, ?string $texture, ?float $ec): array
    {
        $frequency = match ($texture) {
            'sandy', 'sandy loam', 'loamy sand' => 'Light and frequent irrigation (every 3–4 days during hot weather).',
            'clay', 'clay loam', 'silty clay' => 'Deep, less frequent irrigation (every 7–10 days) to avoid waterlogging.',
            default => 'Irrigate according to crop stage, rainfall and evapotranspiration.',
        };

        $suggestion = match (true) {
            $moisture !== null && $moisture < 20 => sprintf(
                'Soil moisture is low (%s%%). Irrigate immediately to bring moisture into the 20–60%% range. %s',
                number_format($moisture, 2),
                $frequency,
            ),
            $moisture !== null && $moisture <= 40 => sprintf(
                'Soil moisture is moderate (%s%%). Schedule irrigation within 1–2 days. %s',
                number_format($moisture, 2),
                $frequency,
            ),
            $moisture !== null => sprintf(
                'Soil moisture is adequate (%s%%). No immediate irrigation needed. %s',
                number_format($moisture, 2),
                $frequency,
            ),
            default => sprintf('Moisture not measured. %s', $frequency),
        };

        $salinityNote = $ec !== null && $ec > 1.6
            ? ' Use good-quality water; avoid saline irrigation water.'
            : '';

        return [
            'suggestion' => $suggestion.$salinityNote,
            'frequency' => $frequency,
            'irrigate_now' => $moisture !== null && $moisture < 20,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function testAttributes(array $data): array
    {
        return array_intersect_key($data, array_flip(self::WRITABLE_ATTRIBUTES));
    }

    private function snapshotHistory(SoilTest $test, string $sampledOn): void
    {
        $parameters = [];

        foreach (self::SNAPSHOT_KEYS as $key) {
            $parameters[$key] = $test->{$key};
        }

        $this->soilHistory->create([
            'field_id' => (int) $test->field_id,
            'soil_test_id' => (int) $test->id,
            'sampled_on' => $sampledOn,
            'parameters_json' => $parameters,
        ]);
    }

    private function assertFieldOwnership(int $userId, int $fieldId): void
    {
        $field = $this->fields->findById($fieldId);

        if ($field === null) {
            throw new DomainException(sprintf('Field [%d] does not exist.', $fieldId));
        }

        if ((int) $field->user_id !== $userId) {
            throw new DomainException('You do not own this field.');
        }
    }

    private function classifyPh(float $ph): string
    {
        return match (true) {
            $ph < 6.0 => 'acidic',
            $ph <= 7.5 => 'neutral',
            default => 'alkaline',
        };
    }

    private function classifyEc(float $ec): string
    {
        return match (true) {
            $ec < 0.2 => 'low',
            $ec <= 0.8 => 'normal',
            $ec <= 1.6 => 'high',
            default => 'saline',
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

    private function classifyNitrogen(mixed $value): ?string
    {
        if ($value === null) {
            return null;
        }

        $level = (float) $value;

        return match (true) {
            $level < 280 => 'low',
            $level <= 560 => 'medium',
            default => 'high',
        };
    }

    private function classifyPhosphorus(mixed $value): ?string
    {
        if ($value === null) {
            return null;
        }

        $level = (float) $value;

        return match (true) {
            $level < 10 => 'low',
            $level <= 25 => 'medium',
            default => 'high',
        };
    }

    private function classifyPotassium(mixed $value): ?string
    {
        if ($value === null) {
            return null;
        }

        $level = (float) $value;

        return match (true) {
            $level < 108 => 'low',
            $level <= 280 => 'medium',
            default => 'high',
        };
    }

    private function classifyOrganicCarbon(mixed $value): ?string
    {
        if ($value === null) {
            return null;
        }

        $level = (float) $value;

        return match (true) {
            $level < 0.4 => 'low',
            $level <= 0.75 => 'medium',
            default => 'high',
        };
    }

    private function classifyMoisture(float $moisture): string
    {
        return match (true) {
            $moisture < 20 => 'low',
            $moisture <= 60 => 'ideal',
            default => 'high',
        };
    }
}
