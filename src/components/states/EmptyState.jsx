import { StyleSheet as RNStyleSheet, Text, View } from 'react-native-web';
import { font, radii, space } from '../../theme';

export function EmptyState({ colors, message = 'No records match your filters.' }) {
  return (
    <View
      style={[styles.wrap, { borderColor: colors.border, backgroundColor: colors.bgMuted }]}
      accessibilityRole="text"
    >
      <Text style={[styles.text, { color: colors.textSecondary }]}>{message}</Text>
    </View>
  );
}

const styles = RNStyleSheet.create({
  wrap: {
    padding: space.lg,
    borderRadius: radii.md,
    borderWidth: 1,
  },
  text: {
    fontFamily: font.sans,
    fontSize: 15,
    textAlign: 'center',
  },
});
