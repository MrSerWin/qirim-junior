import { useState, useEffect, useCallback } from 'react';
import { Language } from '../types';
import { StorageService } from '../utils/storage';
// import { Language } from '@types';
// import { StorageService } from '@utils/storage';

export const useLanguage = () => {
  const [language, setLanguageState] = useState<Language>('lat');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const savedLanguage = await StorageService.getLanguage();
      setLanguageState(savedLanguage);
    } catch (error) {
      console.error('Error loading language:', error);
    } finally {
      setLoading(false);
    }
  };

  const setLanguage = useCallback(async (newLanguage: Language) => {
    try {
      await StorageService.setLanguage(newLanguage);
      setLanguageState(newLanguage);
    } catch (error) {
      console.error('Error saving language:', error);
    }
  }, []);

  const toggleLanguage = useCallback(() => {
    const newLanguage: Language = language === 'lat' ? 'cyr' : 'lat';
    setLanguage(newLanguage);
  }, [language]);

  return { language, setLanguage, toggleLanguage, loading };
};
