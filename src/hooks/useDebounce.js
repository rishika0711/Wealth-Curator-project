import { useEffect, useState } from 'react';

/** Debounces a fast-changing value (e.g. search). Cleared input resets immediately so the list/filter doesn’t linger. */
export function useDebounce(value, delayMs) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    if (value === '') {
      setDebounced('');
      return undefined;
    }
    const id = window.setTimeout(() => setDebounced(value), delayMs);
    return () => window.clearTimeout(id);
  }, [value, delayMs]);

  return debounced;
}
