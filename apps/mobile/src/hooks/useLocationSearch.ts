import { useMemo } from 'react';
import Fuse from 'fuse.js';

export function useLocationSearch<T extends { name: string }>(
  items: T[],
  query: string
): T[] {
  const fuse = useMemo(
    () =>
      new Fuse(items, {
        keys: ['name'],
        threshold: 0.35,
        minMatchCharLength: 1,
        ignoreLocation: true,
      }),
    [items]
  );

  return useMemo(() => {
    if (query.trim().length === 0) return items;
    return fuse.search(query).map((r) => r.item);
  }, [fuse, query, items]);
}
