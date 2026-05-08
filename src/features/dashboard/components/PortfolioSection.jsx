import { LineChart } from 'lucide-react';
import { memo } from 'react';
import { StyleSheet as RNStyleSheet, Text, View } from 'react-native-web';
import { IconGlyph } from '../../../components/icons/IconGlyph.jsx';
import { font, radii, space } from '../../../theme';

export const PortfolioSection = memo(function PortfolioSection({ colors, holdings }) {
  const sorted = [...holdings].sort((a, b) => b.weightPct - a.weightPct);

  return (
    <View nativeID="section-portfolio" style={styles.wrap}>
      <View style={styles.headingRow} accessibilityRole="header">
        <IconGlyph icon={LineChart} size={24} color={colors.accent} strokeWidth={2} />
        <Text style={[styles.title, { color: colors.text }]} accessibilityRole="text">
          Portfolio
        </Text>
      </View>
      <Text style={[styles.sub, { color: colors.textMuted }]}>
        Public sleeve weights — use navigation to reconcile with your policy targets.
      </Text>
      {sorted.length === 0 ? (
        <Text style={[styles.empty, { color: colors.textSecondary }]}>
          No live positions surfaced — sync custodians to populate sleeve weights.
        </Text>
      ) : (
        <View style={[styles.card, { borderColor: colors.border, backgroundColor: colors.bgElevated }]}>
          <View style={[styles.headRow, { borderBottomColor: colors.border }]}>
            <Text style={[styles.th, styles.colSym, { color: colors.textMuted }]}>Symbol</Text>
            <Text style={[styles.th, styles.colName, { color: colors.textMuted }]}>Name</Text>
            <Text style={[styles.th, styles.colSec, { color: colors.textMuted }]}>Sector</Text>
            <Text style={[styles.th, styles.colPct, { color: colors.textMuted }]}>Weight</Text>
          </View>
          {sorted.map((h) => {
            const drift = h.weightPct - h.prevWeightPct;
            const driftStr = `${drift >= 0 ? '+' : ''}${drift.toFixed(1)}%`;
            return (
              <View
                key={h.id}
                style={[styles.row, { borderTopColor: colors.border }]}
                accessibilityLabel={`${h.symbol}, ${h.name}, ${h.weightPct} percent`}
              >
                <Text style={[styles.td, styles.colSym, { color: colors.accent, fontWeight: '800' }]}>{h.symbol}</Text>
                <Text style={[styles.td, styles.colName, { color: colors.text }]} numberOfLines={2}>
                  {h.name}
                </Text>
                <Text style={[styles.td, styles.colSec, { color: colors.textSecondary }]}>{h.sector}</Text>
                <View style={styles.colPct}>
                  <Text style={[styles.td, { color: colors.text, fontVariant: ['tabular-nums'] }]}>
                    {h.weightPct.toFixed(1)}%
                  </Text>
                  <Text style={[styles.drift, { color: drift >= 0 ? colors.positive : colors.negative }]}>{driftStr}</Text>
                </View>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
});

const styles = RNStyleSheet.create({
  wrap: { gap: space.sm },
  headingRow: { flexDirection: 'row', alignItems: 'center', gap: space.sm, flexWrap: 'wrap' },
  title: { fontFamily: font.serif, fontSize: 26 },
  sub: { fontFamily: font.sans, fontSize: 14, lineHeight: 20, maxWidth: 720 },
  empty: { fontFamily: font.sans, fontSize: 14, lineHeight: 20 },
  card: { borderWidth: 1, borderRadius: radii.lg, overflow: 'hidden' },
  headRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    borderBottomWidth: RNStyleSheet.hairlineWidth,
    gap: space.sm,
  },
  th: { fontFamily: font.sans, fontSize: 10, fontWeight: '800', letterSpacing: 1.1, textTransform: 'uppercase' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: space.md,
    paddingVertical: space.md,
    borderTopWidth: RNStyleSheet.hairlineWidth,
    gap: space.sm,
  },
  td: { fontFamily: font.sans, fontSize: 13 },
  colSym: { width: 56, flexShrink: 0 },
  colName: { flex: 1.2, minWidth: 100 },
  colSec: { width: 88, flexShrink: 0 },
  colPct: { width: 80, alignItems: 'flex-end' },
  drift: { fontFamily: font.sans, fontSize: 11, fontWeight: '700', marginTop: 2 },
});
