import { ChevronRight, Lock, PiggyBank, Wallet, Zap } from 'lucide-react';
import { memo, useCallback, useId, useMemo } from 'react';
import { Pressable, StyleSheet as RNStyleSheet, Text, View, useWindowDimensions } from 'react-native-web';
import { IconGlyph } from '../../../components/icons/IconGlyph.jsx';
import { shadows, font, radii, space } from '../../../theme';
import { InsightsPerformanceChart } from './InsightsPerformanceChart.jsx';

function sectorDotColor(sector, colors) {
  const s = sector.toLowerCase();
  if (s.includes('technology')) return colors.accent;
  if (s.includes('finance')) return '#c2410c';
  if (s.includes('consumer') || s.includes('health')) return '#0ea5e9';
  if (s.includes('other')) return '#92400e';
  return '#64748b';
}

/** Half-round progress arc 0–100. */
function SemiGauge({ value, accentColor, trackColor, textColor, subtitle, variant }) {
  const uid = useId().replace(/:/g, '');
  const r = 42;
  const cx = 52;
  const cy = 54;
  const arcLen = Math.PI * r;
  const dashOffset = arcLen - (Math.min(100, Math.max(0, value)) / 100) * arcLen;
  const showNumbers = variant !== 'compact';

  return (
    <View style={gStyles.wrap} accessibilityLabel={`Gauge ${Math.round(value)} percent`}>
      <svg width={124} height={showNumbers ? 78 : 64} viewBox="0 0 104 70" style={{ display: 'block' }}>
        <defs>
          <linearGradient id={`semi-${uid}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={accentColor} stopOpacity={0.8} />
            <stop offset="100%" stopColor={accentColor} />
          </linearGradient>
        </defs>
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none"
          stroke={trackColor}
          strokeWidth={9}
          strokeLinecap="round"
        />
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none"
          stroke={`url(#semi-${uid})`}
          strokeWidth={9}
          strokeLinecap="round"
          strokeDasharray={arcLen}
          strokeDashoffset={dashOffset}
        />
      </svg>
      {subtitle ? (
        <Text style={[gStyles.subtitle, { color: textColor, marginTop: showNumbers ? -10 : -6 }]}>{subtitle}</Text>
      ) : null}
      {showNumbers ? (
        <>
          <Text style={[gStyles.num, { color: textColor }]}>{Math.round(value)}</Text>
          <Text style={[gStyles.denom, { color: textColor }]}>/100</Text>
        </>
      ) : null}
    </View>
  );
}

const gStyles = {
  wrap: { alignItems: 'center', gap: 2 },
  subtitle: {
    fontFamily: font.sans,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  num: {
    fontFamily: font.sans,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -1,
    fontVariant: ['tabular-nums'],
    marginTop: -4,
  },
  denom: {
    fontFamily: font.sans,
    fontSize: 11,
    fontWeight: '800',
    marginTop: -6,
    opacity: 0.65,
  },
};

export const PortfolioInsights = memo(function PortfolioInsights({ colors, model, data, onExecuteStrategy }) {
  const { width } = useWindowDimensions();
  const wide = width > 1020;

  const onReview = useCallback(() => onExecuteStrategy('ins-tech', 'execute'), [onExecuteStrategy]);
  const onDismiss = useCallback(() => onExecuteStrategy('ins-tech', 'dismiss'), [onExecuteStrategy]);

  const nwStr = useMemo(
    () =>
      new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(model.netWorth),
    [model.netWorth],
  );

  const nwDelta = useMemo(() => {
    const p = model.netWorthDeltaPct;
    const sign = p > 0 ? '+' : '';
    return `${sign}${p.toFixed(1)}%`;
  }, [model.netWorthDeltaPct]);

  const topPerformerStr = useMemo(() => {
    const pct = model.topPerformer.changePct;
    const sign = pct >= 0 ? '+' : '';
    return `${sign}${pct.toFixed(1)}%`;
  }, [model.topPerformer.changePct]);

  const sentimentLabel = model.sentimentScore >= 72 ? 'Optimistic' : model.sentimentScore >= 50 ? 'Neutral' : 'Defensive';

  const dupSubs = data.subscriptions.filter((s) => s.duplicateOf);
  const diningHint =
    [...data.spending].sort((a, b) => b.amount - a.amount)[0]?.category ?? 'discretionary';

  const cashCards = [
    {
      key: 'surplus',
      icon: PiggyBank,
      title: 'Surplus opportunity',
      body: `Dining and ${diningHint.toLowerCase()} velocity is above your trailing norm — redirecting one dinner out per week models ~$200 next month into your compounding sleeve.`,
    },
    {
      key: 'audit',
      icon: Wallet,
      title: 'Recurring audit',
      body:
        dupSubs.length > 0
          ? `${dupSubs.length} overlapping subscription${dupSubs.length > 1 ? 's' : ''} detected — consolidate vendors to avoid duplicate annual charges.`
          : 'Quarterly subscription sweeps often recover 2–5% of idle recurring spend across news, storage, and fitness tiers.',
    },
    {
      key: 'tlh',
      icon: Zap,
      title: 'Tax-loss harvesting',
      body:
        'Harvestable losses surfaced in taxable sleeves pair with IPS transition room — execute before December wash windows tighten.',
    },
  ];

  return (
    <View style={styles.page} accessibilityLabel="Portfolio insights">
      <View style={styles.pageHead}>
        <Text style={[styles.kickerOrg, { color: colors.accent }]} accessibilityRole="text">
          Wealth intelligence
        </Text>
        <Text style={[styles.pageTitle, { color: colors.text }]} accessibilityRole="header">
          Portfolio Insights
        </Text>
        <Text style={[styles.pageSub, { color: colors.textSecondary }]}>
          Cross-asset narratives, telemetry, and prioritized actions across sleeves — editorial tone, deterministic signals from your
          modeled book.
        </Text>
      </View>

      <View style={[wide ? styles.gridTop : styles.col]}>
        <View
          style={[
            styles.card,
            styles.signalCard,
            { borderColor: colors.border, backgroundColor: colors.bgElevated },
            shadows.sm,
          ]}
        >
          <View style={styles.signalBadgeRow}>
            <View style={[styles.sigDot, { backgroundColor: colors.warning }]} />
            <Text style={[styles.signalBadge, { color: colors.warning }]}>ACTIVE SIGNAL: REBALANCE PRIORITY</Text>
          </View>
          <View style={[styles.signalBody, wide && styles.signalBodyRow]}>
            <View style={styles.signalCopy}>
              <Text style={[styles.signalHeadline, { color: colors.text }]}>{model.headline}</Text>
              <Text style={[styles.signalPara, { color: colors.textSecondary }]}>{model.body}</Text>
              <View style={styles.signalActions}>
                <Pressable
                  onPress={onReview}
                  accessibilityRole="button"
                  accessibilityLabel="Review strategy"
                  style={({ hovered, pressed }) => [
                    styles.btnSolid,
                    { backgroundColor: colors.accent },
                    hovered && { opacity: 0.95 },
                    pressed && { opacity: 0.9 },
                  ]}
                >
                  <Text style={[styles.btnSolidTxt, { color: colors.onAccent }]}>Review Strategy</Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Dismiss insight"
                  onPress={onDismiss}
                >
                  <Text style={[styles.dismiss, { color: colors.accent }]}>Dismiss</Text>
                </Pressable>
              </View>
            </View>
            <View style={[styles.confGaugeBox, { backgroundColor: colors.bgMuted, borderColor: colors.border }]}>
              <Text style={[styles.confLabel, { color: colors.textMuted }]}>SIGNAL CONFIDENCE</Text>
              <SemiGauge
                variant="compact"
                value={model.confidencePct}
                accentColor={colors.accent}
                trackColor={colors.border}
                textColor={colors.text}
              />
              <Text style={[styles.bigPct, { color: colors.text }]}>{model.confidencePct}%</Text>
            </View>
          </View>
        </View>

        <View
          style={[styles.card, styles.rightColCard, { borderColor: colors.border, backgroundColor: colors.bgElevated }, shadows.sm]}
        >
          <Text style={[styles.cardKicker, { color: colors.textMuted }]}>Market sentiment</Text>
          <View style={styles.sentimentInner}>
            <SemiGauge
              value={model.sentimentScore}
              accentColor={colors.accent}
              trackColor={colors.border}
              textColor={colors.text}
              subtitle={sentimentLabel}
            />
          </View>
          <View style={[styles.dividerThin, { backgroundColor: colors.border }]} />
          <SentimentRow colors={colors} tone="bullish" label="Global equities" value="Bullish" />
          <SentimentRow colors={colors} tone="warning" label="Fixed income" value="Neutral" />
          <SentimentRow colors={colors} tone="positive" label="Volatility index" value="Low" />
        </View>
      </View>

      <View style={[wide ? styles.gridMid : styles.col]}>
        <View style={[styles.midLeft, styles.card, { borderColor: colors.border, backgroundColor: colors.bgElevated }, shadows.sm]}>
          <Text style={[styles.bigMoney, { color: colors.text }]}>{nwStr}</Text>
          <Text style={[styles.deltaGreen, { color: colors.positive }]}>{nwDelta}</Text>
          <InsightsPerformanceChart colors={colors} baseValue={model.netWorth} />
        </View>
        <View style={styles.midRight}>
          <View style={[styles.card, { borderColor: colors.border, backgroundColor: colors.bgElevated }, shadows.sm]}>
            <Text style={[styles.cardKicker, { color: colors.textMuted }]}>Sector allocation</Text>
            {model.sectors.length === 0 ? (
              <Text style={[styles.emptyHint, { color: colors.textSecondary }]}>Load holdings to visualize sleeve mix.</Text>
            ) : (
              model.sectors.map(([sector, pct]) => (
                <View key={sector} style={styles.sectorRow}>
                  <View style={[styles.sectorDot, { backgroundColor: sectorDotColor(sector, colors) }]} />
                  <Text style={[styles.sectorName, { color: colors.text }]} numberOfLines={1}>
                    {sector}
                  </Text>
                  <Text style={[styles.sectorPct, { color: colors.textMuted }]}>{pct.toFixed(0)}%</Text>
                </View>
              ))
            )}
          </View>

          <View style={styles.pillRow}>
            <View style={[styles.topPick, { backgroundColor: colors.accent }]}>
              <Text style={[styles.pickLabel, { color: 'rgba(255,255,255,0.88)' }]}>Top mover</Text>
              <Text style={[styles.pickValue, { color: '#ffffff' }]}>
                {model.topPerformer.symbol}{' '}
                <Text style={styles.pickValueThin}>{topPerformerStr}</Text>
              </Text>
            </View>
            <View style={[styles.riskPill, { borderColor: colors.border, backgroundColor: colors.bgMuted }]}>
              <IconGlyph icon={Lock} size={18} color={colors.textMuted} strokeWidth={2} />
              <View>
                <Text style={[styles.riskLabel, { color: colors.textMuted }]}>Risk level</Text>
                <Text style={[styles.riskValue, { color: colors.text }]}>Moderate · Balanced</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      <View style={[styles.cfiCard, { borderColor: colors.border, backgroundColor: colors.bgElevated }, shadows.sm]}>
        <View style={styles.cfiHead}>
          <View style={{ flex: 1, minWidth: 200 }}>
            <Text style={[styles.cardKicker, { color: colors.textMuted }]}>Cash flow intelligence</Text>
            <Text style={[styles.cfiSub, { color: colors.textSecondary }]}>
              Automated suggestions based on your {model.cashflowMonthLabel} spending patterns.
            </Text>
          </View>
          <Pressable accessibilityRole="button" accessibilityLabel="View monthly report">
            <View style={styles.cfiLinkRow}>
              <Text style={[styles.cfiLink, { color: colors.accent }]}>View Monthly Report</Text>
              <IconGlyph icon={ChevronRight} size={18} color={colors.accent} />
            </View>
          </Pressable>
        </View>

        <View style={[styles.cfiGrid, wide && styles.cfiGridWide]}>
          {cashCards.map((c) => (
            <View key={c.key} style={[styles.cfiMini, { borderColor: colors.border, backgroundColor: colors.bgMuted }]}>
              <View style={[styles.cfiIco, { borderColor: colors.border, backgroundColor: colors.bgElevated }]}>
                <IconGlyph icon={c.icon} size={22} color={colors.accent} strokeWidth={2} />
              </View>
              <Text style={[styles.cfiTitle, { color: colors.text }]}>{c.title}</Text>
              <Text style={[styles.cfiBody, { color: colors.textSecondary }]}>{c.body}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
});

function SentimentRow({ colors, label, tone, value }) {
  const toneColor =
    tone === 'bullish'
      ? colors.positive
      : tone === 'warning'
        ? colors.warning
        : tone === 'positive'
          ? colors.positive
          : colors.textSecondary;
  return (
    <View style={sentStyles.row}>
      <Text style={[sentStyles.lab, { color: colors.textSecondary }]}>{label}</Text>
      <Text style={[sentStyles.val, { color: toneColor }]}>{value}</Text>
    </View>
  );
}

const sentStyles = RNStyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: space.md, paddingVertical: 10 },
  lab: { fontFamily: font.sans, fontSize: 13, fontWeight: '600', flexShrink: 1 },
  val: { fontFamily: font.sans, fontSize: 13, fontWeight: '800' },
});

const styles = RNStyleSheet.create({
  page: { gap: space.lg },
  pageHead: { gap: space.xs, maxWidth: 900 },
  kickerOrg: { fontFamily: font.sans, fontSize: 12, fontWeight: '800', letterSpacing: 2.2, textTransform: 'uppercase' },
  pageTitle: { fontFamily: font.sans, fontSize: 32, fontWeight: '800', letterSpacing: -0.8 },
  pageSub: { fontFamily: font.sans, fontSize: 15, lineHeight: 22 },
  gridTop: { flexDirection: 'row', gap: space.md, alignItems: 'stretch' },
  gridMid: { flexDirection: 'row', gap: space.md, alignItems: 'flex-start' },
  col: { gap: space.md },
  card: {
    borderWidth: 1,
    borderRadius: radii.lg,
    padding: space.lg,
    gap: space.md,
  },
  signalCard: { flex: 1.4, minWidth: 280 },
  rightColCard: { flex: 1, minWidth: 260, gap: space.sm },
  signalBadgeRow: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  sigDot: { width: 8, height: 8, borderRadius: 4 },
  signalBadge: { fontFamily: font.sans, fontSize: 11, fontWeight: '800', letterSpacing: 1.2 },
  signalBody: { gap: space.md },
  signalBodyRow: { flexDirection: 'row', alignItems: 'stretch', gap: space.lg },
  signalCopy: { flex: 1, gap: space.md, minWidth: 220 },
  signalHeadline: { fontFamily: font.sans, fontSize: 20, fontWeight: '800', lineHeight: 28, letterSpacing: -0.3 },
  signalPara: { fontFamily: font.sans, fontSize: 14, lineHeight: 21 },
  signalActions: { flexDirection: 'row', alignItems: 'center', gap: space.md, flexWrap: 'wrap' },
  btnSolid: { paddingHorizontal: space.md, paddingVertical: 12, borderRadius: radii.pill },
  btnSolidTxt: { fontFamily: font.sans, fontSize: 13, fontWeight: '800' },
  dismiss: { fontFamily: font.sans, fontSize: 14, fontWeight: '700' },
  confGaugeBox: {
    borderWidth: 1,
    borderRadius: radii.md,
    padding: space.md,
    alignItems: 'center',
    minWidth: 132,
    alignSelf: 'flex-start',
  },
  confLabel: {
    fontFamily: font.sans,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    marginBottom: space.xs,
  },
  bigPct: {
    fontFamily: font.sans,
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -1,
    marginTop: space.xxs,
    fontVariant: ['tabular-nums'],
  },
  cardKicker: {
    fontFamily: font.sans,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  sentimentInner: { alignItems: 'center', paddingVertical: space.sm },
  dividerThin: { height: RNStyleSheet.hairlineWidth, width: '100%', marginVertical: space.xxs },
  midLeft: { flex: 1.65, gap: space.sm, minWidth: 300 },
  midRight: { flex: 1, gap: space.md, minWidth: 260 },
  bigMoney: {
    fontFamily: font.sans,
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -1,
    fontVariant: ['tabular-nums'],
  },
  deltaGreen: { fontFamily: font.sans, fontSize: 16, fontWeight: '800' },
  sectorRow: { flexDirection: 'row', alignItems: 'center', gap: space.sm, paddingVertical: 8 },
  sectorDot: { width: 10, height: 10, borderRadius: 5, flexShrink: 0 },
  sectorName: { flex: 1, fontFamily: font.sans, fontSize: 14, fontWeight: '700' },
  sectorPct: { fontFamily: font.sans, fontSize: 14, fontWeight: '700', fontVariant: ['tabular-nums'] },
  emptyHint: { fontFamily: font.sans, fontSize: 14, lineHeight: 20 },
  pillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  topPick: { flex: 1, padding: space.md, borderRadius: radii.md, minWidth: 140, gap: 4 },
  pickLabel: { fontFamily: font.sans, fontSize: 11, fontWeight: '700', letterSpacing: 1.2 },
  pickValue: { fontFamily: font.sans, fontSize: 18, fontWeight: '900' },
  pickValueThin: { fontFamily: font.sans, fontSize: 15, fontWeight: '700' },
  riskPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    padding: space.md,
    borderRadius: radii.md,
    borderWidth: 1,
    minWidth: 160,
  },
  riskLabel: { fontFamily: font.sans, fontSize: 10, fontWeight: '800', letterSpacing: 1.2 },
  riskValue: { fontFamily: font.sans, fontSize: 14, fontWeight: '700' },
  cfiCard: { padding: space.lg, gap: space.lg },
  cfiHead: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: space.md },
  cfiSub: { fontFamily: font.sans, fontSize: 14, lineHeight: 20, marginTop: space.xxs },
  cfiLinkRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  cfiLink: { fontFamily: font.sans, fontSize: 14, fontWeight: '800' },
  cfiGrid: { gap: space.md },
  cfiGridWide: { flexDirection: 'row', flexWrap: 'wrap' },
  cfiMini: {
    flex: 1,
    minWidth: 220,
    borderWidth: 1,
    borderRadius: radii.md,
    padding: space.md,
    gap: space.sm,
  },
  cfiIco: {
    alignSelf: 'flex-start',
    width: 44,
    height: 44,
    borderRadius: radii.sm,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cfiTitle: { fontFamily: font.sans, fontSize: 16, fontWeight: '800' },
  cfiBody: { fontFamily: font.sans, fontSize: 13, lineHeight: 19 },
});
