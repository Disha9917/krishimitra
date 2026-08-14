<?php

declare(strict_types=1);

namespace App\Services\Report;

use App\Support\Report\SimplePdfWriter;
use RuntimeException;

/**
 * Serializes a report data snapshot into CSV and PDF documents.
 *
 * Nested payloads (including Eloquent models) are flattened into ordered
 * section -> key -> value rows so any report type exports uniformly.
 */
class ReportFormatter
{
    /**
     * @param  array<string, mixed>  $data
     */
    public function csv(string $title, array $data): string
    {
        $stream = fopen('php://temp', 'r+');

        if ($stream === false) {
            throw new RuntimeException('Unable to open a temporary stream for the CSV export.');
        }

        fputcsv($stream, ['FasalDrishti Report', $title]);
        fputcsv($stream, ['Generated At', now()->toISOString()]);
        fputcsv($stream, []);
        fputcsv($stream, ['Section', 'Key', 'Value']);

        foreach ($this->flatten($data, (int) config('report.csv.max_rows')) as $row) {
            fputcsv($stream, $row);
        }

        rewind($stream);
        $content = (string) stream_get_contents($stream);
        fclose($stream);

        return $content;
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function pdf(string $title, array $data): string
    {
        $writer = new SimplePdfWriter(
            $title,
            (int) config('report.pdf.font_size'),
            (int) config('report.pdf.line_height'),
        );

        $writer->addLine('Generated At: '.now()->toISOString());
        $writer->addBlank();

        $rows = $this->flatten($data, (int) config('report.pdf.max_lines'));
        $lastSection = null;

        foreach ($rows as $row) {
            [$section, $key, $value] = $row;

            if ($section !== $lastSection) {
                $writer->addBlank();
                $writer->addLine('== '.$section.' ==');
                $lastSection = $section;
            }

            $writer->addLine($key.' : '.$value);
        }

        return $writer->save();
    }

    /**
     * Flatten a nested payload into [section, key, value] rows.
     *
     * @param  array<string, mixed>  $data
     * @return list<array{0: string, 1: string, 2: string}>
     */
    private function flatten(array $data, int $maxRows): array
    {
        $rows = [];
        $this->walk($data, '', $rows, $maxRows, 0);

        return $rows;
    }

    /**
     * @param  array<string, mixed>  $data
     * @param  list<array{0: string, 1: string, 2: string}>  $rows
     */
    private function walk(array $data, string $section, array &$rows, int $maxRows, int $depth): void
    {
        if ($depth > 5 || count($rows) >= $maxRows) {
            return;
        }

        foreach ($data as $key => $value) {
            if (count($rows) >= $maxRows) {
                break;
            }

            if ($value === null) {
                continue;
            }

            if (is_array($value)) {
                $list = array_is_list($value);

                if ($list && count($value) > 3) {
                    $rows[] = [$section, (string) $key, 'count: '.count($value)];

                    continue;
                }

                $this->walk($value, $section, $rows, $maxRows, $depth + 1);

                continue;
            }

            $display = match (true) {
                is_bool($value) => $value ? 'true' : 'false',
                is_float($value) => (string) round($value, 4),
                is_scalar($value) => (string) $value,
                default => (string) json_encode($value, JSON_UNESCAPED_UNICODE),
            };

            $rows[] = [$section !== '' ? $section : 'report', (string) $key, $display];
        }
    }
}
