import React, { useEffect, useState } from 'react';
import { StatusBar, View, StyleSheet, Text } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { RootNavigator } from '@navigation/RootNavigator';

import DataInitializer from '@services/DataInitializer';
import SyncService from '@services/SyncService';
import { LoadingSpinner } from './src/components/LoadingSpinner';
import { theme } from './src/theme';

const App: React.FC = () => {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Initialize database with bundled poems
      await DataInitializer.initialize();

      // Try to sync with server in background (don't block app loading)
      SyncService.autoSync().catch((err) => {
        console.log('Background sync failed:', err);
        // Silent fail - app still works with local data
      });

      setIsReady(true);
    } catch (err) {
      console.error('Failed to initialize app:', err);
      setError('Не удалось загрузить приложение. Попробуйте перезапустить.');
    }
  };

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingSpinner size={80} />
        <Text style={styles.loadingText}>Загрузка стихов...</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={theme.colors.background}
      />
      <RootNavigator />
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  loadingText: {
    marginTop: theme.spacing.xl,
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    padding: theme.spacing.xl,
  },
  errorText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.error,
    textAlign: 'center',
  },
});

export default App;

/*
import { NewAppScreen } from '@react-native/new-app-screen';
import React from 'react';
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { enableScreens } from 'react-native-screens';
import { RootNavigator } from './src/navigation/RootNavigator';
// import { RootNavigator } from '@/navigation/RootNavigator';
// import { theme } from '@/theme';

// Enable react-native-screens
enableScreens();


function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  const safeAreaInsets = useSafeAreaInsets();

  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
      />
      <RootNavigator />
    </GestureHandlerRootView>
    // <View style={styles.container}>
    //   <NewAppScreen
    //     templateFileName="App.tsx"
    //     safeAreaInsets={safeAreaInsets}
    //   />
    // </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
*/