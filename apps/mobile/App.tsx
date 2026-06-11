import React from 'react';
import { ActivityIndicator, Platform, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  useFonts,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import { JetBrainsMono_400Regular } from '@expo-google-fonts/jetbrains-mono';
import GlobalLocationPicker from '@/components/ui/GlobalLocationPicker';
import RootNavigator from '@/navigation/RootNavigator';
import { Colors } from '@/constants/theme';

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 60_000, retry: 1 } },
});

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    Poppins_600SemiBold,
    Poppins_700Bold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    JetBrainsMono_400Regular,
  });

  if (!fontsLoaded && !fontError) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.background }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  const Shell = Platform.OS === 'web' ? View : GestureHandlerRootView;

  return (
    <ErrorBoundary>
      <Shell style={{ flex: 1 }}>
        <SafeAreaProvider>
          <BottomSheetModalProvider>
            <GlobalLocationPicker />
            <QueryClientProvider client={queryClient}>
              <RootNavigator />
            </QueryClientProvider>
          </BottomSheetModalProvider>
        </SafeAreaProvider>
      </Shell>
    </ErrorBoundary>
  );
}
