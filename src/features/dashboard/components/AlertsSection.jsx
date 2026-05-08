import { BellRing } from 'lucide-react';
import { memo } from 'react';
import { Pressable, StyleSheet as RNStyleSheet, Text, View } from 'react-native-web';
import { IconGlyph } from '../../../components/icons/IconGlyph.jsx';
import { font, radii, space } from '../../../theme';

export const AlertsSection = memo(function AlertsSection({ colors, alerts, onAlertCta }) {
  return (
    <View style={styles.section}>
      <View style={styles.headingRow} accessibilityRole="header">
        <IconGlyph icon={BellRing} size={22} color={colors.accent} strokeWidth={2} />
        <Text style={[styles.title, { color: colors.text }]} accessibilityRole="text">
          Proactive alerts
        </Text>
      </View>
      {alerts.length === 0 ? (
        <Text style={[styles.empty, { color: colors.textSecondary }]}>
          You are clear — we will pulse here when cash, FX, or policy drift warrants attention.
        </Text>
      ) : null}
      <View style={styles.list} accessibilityRole="list">
        {alerts.map((a) => (
          <View
            key={a.id}
            style={[styles.item, { borderColor: colors.border, backgroundColor: colors.bgElevated }, severityBorder(a.severity, colors)]}
            accessibilityRole="summary"
            accessibilityLabel={`${a.title}. ${a.body}`}
          >
            <Text style={[styles.itemTitle, { color: colors.text }]}>{a.title}</Text>
            <Text style={[styles.itemBody, { color: colors.textSecondary }]}>{a.body}</Text>
            {a.ctaLabel && onAlertCta ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={a.ctaLabel}
                onPress={() => onAlertCta(a.id)}
                style={({ hovered, pressed }) => [
                  styles.cta,
                  { borderColor: colors.accentMuted, backgroundColor: colors.bgMuted },
                  hovered && { opacity: 0.95 },
                  pressed && { opacity: 0.88 },
                ]}
              >
                <Text style={[styles.ctaText, { color: colors.accent }]}>{a.ctaLabel}</Text>
              </Pressable>
            ) : null}
          </View>
        ))}
      </View>
    </View>
  );
});

function severityBorder(severity, colors) {
  if (severity === 'critical') return { borderLeftWidth: 4, borderLeftColor: colors.negative };
  if (severity === 'warning') return { borderLeftWidth: 4, borderLeftColor: colors.warning };
  return { borderLeftWidth: 4, borderLeftColor: colors.accent };
}

const styles = RNStyleSheet.create({
  section: { gap: space.sm },
  headingRow: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  title: { fontFamily: font.serif, fontSize: 22 },
  empty: { fontFamily: font.sans, fontSize: 14, lineHeight: 20 },
  list: { gap: space.sm },
  item: {
    borderWidth: 1,
    borderRadius: radii.md,
    padding: space.md,
    gap: space.xs,
  },
  itemTitle: { fontFamily: font.sans, fontSize: 15, fontWeight: '800' },
  itemBody: { fontFamily: font.sans, fontSize: 14, lineHeight: 20 },
  cta: {
    alignSelf: 'flex-start',
    marginTop: space.sm,
    borderWidth: 1,
    borderRadius: radii.pill,
    paddingHorizontal: space.md,
    paddingVertical: 8,
  },
  ctaText: { fontFamily: font.sans, fontSize: 12, fontWeight: '800', letterSpacing: 0.3 },
});
