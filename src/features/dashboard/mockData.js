export const MOCK_DASHBOARD = {
  user: {
    name: 'Alexandra Cole',
    initials: 'AC',
    avatarColor: '#4a6d8c',
    email: 'alexandra.cole@private.example',
    planTier: 'Private Client · Tier II',
    memberSince: 'Client since March 2019',
    phone: '+1 (415) 555‑0148',
  },
  documents: [
    { id: 'd1', title: 'Consolidated statement · Q1 2026', type: 'Statement', updatedAt: '2026-04-02', status: 'ready' },
    { id: 'd2', title: 'Form 1099 composite', type: 'Tax', updatedAt: '2026-03-18', status: 'ready' },
    { id: 'd3', title: 'Trust amendment (draft)', type: 'Legal', updatedAt: '2026-05-01', status: 'pending' },
    { id: 'd4', title: 'IPS acknowledgement 2026', type: 'Compliance', updatedAt: '2026-01-08', status: 'ready' },
  ],
  summary: {
    netWorth: { amount: 1284750.42, currency: 'USD' },
    netWorthDeltaPct: 3.8,
    spendingMonthly: { amount: 8420.15, currency: 'USD' },
    spendingDeltaPct: -4.2,
    savingsRatePct: 28.4,
    savingsDeltaPts: 1.6,
  },
  holdings: [
    { id: 'h1', symbol: 'VGT', name: 'Vanguard Info Tech ETF', sector: 'Technology', weightPct: 22.4, prevWeightPct: 19.6 },
    { id: 'h2', symbol: 'IXUS', name: 'iShares Core MSCI Intl', sector: 'Other', weightPct: 14.1, prevWeightPct: 14.0 },
    { id: 'h3', symbol: 'VNQ', name: 'Vanguard Real Estate ETF', sector: 'Finance', weightPct: 9.2, prevWeightPct: 9.4 },
    { id: 'h4', symbol: 'XLK', name: 'Technology Select Sector', sector: 'Technology', weightPct: 8.0, prevWeightPct: 7.1 },
    { id: 'h5', symbol: 'VTI', name: 'Vanguard Total Stock Mkt', sector: 'Consumer', weightPct: 21.0, prevWeightPct: 21.0 },
    { id: 'h6', symbol: 'BND', name: 'Vanguard Total Bond', sector: 'Finance', weightPct: 25.3, prevWeightPct: 26.2 },
  ],
  subscriptions: [
    { id: 's1', name: 'Cloud Storage Pro', monthlyAmount: 9.99, category: 'Productivity' },
    { id: 's2', name: 'News Premium', monthlyAmount: 15.0, category: 'Media', duplicateOf: 's3' },
    { id: 's3', name: 'News+ Bundle', monthlyAmount: 15.0, category: 'Media' },
    { id: 's4', name: 'Fitness Tracker', monthlyAmount: 6.5, category: 'Health' },
  ],
  transactions: buildTransactions(180),
  spending: [
    { category: 'Housing', amount: 2840, pct: 34 },
    { category: 'Investing', amount: 1920, pct: 23 },
    { category: 'Travel', amount: 1280, pct: 15 },
    { category: 'Dining', amount: 980, pct: 12 },
    { category: 'Wellness', amount: 720, pct: 9 },
    { category: 'Other', amount: 680, pct: 7 },
  ],
  alerts: [
    {
      id: 'a1',
      title: 'Cash buffer below target',
      body: 'Operating cash is 12% under your 6-month safety runway. Consider reallocating $4,200 from brokerage taxable.',
      severity: 'warning',
      ctaLabel: 'Review allocation',
    },
    {
      id: 'a2',
      title: 'FX exposure elevated',
      body: 'International equity drift increased FX beta by 1.1σ versus policy. Hedging sleeve is available in your playbook.',
      severity: 'info',
    },
  ],
};

function buildTransactions(count) {
  const merchants = ['Meridian Market', 'Atlas Airlines', 'Nova Coffee', 'Helix Gym', 'Cobalt Software', 'Lumen Electric'];
  const categories = ['Dining', 'Travel', 'Wellness', 'Shopping', 'Utilities'];
  /** Rotating sleeve tags so header search (“tickers”) matches ledger rows too. */
  const tickers = ['VGT', 'IXUS', 'VNQ', 'XLK', 'VTI', 'BND'];
  const out = [];
  const now = Date.now();
  for (let i = 0; i < count; i += 1) {
    const dayMs = 86400000;
    const date = new Date(now - i * dayMs * ((i % 5) + 1));
    out.push({
      id: `t-${i}`,
      merchant: merchants[i % merchants.length],
      category: categories[i % categories.length],
      date: date.toISOString().slice(0, 10),
      amount: -1 * (15 + (i % 120) + Math.round((i * 13) % 80)),
      ticker: tickers[i % tickers.length],
    });
  }
  return out;
}

/** Alternate payload for `?empty=1`. */
export const MOCK_EMPTY = {
  user: {
    name: 'Alexandra Cole',
    initials: 'AC',
    avatarColor: '#4a6d8c',
    email: 'alexandra.cole@private.example',
    planTier: 'Private Client · Tier II',
    memberSince: 'Client since March 2019',
    phone: '+1 (415) 555‑0148',
  },
  documents: [],
  summary: {
    netWorth: { amount: 0, currency: 'USD' },
    netWorthDeltaPct: 0,
    spendingMonthly: { amount: 0, currency: 'USD' },
    spendingDeltaPct: 0,
    savingsRatePct: 0,
    savingsDeltaPts: 0,
  },
  holdings: [],
  subscriptions: [],
  transactions: [],
  spending: [],
  alerts: [],
};
