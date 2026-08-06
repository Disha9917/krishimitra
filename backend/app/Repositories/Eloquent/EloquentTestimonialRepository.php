<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\Models\Testimonial;
use App\Repositories\Contracts\TestimonialRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class EloquentTestimonialRepository extends BaseEloquentRepository implements TestimonialRepositoryInterface
{
    public function __construct(Testimonial $model)
    {
        parent::__construct($model);
    }

    public function approvedTestimonials(): Collection
    {
            return $this->model
                ->where('is_approved', true)
                ->orderBy('display_order')
                ->get();
    }
}
