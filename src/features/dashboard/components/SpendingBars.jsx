import { PieChart } from 'lucide-react';
import { lazy, memo, Suspense, useMemo } from 'react';
import { StyleSheet as RNStyleSheet, Text, View } from 'react-native-web';
import { IconGlyph } from '../../../components/icons/IconGlyph.jsx';
import { font, radii, space } from '../../../theme';

const SpendingRecharts = lazy(() => import('./SpendingRecharts'));

export const SpendingBars = memo(function SpendingBars({ colors, slices }) {
  const max = useMemo(() => Math.max(...slices.map((s) => s.amount), 1), [slices]);

  return (
    <View style={styles.section}>
      <View style={styles.headingRow}>
        <IconGlyph icon={PieChart} size={22} color={colors.accent} strokeWidth={2} />
        <View style={styles.headingText}>
          <Text style={[styles.title, { color: colors.text }]} accessibilityRole="header">
            Category allocation
          </Text>
          <Text style={[styles.sub, { color: colors.accent }]} accessibilityRole="link">
            View all categories
          </Text>
        </View>
      </View>
      <Text style={[styles.sectionCaption, { color: colors.textMuted }]}>Category share of modeled monthly outflows</Text>

      {slices.length === 0 ? (
        <Text style={[styles.empty, { color: colors.textSecondary }]}>
          No categorized spend yet — ingest cards or statements to visualize sleeves.
        </Text>
      ) : null}

      <View style={[styles.card, { borderColor: colors.border, backgroundColor: colors.bgElevated }]}>
        {slices.map((s) => (
          <View key={s.category} style={styles.row} accessibilityLabel={`${s.category}, ${s.pct} percent`}>
            <View style={styles.rowLeft}>
              <Text style={[styles.cat, { color: colors.text }]}>{s.category}</Text>
              <Text style={[styles.pct, { color: colors.textMuted }]}>{s.pct}%</Text>
            </View>
            <View style={[styles.track, { backgroundColor: colors.bgMuted }]}>
              <View
                style={[
                  styles.fill,
                  {
                    width: `${Math.round((s.amount / max) * 100)}%`,
                    backgroundColor: colors.accent,
                  },
                ]}
              />
            </View>
            <Text style={[styles.amt, { color: colors.textSecondary }]}>
              {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(
                s.amount,
              )}
            </Text>
          </View>
        ))}

        {slices.length > 0 ? (
          <Suspense fallback={<LoadingChart colors={colors} />}>
            <View accessibilityLabel="Spending donut chart summary" accessibilityRole="image">
              <SpendingRecharts colors={colors} slices={slices} />
            </View>
          </Suspense>
        ) : null}
      </View>
    </View>
  );
});

function LoadingChart({ colors }) {
  return (
    <Text style={[styles.lazyHint, { color: colors.textMuted }]} accessibilityRole="text">
      Loading chart…
    </Text>
  );
}

const styles = RNStyleSheet.create({
  section: { gap: space.xs },
  headingRow: { flexDirection: 'row', alignItems: 'flex-start', gap: space.sm, flexWrap: 'wrap' },
  headingText: { gap: space.xxs, flex: 1, minWidth: 0 },
  title: { fontFamily: font.sans, fontSize: 22, fontWeight: '800' },
  sub: {
    fontFamily: font.sans,
    fontSize: 13,
    fontWeight: '700',
  },
  sectionCaption: { fontFamily: font.sans, fontSize: 13, marginBottom: space.sm },
  empty: { fontFamily: font.sans, fontSize: 14, lineHeight: 20 },
  card: { borderWidth: 1, borderRadius: radii.lg, padding: space.md, gap: space.md },
  row: { gap: space.xs },
  rowLeft: { flexDirection: 'row', justifyContent: 'space-between' },
  cat: { fontFamily: font.sans, fontSize: 13, fontWeight: '700' },
  pct: { fontFamily: font.sans, fontSize: 12, fontWeight: '700' },
  track: { height: 8, borderRadius: radii.pill, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: radii.pill },
  amt: { fontFamily: font.sans, fontSize: 12, fontWeight: '600' },
  lazyHint: { paddingVertical: space.md, textAlign: 'center', fontFamily: font.sans, fontSize: 13 },
});
