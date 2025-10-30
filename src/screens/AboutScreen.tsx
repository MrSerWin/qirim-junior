import React, { use, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Linking,
  TouchableOpacity,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Animated, {
  FadeInDown,
  FadeInUp,
} from 'react-native-reanimated';


import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { theme } from '../theme';
import { getAppVersion } from '../utils/appVersion';

const { width } = Dimensions.get('window');

const AboutScreen: React.FC = () => {
  const handleOpenLink = async (url: string) => {
    try {
      // Try to open URL directly (works on most Android versions)
      await Linking.openURL(url);
    } catch (error) {
      // Fallback: check if URL can be opened
      try {
        const canOpen = await Linking.canOpenURL(url);
        if (canOpen) {
          await Linking.openURL(url);
        } else {
          console.warn(`Cannot open URL: ${url}`);
        }
      } catch (err) {
        console.error('Error opening URL:', url, err);
      }
    }
  };

  const handleOpenWebsite = () => handleOpenLink('https://qirimjr.org');
  const handleOpenFacebook = () => handleOpenLink('https://www.facebook.com/qirimjunior');
  const handleOpenTitoSite = () => handleOpenLink('https://eumerov.com');
  const handleOpenAnaYurt = () => handleOpenLink('https://ana-yurt.com');
  const handleOpenServinOsmanov = () => handleOpenLink('https://www.facebook.com/servin.osmanov');

  
  const version = useMemo(() => getAppVersion(), []);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Animated.View entering={FadeInUp.delay(100)} style={styles.header}>
        <FastImage
          source={require('../assets/xamarin_logo.png')}
          style={styles.techLogo}
          resizeMode={FastImage.resizeMode.contain}
        />
        {version && <Text style={styles.version}>Версия {version}</Text>}
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(200)} style={styles.card}>
        <View style={styles.cardHeader}>
          <Icon name="information" size={32} color={theme.colors.primary} />
          <Text style={styles.cardTitle}>Biz aqqında</Text>
        </View>

        <Text style={styles.description}>
          Qırımtatar zemaneviy şairleriniñ bala şiirleri cıyıntıĝı. Telefonda ilâve olaraq taqdim etilgen bu elektron kitapçıq, yol boyu balañıznı eglendirmek, yañı şiirni ögrenmek, böyleliknen ana tili bilgilerini pekitmege yardım eter. Cıyıntıqtaki şiirlerni hem üellif, hem de mevzusına köre qolay tapmaq mümkün. Bezetme-
          <Text style={{ fontWeight: 'bold' }}>Qirim.Jr</Text> taqımı.
        </Text>

        <Text style={styles.description}>
          Tehnik destek: <Text style={{ fontWeight: 'bold' }}>Tito.site </Text>
          ve <Text style={{ fontWeight: 'bold' }}>AnaYurt</Text> qırımtatar portal.
        </Text>

        <Text style={styles.description}>
          Сборник детских стихотворений современных крымскотатарских поэтов.
        </Text>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(300)} style={styles.card}>
        <View style={styles.cardHeader}>
          <Icon name="link-variant" size={32} color={theme.colors.secondary} />
          <Text style={styles.cardTitle}>Bağlantılar</Text>
        </View>

        <View style={styles.linksList}>
          <TouchableOpacity onPress={handleOpenWebsite} style={styles.linkItem}>
            <Icon name="web" size={20} color={theme.colors.primary} />
            <Text style={styles.linkText}>Qirim.Jr</Text>
            <Icon name="chevron-right" size={20} color={theme.colors.textLight} />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleOpenFacebook} style={styles.linkItem}>
            <Icon name="facebook" size={20} color={theme.colors.primary} />
            <Text style={styles.linkText}>Facebook/Qirim Junior</Text>
            <Icon name="chevron-right" size={20} color={theme.colors.textLight} />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleOpenTitoSite} style={styles.linkItem}>
            <Icon name="web" size={20} color={theme.colors.primary} />
            <Text style={styles.linkText}>Эмиль Умеров</Text>
            <Icon name="chevron-right" size={20} color={theme.colors.textLight} />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleOpenAnaYurt} style={styles.linkItem}>
            <Icon name="web" size={20} color={theme.colors.primary} />
            <Text style={styles.linkText}>AnaYurt</Text>
            <Icon name="chevron-right" size={20} color={theme.colors.textLight} />
          </TouchableOpacity>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(400)} style={styles.card}>
        <View style={styles.cardHeader}>
          <Icon name="code-braces" size={32} color={theme.colors.secondary} />
          <Text style={styles.cardTitle}>İşleyici</Text>
        </View>

        <View style={styles.linksList}>
          <TouchableOpacity onPress={handleOpenServinOsmanov} style={styles.linkItem}>
            <Icon name="account" size={20} color={theme.colors.primary} />
            <Text style={styles.linkText}>Servin Osmanov</Text>
            <Icon name="chevron-right" size={20} color={theme.colors.textLight} />
          </TouchableOpacity>
        </View>
      </Animated.View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Сделано с ❤️ для детей Крыма
        </Text>
        <Text style={styles.copyright}>
          © 2025 Qırım Junior. Все права защищены.
        </Text>
      </View>
    </ScrollView>
  );
};

const features = [
  {
    icon: 'web-off',
    text: 'Полная работа офлайн',
  },
  {
    icon: 'alpha-a-circle',
    text: 'Поддержка латиницы и кириллицы',
  },
  {
    icon: 'filter',
    text: 'Фильтрация по автору и теме',
  },
  {
    icon: 'image-multiple',
    text: 'Красочные иллюстрации',
  },
  {
    icon: 'animation',
    text: 'Плавные анимации для детей',
  },
  {
    icon: 'lightning-bolt',
    text: 'Быстрая и отзывчивая',
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: theme.spacing.md,
  },
  appName: {
    fontSize: theme.fontSize.xxxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  version: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
  },
  card: {
    backgroundColor: theme.colors.surface,
    marginHorizontal: theme.spacing.lg,
    marginVertical: theme.spacing.sm,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.xl,
    ...theme.shadows.medium,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  cardTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  description: {
    fontSize: theme.fontSize.md,
    lineHeight: theme.fontSize.md * 1.6,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  featureList: {
    gap: theme.spacing.md,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  featureText: {
    flex: 1,
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
  },
  techLogo: {
    width: '100%',
    height: 80,
    marginBottom: theme.spacing.md,
  },
  techText: {
    fontSize: theme.fontSize.md,
    lineHeight: theme.fontSize.md * 1.6,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  actionCard: {
    marginHorizontal: theme.spacing.lg,
    marginVertical: theme.spacing.md,
  },
  button: {
    width: '100%',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
    gap: theme.spacing.xs,
  },
  footerText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
  },
  copyright: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textLight,
  },
  linksList: {
    gap: theme.spacing.xs,
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.background,
  },
  linkText: {
    flex: 1,
    fontSize: theme.fontSize.md,
    color: theme.colors.primary,
    fontWeight: theme.fontWeight.medium,
  },
});

export default AboutScreen;
