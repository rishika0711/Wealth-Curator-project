import { memo, useMemo, useState } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Pressable, StyleSheet as RNStyleSheet, Text, View } from 'react-native-web';
import { font, radii, space } from '../../../theme';

const RANGES = ['1M', '3M', '1Y', 'ALL'];

function buildSeries(base, range) {
  const n = range === '1M' ? 10 : range === '3M' ? 16 : range === '1Y' ? 24 : 40;
  const seed = base * 0.86;
  const out = [];
  for (let i = 0; i < n; i += 1) {
    const wobble = Math.sin(i * 0.65) * base * 0.014;
    const v = seed + (base - seed) * (i / Math.max(1, n - 1)) + wobble;
    out.push({
      label: i,
      v: Math.round(v),
    });
  }
  return out;
}

export const InsightsPerformanceChart = memo(function InsightsPerformanceChart({ colors, baseValue }) {
  const [range, setRange] = useState('3M');
  const data = useMemo(() => buildSeries(baseValue, range), [baseValue, range]);
  const fmt = (v) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(
      Number(v),
    );

  return (
    <View style={styles.wrap}>
      <View style={styles.chartHead}>
        <Text style={[styles.chartKicker, { color: colors.textMuted }]} accessibilityRole="text">
          Portfolio performance
        </Text>
        <View style={styles.toggles} accessibilityRole="tablist">
          {RANGES.map((r) => {
            const on = range === r;
            return (
              <Pressable
                key={r}
                accessibilityRole="tab"
                accessibilityState={{ selected: on }}
                onPress={() => setRange(r)}
                style={({ pressed }) => [
                  styles.tb,
                  { backgroundColor: on ? colors.bgMuted : colors.bgElevated },
                  pressed && { opacity: 0.9 },
                ]}
              >
                <Text style={[styles.tbTxt, { color: on ? colors.text : colors.textMuted }]}>{r}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>
      <View style={[styles.chartCard, { borderColor: colors.border, backgroundColor: colors.bgMuted }]}>
        <div style={{ width: '100%', height: 240, fontFamily: font.sans }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ left: -12, right: 8, top: 8, bottom: 0 }}>
              <defs>
                <linearGradient id="insPvFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={colors.accent} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={colors.accent} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={colors.border} strokeDasharray="4 8" vertical={false} />
              <XAxis dataKey="label" hide />
              <YAxis hide domain={['auto', 'auto']} />
              <Tooltip
                formatter={(value) => [fmt(Number(value)), 'Portfolio']}
                labelFormatter={() => 'Snapshot'}
                contentStyle={{
                  backgroundColor: colors.bgElevated,
                  border: `1px solid ${colors.border}`,
                  borderRadius: radii.sm,
                  color: colors.text,
                  fontSize: 12,
                  fontFamily: font.sans,
                }}
              />
              <Area
                type="monotone"
                dataKey="v"
                stroke={colors.accent}
                strokeWidth={2}
                fill="url(#insPvFill)"
                isAnimationActive={false}
                dot={{ r: 0 }}
                activeDot={{ r: 5, stroke: colors.bgElevated, strokeWidth: 2, fill: colors.accent }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </View>
    </View>
  );
});

const styles = RNStyleSheet.create({
  wrap: { gap: space.sm },
  chartHead: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: space.sm },
  chartKicker: {
    fontFamily: font.sans,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  toggles: { flexDirection: 'row', gap: space.xxs, flexWrap: 'wrap' },
  tb: { paddingHorizontal: space.sm + 4, paddingVertical: 8, borderRadius: radii.pill },
  tbTxt: { fontFamily: font.sans, fontSize: 12, fontWeight: '800', letterSpacing: 0.5 },
  chartCard: { borderWidth: 1, borderRadius: radii.md, overflow: 'hidden', paddingHorizontal: space.xs },
});
