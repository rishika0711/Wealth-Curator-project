import { MOCK_DASHBOARD, MOCK_EMPTY } from './mockData.js';

export async function fetchDashboardMock(signal, latencyMs = 650) {
  await delay(latencyMs, signal);
  if (typeof window !== 'undefined') {
    const q = new URLSearchParams(window.location.search);
    if (q.has('fail')) {
      throw new Error('Synthetic API failure — remove ?fail=1 from the URL or clear the query string to load data.');
    }
    if (q.has('empty')) {
      return structuredClone(MOCK_EMPTY);
    }
  }
  return structuredClone(MOCK_DASHBOARD);
}

function delay(ms, signal) {
  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(new DOMException('Aborted', 'AbortError'));
      return;
    }
    const id = window.setTimeout(resolve, ms);
    const onAbort = () => {
      window.clearTimeout(id);
      reject(new DOMException('Aborted', 'AbortError'));
    };
    signal.addEventListener('abort', onAbort, { once: true });
  });
}
