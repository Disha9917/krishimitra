<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use App\Models\Faq;
use Illuminate\Database\Eloquent\Collection;

interface FaqRepositoryInterface extends BaseRepositoryInterface
{

    public function activeFaqs(): Collection;
}
