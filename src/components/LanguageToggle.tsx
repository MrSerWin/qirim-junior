import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Language } from '../types';
import { theme } from '../theme';


interface LanguageToggleProps {
  language: Language;
  onToggle: () => void;
}

export const LanguageToggle: React.FC<LanguageToggleProps> = ({
  language,
  onToggle,
}) => {
  const translateX = useSharedValue(language === 'lat' ? 0 : 52);

  React.useEffect(() => {
    translateX.value = withSpring(language === 'lat' ? 0 : 52, {
      damping: 15,
      stiffness: 150,
    });
  }, [language]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <TouchableOpacity style={styles.container} onPress={onToggle} activeOpacity={0.8}>
      <View style={styles.track}>
        <Animated.View style={[styles.thumb, animatedStyle]} />
        <View style={styles.labelsContainer}>
          <Text style={[styles.label, language === 'lat' && styles.activeLabel]}>
            LAT
          </Text>
          <Text style={[styles.label, language === 'cyr' && styles.activeLabel]}>
            КИР
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.xs,
  },
  track: {
    width: 100,
    height: 40,
    backgroundColor: theme.colors.border,
    borderRadius: theme.borderRadius.full,
    position: 'relative',
    justifyContent: 'center',
  },
  thumb: {
    position: 'absolute',
    width: 48,
    height: 32,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.full,
    ...theme.shadows.small,
  },
  labelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  label: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textSecondary,
    width: 48,
    textAlign: 'center',
  },
  activeLabel: {
    color: theme.colors.surface,
  },
});
