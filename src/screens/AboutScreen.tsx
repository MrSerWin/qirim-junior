import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Linking,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Animated, {
  FadeInDown,
  FadeInUp,
  BounceIn,
} from 'react-native-reanimated';


import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AnimatedButton } from '../components/AnimatedButton';
import { theme } from '../theme';

const { width } = Dimensions.get('window');

const AboutScreen: React.FC = () => {
  const handleOpenWebsite = async () => {
    const url = 'https://qirimjr.org';
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Animated.View entering={FadeInUp.delay(100)} style={styles.header}>
        <FastImage
          source={require('../assets/ic_launcher.png')}
          style={styles.logo}
          resizeMode={FastImage.resizeMode.contain}
        />
        <Text style={styles.appName}>Qırım Junior</Text>
        <Text style={styles.version}>Версия 2.0.0</Text>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(200)} style={styles.card}>
        <View style={styles.cardHeader}>
          <Icon name="book-heart" size={32} color={theme.colors.primary} />
          <Text style={styles.cardTitle}>О приложении</Text>
        </View>
        <Text style={styles.description}>
          Qırım Junior — современное мобильное приложение для детей,
          содержащее коллекцию крымскотатарских стихов. Приложение
          поддерживает латиницу и кириллицу, работает полностью
          офлайн и создано с любовью для юных читателей.
        </Text>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(300)} style={styles.card}>
        <View style={styles.cardHeader}>
          <Icon name="palette" size={32} color={theme.colors.secondary} />
          <Text style={styles.cardTitle}>Особенности</Text>
        </View>
        <View style={styles.featureList}>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <Icon
                name={feature.icon}
                size={24}
                color={theme.colors.primary}
              />
              <Text style={styles.featureText}>{feature.text}</Text>
            </View>
          ))}
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(400)} style={styles.card}>
        <FastImage
          source={require('../assets/xamarin_logo.png')}
          style={styles.techLogo}
          resizeMode={FastImage.resizeMode.contain}
        />
        <Text style={styles.techText}>
          Полностью переписано на React Native с использованием
          современных технологий и лучших практик разработки.
        </Text>
      </Animated.View>

      <Animated.View entering={BounceIn.delay(500)} style={styles.actionCard}>
        <AnimatedButton
          title="Посетить наш сайт"
          onPress={handleOpenWebsite}
          variant="primary"
          size="large"
          style={styles.button}
        />
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
});

export default AboutScreen;
