import { Pressable, StyleSheet as RNStyleSheet, Text, View } from 'react-native-web';
import { font, radii, space } from '../../theme';

export function ErrorState({ colors, title, message, actionLabel, onAction }) {
  return (
    <View
      style={[styles.wrap, { borderColor: colors.border, backgroundColor: colors.bgElevated }]}
      accessibilityRole="alert"
    >
      <Text style={[styles.title, { color: colors.text }]} accessibilityRole="header">
        {title}
      </Text>
      <Text style={[styles.message, { color: colors.textSecondary }]}>{message}</Text>
      {actionLabel && onAction ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
          onPress={onAction}
          style={(s) => [
            styles.btn,
            { borderColor: colors.accent, backgroundColor: colors.accentMuted },
            s.hovered && styles.btnHover,
            s.pressed && styles.btnPressed,
          ]}
        >
          <Text style={[styles.btnText, { color: colors.text }]}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = RNStyleSheet.create({
  wrap: {
    padding: space.lg,
    borderRadius: radii.lg,
    borderWidth: 1,
    gap: space.sm,
    maxWidth: 560,
  },
  title: {
    fontFamily: font.sans,
    fontSize: 18,
    fontWeight: '700',
  },
  message: {
    fontFamily: font.sans,
    fontSize: 15,
    lineHeight: 22,
  },
  btn: {
    marginTop: space.sm,
    alignSelf: 'flex-start',
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    borderRadius: radii.pill,
    borderWidth: 1,
  },
  btnHover: { opacity: 0.95 },
  btnPressed: { opacity: 0.85 },
  btnText: {
    fontFamily: font.sans,
    fontSize: 14,
    fontWeight: '600',
  },
});
