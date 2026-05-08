function formatMoney(amount) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
}

function formatPct(delta) {
  const sign = delta > 0 ? '+' : '';
  return `${sign}${delta.toFixed(1)}%`;
}

/** Deterministic “AI” narratives from holdings / spend / subs. */
export function buildInsights(data) {
  const thin =
    !data.holdings.length && !data.transactions.length && !data.spending.length && !data.subscriptions.length;
  if (thin) {
    return [
      {
        id: 'ins-onboard',
        title: 'Ledger awaiting signal',
        body:
          'Import holdings and transaction history to unlock drift narratives, subscription overlap savings, and behavioral spending cues.',
        badge: 'Setup',
      },
      {
        id: 'ins-policy',
        title: 'Policy scaffolding',
        body:
          'Define IPS targets and guardrails to automate strategy cards — we will surface rebalance bands as soon as sleeves populate.',
        badge: 'Governance',
      },
    ];
  }

  const tech = data.holdings.filter((h) => h.sector === 'Technology');
  const techWeight = tech.reduce((s, h) => s + h.weightPct, 0);
  const prevTech = tech.reduce((s, h) => s + h.prevWeightPct, 0);
  const techDeltaPct = prevTech > 0 ? ((techWeight - prevTech) / prevTech) * 100 : 0;

  const dups = data.subscriptions.filter((s) => s.duplicateOf);
  const dupAnnual = dups.reduce((sum, s) => sum + s.monthlyAmount * 12, 0);
  const savingsTip = dupAnnual > 0 ? Math.round(dupAnnual) : 180;

  const spendingSorted = [...data.spending].sort((a, b) => b.amount - a.amount);
  const spendingTop = spendingSorted[0];
  const portfolioConcentration = data.holdings.length > 0 ? Math.max(...data.holdings.map((h) => h.weightPct)) : 0;
  const monthlyOutflow = data.summary.spendingMonthly.amount;
  const modeledMonthlySavings =
    spendingTop && monthlyOutflow > 0 ? Math.round(((monthlyOutflow * spendingTop.pct) / 100) * 0.06) : 0;

  const concentrationBody =
    portfolioConcentration > 0
      ? `Largest sleeve is ${portfolioConcentration.toFixed(
          1,
        )}% — inside guardrails, but conviction is clustering. Introduce a completion portfolio or factor tilt to diversify idiosyncratic risk.`
      : 'Once positions load, we will score concentration against your policy sleeves and surface completion trades.';

  const out = [];

  if (tech.length > 0) {
    out.push({
      id: 'ins-tech',
      title: 'Technology exposure',
      body: `Your tech exposure ${techDeltaPct >= 0 ? 'rose' : 'compressed'} by ${formatPct(
        techDeltaPct,
      )} versus last quarter — allocation is now ${techWeight.toFixed(
        1,
      )}% of modeled public equities. Compare against policy targets before drift compounds.`,
      badge: 'Portfolio',
    });
  }

  out.push({
    id: 'ins-subs',
    title: 'Subscription hygiene',
    body:
      dups.length > 0
        ? `Overlapping tools suggest you can save approximately ${formatMoney(
            savingsTip,
          )} annually by removing duplicate subscriptions and downgrading dormant tiers.`
        : `Scan recurring vendors quarterly — modest overlaps often compound to ${formatMoney(
            savingsTip,
          )} or more in annual leakage.`,
    badge: 'Cashflow',
  });

  if (spendingTop) {
    out.push({
      id: 'ins-spend',
      title: 'Spending narrative',
      body: `${spendingTop.category} is ${spendingTop.pct}% of this month’s outflows. A measured 6% trim in that bucket models ~${formatMoney(
        modeledMonthlySavings,
      )} monthly redirected to your compounding sleeve.`,
      badge: 'Behavior',
    });
  }

  out.push({
    id: 'ins-risk',
    title: 'Risk posture',
    body: concentrationBody,
    badge: 'Risk',
  });

  return out;
}

/** Feed for Portfolio Insights page layout — tech sleeve narrative + KPIs derived from mocks. */
export function getPortfolioInsightsModel(data, insightsArr) {
  const techInsight = insightsArr.find((i) => i.id === 'ins-tech');
  const tech = data.holdings.filter((h) => h.sector === 'Technology');
  const techWeight = tech.reduce((s, h) => s + h.weightPct, 0);
  const prevTech = tech.reduce((s, h) => s + h.prevWeightPct, 0);
  const delta = prevTech > 0 ? ((techWeight - prevTech) / prevTech) * 100 : techWeight > 0 ? 14.2 : 0;

  const headline =
    tech.length > 0
      ? `Your technology exposure has ${delta >= 0 ? 'increased' : 'decreased'} by ${Math.abs(delta).toFixed(1)}% since last quarter.`
      : 'Your modeled portfolios are diversified across sleeves — deepen signal quality by aligning custodian imports.';

  const body =
    techInsight?.body ??
    (data.holdings.length === 0
      ? 'Connect brokerage accounts so we can measure sleeve drift versus policy corridors and quantify rebalance priority.'
      : 'Compare allocation velocity against IPS targets quarterly; early drift trims avoid taxable event clustering at year-end.');

  const sectorMap = {};
  data.holdings.forEach((h) => {
    sectorMap[h.sector] = (sectorMap[h.sector] || 0) + h.weightPct;
  });
  const sectors = Object.entries(sectorMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  let topPick = { symbol: 'NVDA', changePct: 8.4 };
  let maxDelta = -Infinity;
  data.holdings.forEach((h) => {
    const dr = h.weightPct - h.prevWeightPct;
    if (dr > maxDelta) {
      maxDelta = dr;
      topPick = { symbol: h.symbol, changePct: dr };
    }
  });

  const monthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date());

  return {
    headline,
    body,
    confidencePct: tech.length > 0 ? 92 : 68,
    sentimentScore: tech.length > 0 ? Math.min(100, Math.round(68 + delta * 0.35)) : 74,
    netWorth: data.summary.netWorth.amount,
    netWorthDeltaPct: data.summary.netWorthDeltaPct,
    sectors,
    topPerformer: topPick,
    cashflowMonthLabel: monthName,
  };
}
