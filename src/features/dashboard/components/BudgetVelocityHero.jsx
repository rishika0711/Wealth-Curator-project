import { memo, useMemo } from 'react';
import { Pressable, StyleSheet as RNStyleSheet, Text, View, useWindowDimensions } from 'react-native-web';
import { font, radii, space } from '../../../theme';

export const BudgetVelocityHero = memo(function BudgetVelocityHero({ colors, summary, onAdjust }) {
  const { width } = useWindowDimensions();
  const isWide = width > 900;
  const { spentUsd, limitUsd, pct, surplusUsd, velocityLabel } = useMemo(() => {
    const limit = 15000;
    const spent = typeof summary.rawSpending === 'number' ? Math.min(summary.rawSpending, limit * 1.05) : 8420;
    const pctVal = Math.min(99, Math.round((spent / limit) * 100));
    const surplus = Math.max(0, limit - spent);
    const nf = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
    return {
      spentUsd: nf.format(spent),
      limitUsd: nf.format(limit),
      pct: pctVal,
      surplusUsd: nf.format(surplus),
      velocityLabel: `${pctVal}% of monthly limit reached`,
    };
  }, [summary.rawSpending]);

  const efficiency = summary.savingsRate || '94.2%';

  return (
    <View style={styles.outer}>
      <View style={[styles.splitLayout, isWide ? styles.splitWide : styles.splitNarrow]}>
        <View
          style={[
            styles.hero,
            { borderColor: colors.border, backgroundColor: colors.bgElevated },
            isWide ? { flex: 1.8 } : { width: '100%' },
          ]}
        >
          <Text style={[styles.kicker, { color: colors.accent }]}>Total budget velocity</Text>
          <Text style={[styles.bigValue, { color: colors.text }]} accessibilityRole="header">
            {spentUsd} / {limitUsd}
          </Text>
          <View style={[styles.track, { backgroundColor: colors.bgMuted }]}>
            <View style={[styles.fill, { width: `${pct}%`, backgroundColor: colors.accent }]} />
          </View>
          <View style={styles.heroFooter}>
            <Text style={[styles.footerLeft, { color: colors.textSecondary }]}>{velocityLabel}</Text>
            <Text style={[styles.footerRight, { color: colors.accent }]}>12 days remaining</Text>
          </View>
        </View>
        <View style={[styles.sideStack, isWide ? styles.sideColumn : styles.sideRow]}>
          <View style={[styles.statCard, { borderColor: colors.border, backgroundColor: colors.bgElevated }]}>
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>Projected surplus</Text>
            <Text style={[styles.statValue, { color: colors.positive }]}>+{surplusUsd}</Text>
          </View>
          <View style={[styles.statCard, { borderColor: colors.border, backgroundColor: colors.bgElevated }]}>
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>Savings efficiency</Text>
            <Text style={[styles.statValue, { color: colors.warning }]}>{efficiency}</Text>
          </View>
        </View>
      </View>
      {onAdjust ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Adjust limits"
          onPress={onAdjust}
          style={({ hovered, pressed }) => [
            styles.ctaFab,
            { backgroundColor: colors.accent },
            hovered && { opacity: 0.95 },
            pressed && { opacity: 0.9 },
          ]}
        >
          <Text style={[styles.ctaFabText, { color: colors.onAccent }]}>+ Adjust limits</Text>
        </Pressable>
      ) : null}
    </View>
  );
});

const styles = RNStyleSheet.create({
  outer: {
    gap: space.md,
  },
  splitLayout: {
    gap: space.md,
  },
  splitWide: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  splitNarrow: {
    flexDirection: 'column',
  },
  hero: {
    borderWidth: 1,
    borderRadius: radii.lg,
    padding: space.lg,
    gap: space.sm,
    minWidth: 0,
    minHeight: 180,
  },
  kicker: {
    fontFamily: font.sans,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  bigValue: {
    fontFamily: font.sans,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
    fontVariant: ['tabular-nums'],
  },
  track: {
    height: 12,
    borderRadius: radii.pill,
    overflow: 'hidden',
    marginTop: space.xs,
  },
  fill: {
    height: '100%',
    borderRadius: radii.pill,
  },
  heroFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 'auto',
    gap: space.md,
    flexWrap: 'wrap',
  },
  footerLeft: { fontFamily: font.sans, fontSize: 13, fontWeight: '600', flexShrink: 1 },
  footerRight: { fontFamily: font.sans, fontSize: 13, fontWeight: '800' },
  sideStack: { gap: space.md, flexShrink: 0 },
  sideColumn: { flex: 1, minWidth: 200, justifyContent: 'space-between' },
  sideRow: { flexDirection: 'row', flexWrap: 'wrap' },
  statCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: radii.lg,
    padding: space.md,
    gap: space.xxs,
    minHeight: 88,
    justifyContent: 'center',
  },
  statLabel: {
    fontFamily: font.sans,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  statValue: {
    fontFamily: font.sans,
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
    fontVariant: ['tabular-nums'],
  },
  ctaFab: {
    alignSelf: 'flex-end',
    paddingHorizontal: space.md,
    paddingVertical: 12,
    borderRadius: radii.pill,
    marginLeft: 'auto',
  },
  ctaFabText: { fontFamily: font.sans, fontSize: 13, fontWeight: '800', letterSpacing: 0.2 },
});
