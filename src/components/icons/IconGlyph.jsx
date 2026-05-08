import { View } from 'react-native-web';

/**
 * Fixed-size box for Lucide SVG icons inside RN Web layouts.
 * Pair with visible text for accessibility; icons are decorative (aria-hidden on SVG).
 */
export function IconGlyph({ icon: Icon, size = 18, color, strokeWidth = 2 }) {
  return (
    <View
      pointerEvents="none"
      style={{
        width: size,
        height: size,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Icon size={size} color={color} strokeWidth={strokeWidth} aria-hidden />
    </View>
  );
}
