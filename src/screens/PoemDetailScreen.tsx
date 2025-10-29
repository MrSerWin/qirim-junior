import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Platform,
} from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '@navigation/types';
import FastImage from 'react-native-fast-image';
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import PoemService from '@services/PoemService';
import { PoemModel } from '@database';
import { useLanguage } from '@hooks/useLanguage';
import { theme } from '../theme';
import { LanguageToggle } from '../components/LanguageToggle';
import { LoadingSpinner } from '../components/LoadingSpinner';

const { width, height } = Dimensions.get('window');
const IMAGE_HEIGHT = height * 0.4;

type PoemDetailRouteProp = RouteProp<RootStackParamList, 'PoemDetail'>;

const PoemDetailScreen: React.FC = () => {
  const route = useRoute<PoemDetailRouteProp>();
  const { poemId } = route.params;
  const { language, toggleLanguage } = useLanguage();

  const [poem, setPoem] = useState<PoemModel | null>(null);
  const [loading, setLoading] = useState(true);

  const scrollY = useSharedValue(0);

  useEffect(() => {
    loadPoem();
  }, [poemId]);

  const loadPoem = async () => {
    try {
      const poemData = await PoemService.getPoemById(poemId);
      setPoem(poemData);
    } catch (error) {
      console.error('Error loading poem:', error);
    } finally {
      setLoading(false);
    }
  };

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const imageAnimatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollY.value,
      [-IMAGE_HEIGHT, 0, IMAGE_HEIGHT],
      [2, 1, 0.8],
      Extrapolate.CLAMP
    );

    const translateY = interpolate(
      scrollY.value,
      [-IMAGE_HEIGHT, 0, IMAGE_HEIGHT],
      [-IMAGE_HEIGHT / 2, 0, IMAGE_HEIGHT * 0.3],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ scale }, { translateY }],
    };
  });

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!poem) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Стих не найден</Text>
      </View>
    );
  }

  const title = language === 'lat' ? poem.titleLat : poem.titleCyr;
  const content = language === 'lat' ? poem.poemLat : poem.poemCyr;
  const themeText = poem.theme.split('/')[language === 'lat' ? 0 : 1]?.trim();

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.imageContainer, imageAnimatedStyle]}>
          <FastImage
            source={{
              uri: poem.imageToView,
              priority: FastImage.priority.high,
            }}
            style={styles.image}
            resizeMode={FastImage.resizeMode.cover}
            defaultSource={require('../assets/placeholder.png')}
          />
          <View style={styles.imageOverlay} />
        </Animated.View>

        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.titleSection}>
              <Text style={styles.title}>{title}</Text>
              <View style={styles.metaContainer}>
                <View style={styles.authorBadge}>
                  <Text style={styles.authorText}>{poem.author}</Text>
                </View>
                {themeText && (
                  <View style={styles.themeBadge}>
                    <Text style={styles.themeText}>{themeText}</Text>
                  </View>
                )}
              </View>
            </View>
            <LanguageToggle language={language} onToggle={toggleLanguage} />
          </View>

          <View style={styles.poemContent}>
            <Text style={styles.poemText}>{content}</Text>
          </View>
        </View>
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  imageContainer: {
    width,
    height: IMAGE_HEIGHT,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  content: {
    flex: 1,
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    marginTop: -theme.spacing.xl,
    paddingTop: theme.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  titleSection: {
    flex: 1,
  },
  title: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    lineHeight: theme.fontSize.xxl * 1.3,
  },
  metaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  authorBadge: {
    backgroundColor: theme.colors.secondaryLight,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
  },
  authorText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.secondaryDark,
    fontWeight: theme.fontWeight.semibold,
  },
  themeBadge: {
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
  },
  themeText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.primaryDark,
    fontWeight: theme.fontWeight.semibold,
  },
  poemContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xl,
  },
  poemText: {
    fontSize: theme.fontSize.lg,
    lineHeight: theme.fontSize.lg * 1.8,
    color: theme.colors.text,
    fontWeight: theme.fontWeight.normal,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  errorText: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.textSecondary,
  },
});

export default PoemDetailScreen;
