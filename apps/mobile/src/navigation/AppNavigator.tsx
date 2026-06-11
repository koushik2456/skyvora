import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { House, ClipboardList, FileText, UserCircle } from 'lucide-react-native';
import DroneLogo from '@/components/ui/DroneLogo';
import { MotiView } from '@/components/ui/Motion';
import HomeScreen from '@/screens/home/HomeScreen';
import BookingListScreen from '@/screens/booking/BookingListScreen';
import ReportsScreen from '@/screens/reports/ReportsScreen';
import ProfileScreen from '@/screens/profile/ProfileScreen';
import { useTranslation } from '@/hooks/useTranslation';
import type { TranslationKey } from '@/i18n/strings';
import { Colors, Radius, Shadow, resolveShadow, Spacing, Typography } from '@/constants/theme';
import type { AppTabParamList, RootStackParamList } from './types';

const Tab = createBottomTabNavigator<AppTabParamList>();

function EmptyComponent() {
  return <View />;
}

function CenterFab() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <View style={styles.fabContainer}>
      <MotiView
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ loop: true, duration: 2200, type: 'timing' }}
        style={styles.fabPulseRing}
      />
      <Pressable
        style={styles.fab}
        onPress={() => navigation.navigate('BookingFlow', { screen: 'NewBooking' })}
      >
        <DroneLogo size={28} color={Colors.mint} accent={Colors.sage} />
      </Pressable>
    </View>
  );
}

export default function AppNavigator() {
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarStyle: styles.tabBar,
        tabBarLabel: ({ focused, color }) =>
          focused ? (
            <Text style={[styles.tabLabel, { color }]}>{getTabLabel(route.name, t)}</Text>
          ) : null,
        tabBarIcon: ({ focused, color }) => getTabIcon(route.name, color, focused),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Bookings" component={BookingListScreen} />
      <Tab.Screen
        name="NewBookingTab"
        component={EmptyComponent}
        options={{
          tabBarLabel: '',
          tabBarButton: () => <CenterFab />,
        }}
        listeners={({ navigation: nav }) => ({
          tabPress: (e) => {
            e.preventDefault();
          },
        })}
      />
      <Tab.Screen name="Reports" component={ReportsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function getTabLabel(
  name: keyof AppTabParamList,
  t: (k: TranslationKey) => string
): string {
  const map: Partial<Record<keyof AppTabParamList, string>> = {
    Home: t('tabHome'),
    Bookings: t('tabBookings'),
    Reports: t('tabReports'),
    Profile: t('tabProfile'),
  };
  return map[name] ?? '';
}

function getTabIcon(name: keyof AppTabParamList, color: string, focused: boolean) {
  const size = 22;
  switch (name) {
    case 'Home':
      return <House size={size} color={color} />;
    case 'Bookings':
      return <ClipboardList size={size} color={color} />;
    case 'Reports':
      return <FileText size={size} color={color} />;
    case 'Profile':
      return <UserCircle size={size} color={color} />;
    default:
      return null;
  }
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    height: 72,
    paddingTop: 8,
    paddingBottom: 12,
    backgroundColor: Colors.bgForest,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    ...resolveShadow(Shadow.md),
  },
  tabLabel: {
    fontFamily: Typography.bodyMed,
    fontSize: 11,
    marginTop: 2,
  },
  fabContainer: {
    top: -24,
    justifyContent: 'center',
    alignItems: 'center',
    width: 72,
    height: 72,
  },
  fabPulseRing: {
    position: 'absolute',
    width: 72,
    height: 72,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(142, 182, 155, 0.2)',
  },
  fab: {
    width: 58,
    height: 58,
    borderRadius: Radius.full,
    backgroundColor: Colors.jade,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: Colors.bgForest,
    ...resolveShadow(Shadow.hero),
  },
});
