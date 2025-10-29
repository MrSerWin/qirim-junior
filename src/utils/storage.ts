import AsyncStorage from '@react-native-async-storage/async-storage';
import { Language } from '../types';

const KEYS = {
  LANGUAGE: '@qirim_junior:language',
  LAST_SYNC: '@qirim_junior:last_sync',
  FIRST_LAUNCH: '@qirim_junior:first_launch',
};

export const StorageService = {
  // Language
  async getLanguage(): Promise<Language> {
    const lang = await AsyncStorage.getItem(KEYS.LANGUAGE);
    return (lang as Language) || 'lat';
  },

  async setLanguage(language: Language): Promise<void> {
    await AsyncStorage.setItem(KEYS.LANGUAGE, language);
  },

  // Last sync time
  async getLastSync(): Promise<string | null> {
    return await AsyncStorage.getItem(KEYS.LAST_SYNC);
  },

  async setLastSync(date: string): Promise<void> {
    await AsyncStorage.setItem(KEYS.LAST_SYNC, date);
  },

  // First launch flag
  async isFirstLaunch(): Promise<boolean> {
    const value = await AsyncStorage.getItem(KEYS.FIRST_LAUNCH);
    return value === null;
  },

  async setFirstLaunchDone(): Promise<void> {
    await AsyncStorage.setItem(KEYS.FIRST_LAUNCH, 'false');
  },
};
