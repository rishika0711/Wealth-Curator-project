import { useCallback, useEffect, useState } from 'react';

function readStorage(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw == null) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

/** JSON preferences + cross-tab sync. */
export function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => (typeof window === 'undefined' ? initial : readStorage(key, initial)));

  useEffect(() => {
    setValue(readStorage(key, initial));
  }, [key, initial]);

  const setStored = useCallback(
    (next) => {
      setValue((prev) => {
        const resolved = typeof next === 'function' ? next(prev) : next;
        try {
          window.localStorage.setItem(key, JSON.stringify(resolved));
        } catch {
          /* quota or private mode */
        }
        return resolved;
      });
    },
    [key],
  );

  useEffect(() => {
    const onStorage = (ev) => {
      if (ev.key !== key) return;
      setValue(readStorage(key, initial));
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [key, initial]);

  return [value, setStored];
}
