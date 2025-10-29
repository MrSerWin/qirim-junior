import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import FastImage from 'react-native-fast-image';
import { theme } from '../theme';
import { PoemModel } from '../database';
import { Language } from '../types';


const { width } = Dimensions.get('window');
const CARD_WIDTH = width - theme.spacing.lg * 2;

interface PoemCardProps {
  poem: PoemModel;
  language: Language;
  onPress: () => void;
  index: number;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export const PoemCard: React.FC<PoemCardProps> = ({
  poem,
  language,
  onPress,
  index,
}) => {
  const scale = useSharedValue(1);
  const translateY = useSharedValue(50);
  const opacity = useSharedValue(0);

  // Entry animation
  React.useEffect(() => {
    const delay = index * 100; // Stagger animation
    translateY.value = withTiming(0, {
      duration: 500,
      // delay,
      easing: Easing.out(Easing.exp),
    });
    opacity.value = withTiming(1, {
      duration: 500,
      // delay,
    });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97, {
      damping: 15,
      stiffness: 150,
    });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, {
      damping: 15,
      stiffness: 150,
    });
  };

  const title = language === 'lat' ? poem.titleLat : poem.titleCyr;

  return (
    <AnimatedTouchable
      style={[styles.container, animatedStyle]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.9}
    >
      <View style={styles.imageContainer}>
        <FastImage
          source={{
            uri: poem.imageToView,
            priority: FastImage.priority.normal,
          }}
          style={styles.image}
          resizeMode={FastImage.resizeMode.cover}
          defaultSource={require('../assets/placeholder.png')}
        />
        <View style={styles.gradient} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        <View style={styles.meta}>
          <Text style={styles.author} numberOfLines={1}>
            {poem.author}
          </Text>
          <View style={styles.themeBadge}>
            <Text style={styles.themeText} numberOfLines={1}>
              {poem.theme.split('/')[language === 'lat' ? 0 : 1]?.trim()}
            </Text>
          </View>
        </View>
      </View>
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    marginHorizontal: theme.spacing.lg,
    marginVertical: theme.spacing.sm,
    overflow: 'hidden',
    ...theme.shadows.medium,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  content: {
    padding: theme.spacing.md,
  },
  title: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  author: {
    flex: 1,
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    fontWeight: theme.fontWeight.medium,
  },
  themeBadge: {
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  themeText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.primaryDark,
    fontWeight: theme.fontWeight.semibold,
  },
});
