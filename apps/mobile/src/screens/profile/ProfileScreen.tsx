import React from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  MapPin,
  Wheat,
  Bell,
  MessageSquare,
  Phone,
  MessageCircle,
  HelpCircle,
  LogOut,
  ChevronRight,
  CheckCircle,
} from 'lucide-react-native';
import LanguageSelector from '@/components/ui/LanguageSelector';
import { useTranslation } from '@/hooks/useTranslation';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { useAuthStore } from '@/store/authStore';
import { useBookingsRepo } from '@/store/bookingsRepo';

export default function ProfileScreen() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const bookings = useBookingsRepo((s) => s.bookings);
  const { t, languageLabel } = useTranslation();
  const [push, setPush] = React.useState(true);
  const [sms, setSms] = React.useState(true);

  const initials = (user?.name ?? 'F')
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const memberDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
    : '—';

  const totalAcres = bookings.reduce((sum, b) => sum + (b.areaInAcres ?? 0), 0);

  const confirmLogout = () =>
    Alert.alert(t('logOutConfirmTitle'), t('logOutConfirmBody'), [
      { text: t('cancel'), style: 'cancel' },
      { text: t('logOut'), style: 'destructive', onPress: logout },
    ]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={[Colors.primaryDark, Colors.primary]}
          style={styles.profileHeader}
        >
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarInitials}>{initials}</Text>
          </View>
          <Text style={styles.profileName}>{user?.name ?? t('farmer')}</Text>
          <View style={styles.verifiedRow}>
            <Phone size={14} color={Colors.accent} />
            <Text style={styles.profilePhone}>{user?.phone ?? '+91 ----------'}</Text>
            <CheckCircle size={14} color={Colors.success} />
          </View>
          <Text style={styles.memberSince}>{t('memberSince', { date: memberDate })}</Text>
        </LinearGradient>

        <View style={styles.profileStats}>
          <StatItem label="Total Bookings" value={String(bookings.length)} />
          <StatItem label="Acres Serviced" value={totalAcres.toFixed(1)} />
          <StatItem label="Reports" value="0" />
        </View>

        <SettingsGroup title={t('myFarm')}>
          <SettingRow icon={MapPin} label={t('defaultLocation')} value="Telangana" />
          <SettingRow icon={Wheat} label={t('primaryCrop')} value="Cotton" />
        </SettingsGroup>

        <SettingsGroup title={t('notifications')}>
          <ToggleRow icon={Bell} label={t('pushNotifications')} value={push} onChange={setPush} />
          <ToggleRow icon={MessageSquare} label={t('smsAlerts')} value={sms} onChange={setSms} />
        </SettingsGroup>

        <SettingsGroup title={t('preferences')}>
          <View style={styles.langBlock}>
            <View style={styles.langHeader}>
              <Text style={styles.rowLabel}>{t('language')}</Text>
              <Text style={styles.rowValue}>{languageLabel}</Text>
            </View>
            <LanguageSelector />
          </View>
        </SettingsGroup>

        <SettingsGroup title={t('support')}>
          <SettingRow icon={Phone} label={t('callSupport')} />
          <SettingRow icon={MessageCircle} label="WhatsApp" />
          <SettingRow icon={HelpCircle} label="FAQs" />
        </SettingsGroup>

        <Pressable style={styles.logout} onPress={confirmLogout}>
          <LogOut size={18} color={Colors.danger} />
          <Text style={styles.logoutText}>{t('logOut')}</Text>
        </Pressable>

        <Text style={styles.version}>{t('version')}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statItem}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
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
  icon: React.ComponentType<{ size?: number; color?: string }>;
  label: string;
  value?: string;
}) {
  return (
    <Pressable style={styles.row}>
      <View style={styles.rowIcon}>
        <Icon size={18} color={Colors.primary} />
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
  icon: React.ComponentType<{ size?: number; color?: string }>;
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.rowIcon}>
        <Icon size={18} color={Colors.primary} />
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
  profileHeader: {
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  avatarInitials: {
    fontFamily: Typography.heading,
    fontSize: Typography.sizes.xl,
    color: Colors.textOnDark,
  },
  profileName: {
    fontFamily: Typography.heading,
    fontSize: Typography.sizes.xl,
    color: Colors.textOnDark,
  },
  verifiedRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  profilePhone: {
    fontFamily: Typography.body,
    fontSize: Typography.sizes.sm,
    color: Colors.textOnDarkMuted,
  },
  memberSince: {
    fontFamily: Typography.body,
    fontSize: Typography.sizes.xs,
    color: Colors.textOnDarkMuted,
    marginTop: 4,
  },
  profileStats: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.lg,
  },
  statItem: { flex: 1, alignItems: 'center', gap: 4 },
  statValue: {
    fontFamily: Typography.mono,
    fontSize: Typography.sizes.lg,
    color: Colors.primary,
  },
  statLabel: {
    fontFamily: Typography.body,
    fontSize: 10,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  group: { gap: Spacing.sm },
  groupTitle: {
    fontFamily: Typography.bodyMed,
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
    letterSpacing: 1,
    marginLeft: 4,
    textTransform: 'uppercase',
  },
  groupBody: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  langBlock: { padding: Spacing.base, gap: Spacing.md },
  langHeader: { gap: 2 },
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
  rowLabel: {
    flex: 1,
    fontFamily: Typography.bodyMed,
    fontSize: Typography.sizes.base,
    color: Colors.textPrimary,
  },
  rowValue: { fontFamily: Typography.body, fontSize: Typography.sizes.sm, color: Colors.textMuted },
  logout: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: '#FDECEC',
    borderRadius: Radius.lg,
    paddingVertical: Spacing.base,
    marginTop: Spacing.sm,
  },
  logoutText: { fontFamily: Typography.bodyMed, fontSize: Typography.sizes.base, color: Colors.danger },
  version: {
    textAlign: 'center',
    fontFamily: Typography.body,
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
  },
});
