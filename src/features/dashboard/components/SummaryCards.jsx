import { Landmark, PiggyBank, Receipt } from 'lucide-react';
import { memo } from 'react';
import { StyleSheet as RNStyleSheet, Text, View } from 'react-native-web';
import { IconGlyph } from '../../../components/icons/IconGlyph.jsx';
import { font, radii, space } from '../../../theme';

export const SummaryCards = memo(function SummaryCards({ colors, summary }) {
  return (
    <View style={styles.grid} accessibilityRole="text" accessibilityLabel="Financial summary">
      <Card colors={colors} icon={Landmark} label="Net worth" value={summary.netWorth} hint={summary.netWorthDelta} accent />
      <Card colors={colors} icon={Receipt} label="Monthly spending" value={summary.spending} hint={summary.spendingDelta} />
      <Card colors={colors} icon={PiggyBank} label="Savings rate" value={summary.savingsRate} hint={summary.savingsDelta} />
    </View>
  );
});

function Card({ colors, label, value, hint, accent, icon: MetricIcon }) {
  return (
    <View
      style={[
        styles.card,
        {
          borderColor: colors.border,
          backgroundColor: colors.bgElevated,
        },
        accent && { borderColor: colors.accentMuted },
      ]}
      accessibilityLabel={`${label}: ${value}. ${hint}`}
    >
      <View style={styles.cardHead}>
        <IconGlyph icon={MetricIcon} size={22} color={accent ? colors.accent : colors.textMuted} strokeWidth={2} />
        <Text style={[styles.label, { color: colors.textMuted }]}>{label.toUpperCase()}</Text>
      </View>
      <Text style={[styles.value, { color: colors.text }]}>{value}</Text>
      <Text style={[styles.hint, { color: colors.textSecondary }]}>{hint}</Text>
    </View>
  );
}

const styles = RNStyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.md,
  },
  card: {
    flexGrow: 1,
    flexBasis: 240,
    padding: space.lg,
    borderRadius: radii.lg,
    borderWidth: 1,
    gap: space.xs,
    minHeight: 120,
  },
  cardHead: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  label: {
    fontFamily: font.sans,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.4,
  },
  value: {
    fontFamily: font.sans,
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.8,
    marginTop: space.xs,
    fontVariant: ['tabular-nums'],
  },
  hint: {
    fontFamily: font.sans,
    fontSize: 13,
    fontWeight: '600',
    marginTop: 'auto',
  },
});
