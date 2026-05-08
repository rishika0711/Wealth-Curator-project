import { ActivityIndicator, StyleSheet as RNStyleSheet, Text, View } from 'react-native-web';
import { font, space } from '../../theme';

export function LoadingState({ colors, label = 'Curating your financial picture…' }) {
  return (
    <View style={styles.wrap} accessibilityRole="progressbar" accessibilityLabel={label}>
      <ActivityIndicator color={colors.accent} />
      <Text style={[styles.caption, { color: colors.textMuted }]}>{label}</Text>
    </View>
  );
}

const styles = RNStyleSheet.create({
  wrap: {
    paddingVertical: space.xxl,
    alignItems: 'center',
    gap: space.md,
  },
  caption: {
    fontFamily: font.sans,
    fontSize: 14,
  },
});
