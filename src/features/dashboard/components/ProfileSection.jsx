import { memo } from 'react';
import { Pressable, StyleSheet as RNStyleSheet, Text, View } from 'react-native-web';
import { font, radii, space } from '../../../theme';

export const ProfileSection = memo(function ProfileSection({
  colors,
  user,
  onEditProfile,
  onSecurity,
  onSignOut,
  nativeID,
  showCloseButton,
  onRequestClose,
}) {
  const rootProps = nativeID ? { nativeID } : {};

  return (
    <View {...rootProps} style={styles.wrap}>
      <View style={styles.titleRow}>
        <View style={styles.titleBlock}>
          <Text style={[styles.title, { color: colors.text }]} accessibilityRole="header">
            Profile
          </Text>
          <Text style={[styles.sub, { color: colors.textMuted }]}>Your relationship team and account preferences.</Text>
        </View>
        {showCloseButton && onRequestClose ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close profile"
            onPress={onRequestClose}
            style={({ pressed, hovered }) => [
              styles.closeBtn,
              { borderColor: colors.border, backgroundColor: colors.bgMuted },
              hovered && { opacity: 0.95 },
              pressed && { opacity: 0.88 },
            ]}
          >
            <Text style={[styles.closeBtnText, { color: colors.text }]}>✕</Text>
          </Pressable>
        ) : null}
      </View>

      <View style={[styles.card, { borderColor: colors.border, backgroundColor: colors.bgElevated }]}>
        <View style={styles.headerRow}>
          <View style={[styles.avatarLg, { backgroundColor: user.avatarColor, borderColor: colors.border }]}>
            <Text style={styles.avatarLgText}>{user.initials}</Text>
          </View>
          <View style={styles.headerText}>
            <Text style={[styles.name, { color: colors.text }]}>{user.name}</Text>
            <Text style={[styles.plan, { color: colors.accent }]}>{user.planTier}</Text>
            <Text style={[styles.member, { color: colors.textSecondary }]}>{user.memberSince}</Text>
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <View style={styles.rows}>
          <Row label="Email" value={user.email} colors={colors} />
          {user.phone ? <Row label="Phone" value={user.phone} colors={colors} /> : null}
        </View>

        <View style={styles.actions}>
          <SecondaryBtn label="Edit profile" colors={colors} onPress={onEditProfile} />
          <SecondaryBtn label="Security" colors={colors} onPress={onSecurity} />
          <PrimaryBtn label="Sign out" colors={colors} onPress={onSignOut} />
        </View>
      </View>
    </View>
  );
});

function Row({ label, value, colors }) {
  return (
    <View style={styles.rowItem}>
      <Text style={[styles.rowLabel, { color: colors.textMuted }]}>{label}</Text>
      <Text style={[styles.rowValue, { color: colors.text }]}>{value}</Text>
    </View>
  );
}

function PrimaryBtn({ label, colors, onPress }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed, hovered }) => [
        styles.btnPrimary,
        { backgroundColor: colors.accent },
        hovered && { opacity: 0.95 },
        pressed && { opacity: 0.9 },
      ]}
    >
      <Text style={[styles.btnPrimaryText, { color: colors.onAccent }]}>{label}</Text>
    </Pressable>
  );
}

function SecondaryBtn({ label, colors, onPress }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed, hovered }) => [
        styles.btnGhost,
        { borderColor: colors.border, backgroundColor: colors.bgMuted },
        hovered && { opacity: 0.95 },
        pressed && { opacity: 0.88 },
      ]}
    >
      <Text style={[styles.btnGhostText, { color: colors.text }]}>{label}</Text>
    </Pressable>
  );
}

const styles = RNStyleSheet.create({
  wrap: { gap: space.sm },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: space.md,
  },
  titleBlock: { flex: 1, gap: space.xs, minWidth: 0 },
  title: { fontFamily: font.serif, fontSize: 26 },
  sub: { fontFamily: font.sans, fontSize: 14, lineHeight: 20, maxWidth: 720 },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 4,
  },
  closeBtnText: { fontFamily: font.sans, fontSize: 18, fontWeight: '600', lineHeight: 20 },
  card: { borderWidth: 1, borderRadius: radii.lg, padding: space.lg, gap: space.md },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: space.md, flexWrap: 'wrap' },
  avatarLg: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLgText: { fontFamily: font.sans, fontSize: 22, fontWeight: '800', color: '#fff' },
  headerText: { flex: 1, gap: 4, minWidth: 200 },
  name: { fontFamily: font.serif, fontSize: 24 },
  plan: { fontFamily: font.sans, fontSize: 13, fontWeight: '800', letterSpacing: 0.3 },
  member: { fontFamily: font.sans, fontSize: 13 },
  divider: { height: RNStyleSheet.hairlineWidth },
  rows: { gap: space.md },
  rowItem: { gap: 4 },
  rowLabel: { fontFamily: font.sans, fontSize: 11, fontWeight: '800', letterSpacing: 1.2, textTransform: 'uppercase' },
  rowValue: { fontFamily: font.sans, fontSize: 15 },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm, marginTop: space.sm },
  btnPrimary: { paddingHorizontal: space.md, paddingVertical: 12, borderRadius: radii.pill },
  btnPrimaryText: { fontFamily: font.sans, fontSize: 13, fontWeight: '800' },
  btnGhost: { paddingHorizontal: space.md, paddingVertical: 12, borderRadius: radii.pill, borderWidth: 1 },
  btnGhostText: { fontFamily: font.sans, fontSize: 13, fontWeight: '700' },
});
