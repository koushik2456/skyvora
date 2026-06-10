import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Home, ClipboardList, FileText, User } from 'lucide-react-native';
import PulseRing from '@/components/ui/PulseRing';
import DroneLogo from '@/components/ui/DroneLogo';
import HomeScreen from '@/screens/home/HomeScreen';
import BookingListScreen from '@/screens/booking/BookingListScreen';
import ReportsScreen from '@/screens/reports/ReportsScreen';
import ProfileScreen from '@/screens/profile/ProfileScreen';
import { Colors, Shadow } from '@/constants/theme';
import type { AppTabParamList, RootStackParamList } from './types';

const Tab = createBottomTabNavigator<AppTabParamList>();

function EmptyComponent() {
  return <View />;
}

function CenterFab() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <Pressable
      style={styles.fabWrap}
      onPress={() => navigation.navigate('BookingFlow', { screen: 'NewBooking' })}
    >
      <PulseRing size={64} color={Colors.primaryLight} style={styles.fab}>
        <View style={styles.fabInner}>
          <DroneLogo size={34} color={Colors.white} accent={Colors.accent} />
        </View>
      </PulseRing>
    </Pressable>
  );
}

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: Colors.primaryLight,
        tabBarInactiveTintColor: Colors.dark.textMuted,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarIcon: ({ color }) => <Home size={22} color={color} /> }}
      />
      <Tab.Screen
        name="Bookings"
        component={BookingListScreen}
        options={{ tabBarIcon: ({ color }) => <ClipboardList size={22} color={color} /> }}
      />
      <Tab.Screen
        name="NewBookingTab"
        component={EmptyComponent}
        options={{
          tabBarLabel: '',
          tabBarButton: () => <CenterFab />,
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
          },
        })}
      />
      <Tab.Screen
        name="Reports"
        component={ReportsScreen}
        options={{ tabBarIcon: ({ color }) => <FileText size={22} color={color} /> }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarIcon: ({ color }) => <User size={22} color={color} /> }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    height: 68,
    paddingTop: 8,
    paddingBottom: 10,
    backgroundColor: Colors.dark.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.border,
  },
  tabLabel: { fontFamily: 'Inter_500Medium', fontSize: 11 },
  fabWrap: { top: -22, justifyContent: 'center', alignItems: 'center', width: 70 },
  fab: { ...Shadow.floating },
  fabInner: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: Colors.dark.surface,
  },
});
