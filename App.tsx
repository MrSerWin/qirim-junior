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
    console.warn('🚀 App: Starting initialization...');
    try {
      // Initialize database with bundled poems
      await DataInitializer.initialize();
      console.warn('✅ App: Data initialization complete');

      // Try to sync with server in background (don't block app loading)
      console.warn('🔄 App: Starting background sync...');
      SyncService.autoSync().then(() => {
        console.warn('✅ App: Background sync completed');
      }).catch((err) => {
        console.warn('❌ App: Background sync failed:', err);
        // Silent fail - app still works with local data
      });

      setIsReady(true);
      console.warn('✅ App: Ready to show UI');
    } catch (err) {
      console.error('❌ Failed to initialize app:', err);
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
