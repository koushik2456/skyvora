import React from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Tractor,
  Bell,
  Languages,
  Phone,
  FileText,
  LogOut,
  ChevronRight,
  BadgeCheck,
} from 'lucide-react-native';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { useAuthStore } from '@/store/authStore';

export default function ProfileScreen() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const [push, setPush] = React.useState(true);
  const [sms, setSms] = React.useState(true);

  const initials = (user?.name ?? 'F')
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const confirmLogout = () =>
    Alert.alert('Log out?', 'You will need to verify your number again.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log out', style: 'destructive', onPress: logout },
    ]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{user?.name ?? 'Farmer'}</Text>
            <View style={styles.phoneRow}>
              <Text style={styles.phone}>{user?.phone ?? '+91 ----------'}</Text>
              <View style={styles.verifiedChip}>
                <BadgeCheck size={12} color={Colors.success} />
                <Text style={styles.verifiedText}>Verified</Text>
              </View>
            </View>
            <Text style={styles.memberSince}>
              Member since{' '}
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString('en-IN', {
                    month: 'short',
                    year: 'numeric',
                  })
                : '—'}
            </Text>
          </View>
        </View>

        <SettingsGroup title="My Farm">
          <SettingRow icon={Tractor} label="Default location" value="Telangana" />
          <SettingRow icon={Tractor} label="Primary crop" value="Cotton" />
        </SettingsGroup>

        <SettingsGroup title="Notifications">
          <ToggleRow icon={Bell} label="Push notifications" value={push} onChange={setPush} />
          <ToggleRow icon={Bell} label="SMS alerts" value={sms} onChange={setSms} />
        </SettingsGroup>

        <SettingsGroup title="Preferences">
          <SettingRow icon={Languages} label="Language" value="English" />
        </SettingsGroup>

        <SettingsGroup title="Support">
          <SettingRow icon={Phone} label="Call Support" />
          <SettingRow icon={FileText} label="Terms & Privacy" />
        </SettingsGroup>

        <Pressable style={styles.logout} onPress={confirmLogout}>
          <LogOut size={18} color={Colors.danger} />
          <Text style={styles.logoutText}>Log Out</Text>
        </Pressable>

        <Text style={styles.version}>Skyvora v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function SettingsGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.group}>
      <Text style={styles.groupTitle}>{title}</Text>
      <View style={styles.groupBody}>{children}</View>
    </View>
  );
}

function SettingRow({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value?: string;
}) {
  return (
    <Pressable style={styles.row}>
      <View style={styles.rowIcon}>
        <Icon size={18} color={Colors.textSecondary} />
      </View>
      <Text style={styles.rowLabel}>{label}</Text>
      {value ? <Text style={styles.rowValue}>{value}</Text> : null}
      <ChevronRight size={18} color={Colors.textMuted} />
    </Pressable>
  );
}

function ToggleRow({
  icon: Icon,
  label,
  value,
  onChange,
}: {
  icon: any;
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.rowIcon}>
        <Icon size={18} color={Colors.textSecondary} />
      </View>
      <Text style={styles.rowLabel}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ true: Colors.primaryLight, false: Colors.border }}
        thumbColor={Colors.white}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: Spacing.lg, gap: Spacing.base, paddingBottom: 120 },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.base,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.lg,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontFamily: Typography.fontDisplay, fontSize: Typography.sizes.lg, color: Colors.white },
  profileInfo: { flex: 1, gap: 4 },
  name: { fontFamily: Typography.fontDisplaySemi, fontSize: Typography.sizes.lg, color: Colors.textPrimary },
  phoneRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  phone: { fontFamily: Typography.fontBody, fontSize: Typography.sizes.sm, color: Colors.textSecondary },
  verifiedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(34,197,94,0.1)',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  verifiedText: { fontFamily: Typography.fontBodySemi, fontSize: 10, color: Colors.success },
  memberSince: { fontFamily: Typography.fontBody, fontSize: Typography.sizes.xs, color: Colors.textMuted },
  group: { gap: Spacing.sm },
  groupTitle: {
    fontFamily: Typography.fontBodySemi,
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
    letterSpacing: 1,
    marginLeft: 4,
  },
  groupBody: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.base,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  rowIcon: {
    width: 34,
    height: 34,
    borderRadius: Radius.sm,
    backgroundColor: Colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabel: { flex: 1, fontFamily: Typography.fontBodyMedium, fontSize: Typography.sizes.base, color: Colors.textPrimary },
  rowValue: { fontFamily: Typography.fontBody, fontSize: Typography.sizes.sm, color: Colors.textMuted },
  logout: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: '#FDECEC',
    borderRadius: Radius.md,
    paddingVertical: Spacing.base,
    marginTop: Spacing.sm,
  },
  logoutText: { fontFamily: Typography.fontBodySemi, fontSize: Typography.sizes.base, color: Colors.danger },
  version: { textAlign: 'center', fontFamily: Typography.fontBody, fontSize: Typography.sizes.xs, color: Colors.textMuted },
});
