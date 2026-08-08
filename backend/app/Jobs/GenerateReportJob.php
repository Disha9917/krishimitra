<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Services\Report\ReportServiceInterface;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

/**
 * Heavy report generation is queued so API responses stay fast; the report
 * row flips from "generating" to "ready" once the files are written.
 */
class GenerateReportJob implements ShouldQueue
{
    use InteractsWithQueue;
    use Queueable;
    use SerializesModels;

    public function __construct(public readonly int $reportId)
    {
    }

    public function handle(ReportServiceInterface $reports): void
    {
        $reports->finalizeReport($this->reportId);
    }
}
