<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\Models\Faq;
use App\Repositories\Contracts\FaqRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class EloquentFaqRepository extends BaseEloquentRepository implements FaqRepositoryInterface
{
    public function __construct(Faq $model)
    {
        parent::__construct($model);
    }

    public function activeFaqs(): Collection
    {
            return $this->model
                ->where('is_active', true)
                ->orderBy('display_order')
                ->get();
    }
}
