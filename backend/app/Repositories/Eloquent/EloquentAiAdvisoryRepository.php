<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\Models\AiAdvisory;
use App\Repositories\Contracts\AiAdvisoryRepositoryInterface;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;

class EloquentAiAdvisoryRepository extends BaseEloquentRepository implements AiAdvisoryRepositoryInterface
{
    public function __construct(AiAdvisory $model)
    {
        parent::__construct($model);
    }

    public function advisoriesForUser(int $userId): Collection
    {
        return $this->model
            ->where('user_id', $userId)
            ->orderByDesc('id')
            ->get();
    }

    public function historyForUser(int $userId, ?string $advisoryType, int $limit): Collection
    {
        $query = $this->model->where('user_id', $userId);

        if ($advisoryType !== null && $advisoryType !== '') {
            $query->where('advisory_type', $advisoryType);
        }

        return $query
            ->orderByDesc('id')
            ->limit($limit)
            ->get();
    }

    public function searchForUser(int $userId, array $filters): Collection
    {
        $query = $this->model->newQuery()->where('user_id', $userId);

        $this->applyFilters($query, $filters);

        return $query
            ->orderByDesc('id')
            ->limit($this->limit($filters['limit'] ?? null))
            ->get();
    }

    public function findForUser(int $userId, int $id): ?AiAdvisory
    {
        return $this->model->where('user_id', $userId)->find($id);
    }

    public function favoritesForUser(int $userId, int $limit): Collection
    {
        return $this->model
            ->where('user_id', $userId)
            ->where('is_favorite', true)
            ->orderByDesc('updated_at')
            ->orderByDesc('id')
            ->limit($limit)
            ->get();
    }

    public function setFavorite(AiAdvisory $advisory, bool $favorite): void
    {
        $advisory->is_favorite = $favorite;
        $advisory->save();
    }

    public function saveFeedback(AiAdvisory $advisory, array $feedback): void
    {
        $advisory->rating = $feedback['rating'];
        $advisory->helpful = $feedback['helpful'];
        $advisory->feedback_comment = $feedback['comment'] !== '' ? $feedback['comment'] : null;
        $advisory->feedback_at = now();
        $advisory->save();
    }

    /**
     * @param  array<string, mixed>  $filters
     */
    private function applyFilters(Builder $query, array $filters): void
    {
        $this->applyStringFilter($query, 'advisory_type', $filters['advisory_type'] ?? null);
        $this->applyStringFilter($query, 'risk_level', $filters['risk_level'] ?? null);
        $this->applyStringFilter($query, 'provider', $filters['provider'] ?? null);

        foreach (['crop', 'field', 'district'] as $jsonKey) {
            if (isset($filters[$jsonKey]) && trim((string) $filters[$jsonKey]) !== '') {
                $query->where(function (Builder $q) use ($filters, $jsonKey): void {
                    $needle = '%'.$this->escapeLike((string) $filters[$jsonKey]).'%';
                    $q->whereRaw("input_snapshot::text ILIKE ?", [$needle])
                        ->orWhereRaw("context_snapshot::text ILIKE ?", [$needle]);
                });
            }
        }

        if (isset($filters['keyword']) && trim((string) $filters['keyword']) !== '') {
            $needle = '%'.$this->escapeLike((string) $filters['keyword']).'%';
            $query->where(function (Builder $q) use ($needle): void {
                $q->where('topic', 'ILIKE', $needle)
                    ->orWhere('prompt_text', 'ILIKE', $needle)
                    ->orWhere('response_content', 'ILIKE', $needle);
            });
        }

        if (isset($filters['from']) && (string) $filters['from'] !== '') {
            $query->whereDate('generated_at', '>=', (string) $filters['from']);
        }

        if (isset($filters['to']) && (string) $filters['to'] !== '') {
            $query->whereDate('generated_at', '<=', (string) $filters['to']);
        }

        if (($filters['favorites'] ?? false) === true) {
            $query->where('is_favorite', true);
        }
    }

    private function applyStringFilter(Builder $query, string $column, mixed $value): void
    {
        if (isset($value) && trim((string) $value) !== '') {
            $query->where($column, (string) $value);
        }
    }

    private function limit(mixed $limit): int
    {
        return max(1, min(100, (int) ($limit ?? 20)));
    }

    private function escapeLike(string $value): string
    {
        return addcslashes($value, '%_\\');
    }
}
