import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RootStackParamList } from '../navigation/types';
import { useLanguage } from '../hooks/useLanguage';
import { AuthorModel, ThemeModel } from '../database';
import { usePoems } from '../hooks/usePoems';
import PoemService from '../services/PoemService';
import SyncService from '../services/SyncService';
import { theme } from '../theme';
import { LanguageToggle } from '../components/LanguageToggle';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { PoemCard } from '../components/PoemCard';
// import PoemService from '@services/PoemService';
// import { AuthorModel, ThemeModel } from '@database';


type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const PoemsListScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { language, toggleLanguage } = useLanguage();

  const [selectedAuthor, setSelectedAuthor] = useState<string | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [authors, setAuthors] = useState<AuthorModel[]>([]);
  const [themes, setThemes] = useState<ThemeModel[]>([]);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState({ loaded: 0, total: 0, percentage: 0 });

  const { poems, loading, refresh } = usePoems({
    author: selectedAuthor || undefined,
    theme: selectedTheme || undefined,
  });

  const loadFilters = useCallback(async () => {
    const [authorsData, themesData] = await Promise.all([
      PoemService.getAuthors(),
      PoemService.getThemes(),
    ]);
    setAuthors(authorsData);
    setThemes(themesData);
  }, []);

  useEffect(() => {
    loadFilters();
  }, [loadFilters]);

  const handlePoemPress = useCallback(
    (poemId: number) => {
      navigation.navigate('PoemDetail', { poemId });
    },
    [navigation]
  );

  const handleRefresh = useCallback(async () => {
    setSyncing(true);
    setSyncProgress({ loaded: 0, total: 0, percentage: 0 });

    // Sync with server with progress callback
    const result = await SyncService.sync(true, (progress) => {
      setSyncProgress(progress);
    });

    // Refresh local data (poems list)
    await refresh();

    // Reload filters if new poems were synced (new authors/themes may be added)
    if (result.success && result.totalPoems && result.totalPoems > 0) {
      console.warn(`✅ Synced ${result.totalPoems} poems, reloading filters...`);
      await loadFilters();
    }

    setSyncing(false);
    setSyncProgress({ loaded: 0, total: 0, percentage: 0 });

    // Show result message
    console.log('Sync result:', result.message);
  }, [refresh, loadFilters]);

  const clearFilters = () => {
    setSelectedAuthor(null);
    setSelectedTheme(null);
    setFilterModalVisible(false);
  };

  const hasActiveFilters = selectedAuthor || selectedTheme;

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setFilterModalVisible(true)}
          >
            <Icon
              name="filter-variant"
              size={24}
              color={hasActiveFilters ? theme.colors.primary : theme.colors.text}
            />
            {hasActiveFilters && <View style={styles.filterBadge} />}
          </TouchableOpacity>
        </View>
      ),
      headerRight: () => (
        <View style={styles.headerRight}>
          <LanguageToggle language={language} onToggle={toggleLanguage} />
        </View>
      ),
    });
  }, [navigation, language, toggleLanguage, hasActiveFilters]);

  if (loading && poems.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={poems}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <PoemCard
            poem={item}
            language={language}
            onPress={() => handlePoemPress(item.poemId)}
            index={index}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading || syncing}
            onRefresh={handleRefresh}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="book-off" size={64} color={theme.colors.textLight} />
            <Text style={styles.emptyText}>Стихи не найдены</Text>
          </View>
        }
      />

      {/* Filter Modal */}
      <Modal
        visible={filterModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filtrler</Text>
              <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                <Icon name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.filterSection}>
              <Text style={styles.filterLabel}>Müellif</Text>
              <View style={styles.filterOptions}>
                <TouchableOpacity
                  style={[
                    styles.filterOption,
                    !selectedAuthor && styles.filterOptionActive,
                  ]}
                  onPress={() => setSelectedAuthor(null)}
                >
                  <Text
                    style={[
                      styles.filterOptionText,
                      !selectedAuthor && styles.filterOptionTextActive,
                    ]}
                  >
                    Episi
                  </Text>
                </TouchableOpacity>
                {authors.map((author) => (
                  <TouchableOpacity
                    key={author.id}
                    style={[
                      styles.filterOption,
                      selectedAuthor === author.name && styles.filterOptionActive,
                    ]}
                    onPress={() => setSelectedAuthor(author.name)}
                  >
                    <Text
                      style={[
                        styles.filterOptionText,
                        selectedAuthor === author.name &&
                          styles.filterOptionTextActive,
                      ]}
                    >
                      {author.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.filterLabel}>Mevzu</Text>
              <View style={styles.filterOptions}>
                <TouchableOpacity
                  style={[
                    styles.filterOption,
                    !selectedTheme && styles.filterOptionActive,
                  ]}
                  onPress={() => setSelectedTheme(null)}
                >
                  <Text
                    style={[
                      styles.filterOptionText,
                      !selectedTheme && styles.filterOptionTextActive,
                    ]}
                  >
                    Episi
                  </Text>
                </TouchableOpacity>
                {themes.map((theme) => (
                  <TouchableOpacity
                    key={theme.id}
                    style={[
                      styles.filterOption,
                      selectedTheme === theme.name && styles.filterOptionActive,
                    ]}
                    onPress={() => setSelectedTheme(theme.name)}
                  >
                    <Text
                      style={[
                        styles.filterOptionText,
                        selectedTheme === theme.name &&
                          styles.filterOptionTextActive,
                      ]}
                    >
                      {theme.name.split('/')[language === 'lat' ? 0 : 1]?.trim()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.clearButton}
                onPress={clearFilters}
              >
                <Text style={styles.clearButtonText}>Clear</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.applyButton}
                onPress={() => setFilterModalVisible(false)}
              >
                <Text style={styles.applyButtonText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  listContent: {
    paddingVertical: theme.spacing.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: theme.spacing.sm,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginRight: theme.spacing.sm,
  },
  filterButton: {
    padding: theme.spacing.xs,
    position: 'relative',
  },
  filterBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.error,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing.xxl * 2,
  },
  emptyText: {
    marginTop: theme.spacing.md,
    fontSize: theme.fontSize.md,
    color: theme.colors.textLight,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: theme.colors.overlay,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  modalTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  filterSection: {
    padding: theme.spacing.lg,
  },
  filterLabel: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    marginTop: theme.spacing.md,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  filterOption: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  filterOptionActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterOptionText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text,
  },
  filterOptionTextActive: {
    color: theme.colors.surface,
    fontWeight: theme.fontWeight.semibold,
  },
  modalActions: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    padding: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  clearButton: {
    flex: 1,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.primary,
  },
  applyButton: {
    flex: 1,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.surface,
  },
});

export default PoemsListScreen;
