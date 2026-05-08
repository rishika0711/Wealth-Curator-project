import { memo, useMemo } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { font } from '../../../theme';

function formatMoney(amount) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
}

function slicePalette(colors) {
  return [
    colors.accent,
    colors.positive,
    colors.warning,
    '#6b9bd1',
    colors.negative,
    colors.textMuted,
    colors.textSecondary,
  ];
}

const SpendingRecharts = memo(function SpendingRecharts({ colors, slices }) {
  const data = useMemo(() => slices.map((s) => ({ name: s.category, value: s.amount, pct: s.pct })), [slices]);
  const palette = useMemo(() => slicePalette(colors), [colors]);

  return (
    <div style={{ width: '100%', height: 260, fontFamily: font.sans }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={68}
            outerRadius={96}
            paddingAngle={2}
            stroke={colors.border}
            strokeWidth={1}
            isAnimationActive={false}
          >
            {data.map((_, i) => (
              <Cell key={data[i]?.name ?? i} fill={palette[i % palette.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => formatMoney(Number(Array.isArray(value) ? value[0] : value))}
            labelFormatter={(label) => String(label)}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
});

export default SpendingRecharts;
