<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use App\Models\GovernmentScheme;
use Illuminate\Database\Eloquent\Collection;

interface GovernmentSchemeRepositoryInterface extends BaseRepositoryInterface
{

    public function activeSchemes(): Collection;

    public function schemesByCategory(string $category): Collection;
}
