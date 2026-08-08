<?php

declare(strict_types=1);

namespace App\Services\Import;

use App\Services\Import\Contracts\CSVParserInterface;
use DomainException;
use RuntimeException;

/**
 * Dependency-free CSV reader: BOM handling, delimiter sniffing, header
 * normalization, malformed-row reporting and a hard row-count cap.
 */
class CSVParserService implements CSVParserInterface
{
    /**
     * @return array{
     *   headers: list<string>,
     *   rows: list<array<string, string|null>>,
     *   parse_errors: list<array{row: int, message: string}>
     * }
     */
    public function parse(string $filePath): array
    {
        $handle = fopen($filePath, 'r');

        if ($handle === false) {
            throw new RuntimeException('Unable to open the CSV file.');
        }

        try {
            $headerLine = $this->firstNonEmptyLine($handle);

            if ($headerLine === null) {
                throw new DomainException('The CSV file is empty.');
            }

            $delimiter = $this->detectDelimiter($headerLine);
            $headers = $this->normalizeHeaders(str_getcsv($this->stripBom($headerLine), $delimiter));

            if ($headers === [] || array_filter($headers) === []) {
                throw new DomainException('The CSV file has no readable headers.');
            }

            $rows = [];
            $parseErrors = [];
            $rowNumber = 1;
            $maxRows = (int) config('import.max_rows');

            while (($row = fgetcsv($handle, 0, $delimiter)) !== false) {
                $rowNumber++;

                if ($this->isEmptyRow($row)) {
                    continue;
                }

                if (count($rows) >= $maxRows) {
                    throw new DomainException(sprintf('The CSV file exceeds the maximum of %d rows.', $maxRows));
                }

                if (count($row) !== count($headers)) {
                    $parseErrors[] = [
                        'row' => $rowNumber,
                        'message' => sprintf('Expected %d columns, found %d.', count($headers), count($row)),
                    ];

                    continue;
                }

                $rows[] = array_combine(
                    $headers,
                    array_map(
                        static fn ($value): ?string => is_string($value) && trim($value) === '' ? null : (is_string($value) ? trim($value) : null),
                        $row,
                    ),
                );
            }

            return [
                'headers' => $headers,
                'rows' => $rows,
                'parse_errors' => $parseErrors,
            ];
        } finally {
            fclose($handle);
        }
    }

    /**
     * @param  resource  $handle
     */
    private function firstNonEmptyLine($handle): ?string
    {
        while (($line = fgets($handle)) !== false) {
            if (trim($line) !== '') {
                return $line;
            }
        }

        return null;
    }

    private function detectDelimiter(string $line): string
    {
        $counts = [
            ',' => substr_count($line, ','),
            ';' => substr_count($line, ';'),
            "\t" => substr_count($line, "\t"),
            '|' => substr_count($line, '|'),
        ];

        arsort($counts);

        return (string) array_key_first($counts);
    }

    private function stripBom(string $line): string
    {
        return str_starts_with($line, "\xEF\xBB\xBF") ? substr($line, 3) : $line;
    }

    /**
     * Lowercase headers, replace spaces with underscores and drop anything
     * that is not alphanumeric.
     *
     * @param  list<string|null>  $raw
     * @return list<string>
     */
    private function normalizeHeaders(array $raw): array
    {
        $headers = [];

        foreach ($raw as $header) {
            if (! is_string($header) || trim($header) === '') {
                continue;
            }

            $normalized = strtolower(trim($header));
            $normalized = preg_replace('/\s+/', '_', $normalized) ?? $normalized;
            $normalized = preg_replace('/[^a-z0-9_]/', '', $normalized) ?? $normalized;

            $headers[] = $normalized;
        }

        return array_values(array_unique($headers));
    }

    /**
     * @param  list<string|null>  $row
     */
    private function isEmptyRow(array $row): bool
    {
        return array_reduce(
            $row,
            static fn (bool $carry, $cell): bool => $carry && ($cell === null || trim((string) $cell) === ''),
            true,
        );
    }
}
