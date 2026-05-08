import { useCallback, useEffect, useRef, useState } from 'react';

export function useFetch(key, fetcher, options = {}) {
  const { enabled = true } = options;
  const [state, setState] = useState(() => (enabled ? { status: 'loading' } : { status: 'idle' }));
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const run = useCallback(async (signal) => {
    setState({ status: 'loading' });
    try {
      const data = await fetcherRef.current(signal);
      if (!signal.aborted) {
        setState({ status: 'success', data });
      }
      return data;
    } catch (e) {
      if (e?.name === 'AbortError') return undefined;
      const error = e instanceof Error ? e : new Error('Unknown error');
      if (!signal.aborted) {
        setState({ status: 'error', error });
      }
      throw error;
    }
  }, []);

  const refetch = useCallback(() => {
    const controller = new AbortController();
    return run(controller.signal);
  }, [run]);

  useEffect(() => {
    if (!enabled) return;
    const controller = new AbortController();
    void run(controller.signal);
    return () => controller.abort();
  }, [enabled, key, run]);

  return { state, refetch };
}

/**
 * AbortSignal-aware JSON fetch helper (swap mocks → REST).
 */
export function createJsonFetcher(url, init) {
  return async (signal) => {
    const res = await fetch(url, { ...init, signal });
    if (!res.ok) {
      const detail = await res.text().catch(() => res.statusText);
      throw new Error(detail || `Request failed (${res.status})`);
    }
    return res.json();
  };
}
