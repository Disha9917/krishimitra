<?php

declare(strict_types=1);

namespace App\Support\Report;

use RuntimeException;

/**
 * Minimal dependency-free PDF 1.4 writer used for report export.
 *
 * Renders left-aligned, wrapped text lines with a Helvetica base font on A4
 * pages. Kept intentionally small so reports do not require Composer packages;
 * swap for a full PDF engine later without touching the rest of the module.
 */
final class SimplePdfWriter
{
    private const PAGE_WIDTH = 595.28;

    private const PAGE_HEIGHT = 841.89;

    private const MARGIN = 44.0;

    private const FONT_SIZE = 9;

    private const LINE_HEIGHT = 12;

    private const CHARS_PER_LINE = 112;

    /** @var list<string> content streams, one entry per page */
    private array $pages = [];

    private string $current = '';

    private float $y = 0;

    public function __construct(
        private readonly string $title,
        private readonly int $fontSize = self::FONT_SIZE,
        private readonly int $lineHeight = self::LINE_HEIGHT,
    ) {
        $this->startPage();
        $this->addLine('=== '.$title.' ===');
        $this->addBlank();
    }

    public function addBlank(): void
    {
        $this->advance();
    }

    public function addLine(string $text): void
    {
        foreach ($this->wrap($text) as $line) {
            $this->write($line);
        }
    }

    /**
     * Emit the assembled PDF document as a string.
     */
    public function save(): string
    {
        $objects = [];
        $objectCount = 0;

        $object = function (string $body) use (&$objects, &$objectCount): int {
            $objectCount++;

            $objects[$objectCount] = $body;

            return $objectCount;
        };

        $object('<< /Type /Catalog /Pages 2 0 R >>');
        $pagesRefs = '';

        foreach (array_keys($this->pages) as $index) {
            $pageNumber = $index + 1;
            $pageObject = 3 + (($pageNumber - 1) * 2);
            $pagesRefs .= $pageObject.' 0 R ';
        }

        $object(sprintf('<< /Type /Pages /Kids [ %s] /Count %d >>', $pagesRefs, count($this->pages)));
        $object('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>');

        foreach ($this->pages as $index => $stream) {
            $pageNumber = $index + 1;
            $pageObject = 3 + (($pageNumber - 1) * 2);
            $contentObject = $pageObject + 1;

            $object(sprintf(
                '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 %s %s] /Resources << /Font << /F1 3 0 R >> >> /Contents %d 0 R >>',
                self::PAGE_WIDTH,
                self::PAGE_HEIGHT,
                $contentObject,
            ));

            $object(sprintf(
                "<< /Length %d >>\nstream\n%s\nendstream",
                strlen($stream),
                $stream,
            ));
        }

        $buffer = "%PDF-1.4\n";
        $offsets = [0];

        foreach ($objects as $number => $body) {
            $offsets[$number] = strlen($buffer);
            $buffer .= sprintf("%d 0 obj\n%s\nendobj\n", $number, $body);
        }

        $xrefOffset = strlen($buffer);
        $buffer .= "xref\n0 ".(count($objects) + 1)."\n";
        $buffer .= "0000000000 65535 f \n";

        for ($number = 1; $number <= count($objects); $number++) {
            $buffer .= sprintf("%010d 00000 n \n", $offsets[$number]);
        }

        $buffer .= sprintf(
            "trailer\n<< /Size %d /Root 1 0 R >>\nstartxref\n%d\n%%%%EOF",
            count($objects) + 1,
            $xrefOffset,
        );

        if (str_starts_with($buffer, '%PDF-1.4') && str_ends_with($buffer, '%%EOF')) {
            return $buffer;
        }

        throw new RuntimeException('Failed to assemble the PDF document.');
    }

    private function startPage(): void
    {
        $this->pages[] = '';
        $this->y = self::PAGE_HEIGHT - self::MARGIN;
        $this->current = '';
    }

    private function write(string $text): void
    {
        if ($this->y < self::MARGIN + $this->lineHeight) {
            $this->pages[array_key_last($this->pages)] = $this->current;
            $this->startPage();
        }

        $this->current .= sprintf(
            "BT /F1 %d Tf %.2F %.2F Td (%s) Tj ET\n",
            $this->fontSize,
            self::MARGIN,
            $this->y,
            $this->escape($text),
        );

        $this->advance();
    }

    private function advance(): void
    {
        $this->y -= $this->lineHeight;

        if ($this->y < self::MARGIN) {
            $this->pages[array_key_last($this->pages)] = $this->current;
            $this->startPage();
        }
    }

    /**
     * @return list<string>
     */
    private function wrap(string $text): array
    {
        $lines = [];
        $remaining = trim($text);

        while ($remaining !== '') {
            if (mb_strlen($remaining) <= self::CHARS_PER_LINE) {
                $lines[] = $remaining;
                break;
            }

            $cut = mb_substr($remaining, 0, self::CHARS_PER_LINE);
            $space = mb_strrpos($cut, ' ');

            $line = $space !== false && $space > 0
                ? mb_substr($cut, 0, $space)
                : $cut;

            $lines[] = $line;
            $remaining = trim(mb_substr($remaining, mb_strlen($line)));
        }

        return $lines;
    }

    private function escape(string $text): string
    {
        $text = str_replace(['\\', '(', ')'], ['\\\\', '\\(', '\\)'], $text);

        return preg_replace('/[^\x20-\x7E]/', '?', $text) ?? '?';
    }
}
