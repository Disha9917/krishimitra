import { useState, useMemo } from "react";

export function useSearch<T>(items: T[], searchKeys: (keyof T)[]) {
  const [query, setQuery] = useState("");

  const filteredItems = useMemo(() => {
    if (!query.trim()) return items;
    const lower = query.toLowerCase();
    return items.filter((item) =>
      searchKeys.some((key) => {
        const val = item[key];
        return val && String(val).toLowerCase().includes(lower);
      })
    );
  }, [items, query, searchKeys]);

  return { query, setQuery, filteredItems };
}