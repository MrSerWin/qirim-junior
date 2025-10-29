import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { theme } from '../theme';


interface AnimatedButtonProps {
  onPress: () => void;
  title: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  onPress,
  title,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  style,
  textStyle,
}) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, {
      damping: 10,
      stiffness: 100,
    });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, {
      damping: 10,
      stiffness: 100,
    });
  };

  const getButtonStyle = (): ViewStyle => {
    const baseStyle = [styles.button, styles[`button_${size}`]];

    switch (variant) {
      case 'primary':
        // @ts-expect-error -- IGNORE --
        return { ...baseStyle, backgroundColor: theme.colors.primary };
      case 'secondary':
        // @ts-expect-error -- IGNORE --
        return { ...baseStyle, backgroundColor: theme.colors.secondary };
      case 'outline':
        // @ts-expect-error -- IGNORE --
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderColor: theme.colors.primary,
        };
      default:
        // @ts-expect-error -- IGNORE --
        return baseStyle;
    }
  };

  const getTextStyle = (): TextStyle => {
    const baseStyle = [styles.text, styles[`text_${size}`]];

    if (variant === 'outline') {
        // @ts-expect-error -- IGNORE --
      return { ...baseStyle, color: theme.colors.primary };
    }

        // @ts-expect-error -- IGNORE --
    return { ...baseStyle, color: '#FFFFFF' };
  };

  return (
    <AnimatedTouchable
      style={[getButtonStyle(), animatedStyle, style, disabled && styles.disabled]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <Text style={[getTextStyle(), textStyle]}>{title}</Text>
      )}
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.medium,
  },
  button_small: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  button_medium: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  button_large: {
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.lg,
  },
  text: {
    fontWeight: theme.fontWeight.bold,
  },
  text_small: {
    fontSize: theme.fontSize.sm,
  },
  text_medium: {
    fontSize: theme.fontSize.md,
  },
  text_large: {
    fontSize: theme.fontSize.lg,
  },
  disabled: {
    opacity: 0.5,
  },
});
