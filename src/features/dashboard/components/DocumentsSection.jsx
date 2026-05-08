import { ChevronRight, FileText } from 'lucide-react';
import { memo } from 'react';
import { Pressable, StyleSheet as RNStyleSheet, Text, View } from 'react-native-web';
import { IconGlyph } from '../../../components/icons/IconGlyph.jsx';
import { font, radii, space } from '../../../theme';

export const DocumentsSection = memo(function DocumentsSection({ colors, documents, onOpen }) {
  return (
    <View nativeID="section-documents" style={styles.wrap}>
      <View style={styles.headingRow} accessibilityRole="header">
        <IconGlyph icon={FileText} size={24} color={colors.accent} strokeWidth={2} />
        <Text style={[styles.title, { color: colors.text }]} accessibilityRole="text">
          Documents
        </Text>
      </View>
      <Text style={[styles.sub, { color: colors.textMuted }]}>
        Statements, tax exports, and compliance items — vault-grade retention (demo).
      </Text>
      {documents.length === 0 ? (
        <Text style={[styles.empty, { color: colors.textSecondary }]}>
          No filings yet — connect your vault or upload statements to populate this rail.
        </Text>
      ) : null}
      {documents.length > 0 ? (
        <View style={[styles.list, { borderColor: colors.border, backgroundColor: colors.bgElevated }]}>
          {documents.map((doc) => (
            <Pressable
              key={doc.id}
              accessibilityRole="button"
              accessibilityLabel={`Open ${doc.title}`}
              onPress={() => onOpen?.(doc.id)}
              style={({ pressed, hovered }) => [
                styles.row,
                { borderBottomColor: colors.border, backgroundColor: colors.bgElevated },
                hovered && { backgroundColor: colors.bgMuted },
                pressed && { opacity: 0.92 },
              ]}
            >
              <View style={styles.rowMain}>
                <Text style={[styles.docTitle, { color: colors.text }]} numberOfLines={2}>
                  {doc.title}
                </Text>
                <Text style={[styles.meta, { color: colors.textMuted }]}>
                  {doc.type} · Updated {doc.updatedAt}
                </Text>
              </View>
              <View style={styles.rowRight}>
                <View
                  style={[
                    styles.badge,
                    {
                      borderColor: doc.status === 'ready' ? colors.accentMuted : colors.border,
                      backgroundColor: doc.status === 'ready' ? colors.accentMuted : colors.bgMuted,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.badgeText,
                      { color: doc.status === 'ready' ? colors.text : colors.textSecondary },
                    ]}
                  >
                    {doc.status === 'ready' ? 'Ready' : 'Pending'}
                  </Text>
                </View>
                <IconGlyph icon={ChevronRight} size={18} color={colors.textMuted} />
              </View>
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
});

const styles = RNStyleSheet.create({
  wrap: { gap: space.sm },
  headingRow: { flexDirection: 'row', alignItems: 'center', gap: space.sm, flexWrap: 'wrap' },
  title: { fontFamily: font.serif, fontSize: 26 },
  sub: { fontFamily: font.sans, fontSize: 14, lineHeight: 20, maxWidth: 720 },
  empty: { fontFamily: font.sans, fontSize: 14, lineHeight: 20 },
  list: { borderWidth: 1, borderRadius: radii.lg, overflow: 'hidden' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space.md,
    paddingHorizontal: space.md,
    paddingVertical: space.md,
    borderBottomWidth: RNStyleSheet.hairlineWidth,
  },
  rowMain: { flex: 1, gap: 4, minWidth: 0 },
  rowRight: { flexDirection: 'row', alignItems: 'center', gap: space.sm, flexShrink: 0 },
  docTitle: { fontFamily: font.sans, fontSize: 14, fontWeight: '700' },
  meta: { fontFamily: font.sans, fontSize: 12 },
  badge: {
    paddingHorizontal: space.sm,
    paddingVertical: 6,
    borderRadius: radii.pill,
    borderWidth: 1,
    flexShrink: 0,
  },
  badgeText: { fontFamily: font.sans, fontSize: 11, fontWeight: '800', letterSpacing: 0.4, textTransform: 'uppercase' },
});
