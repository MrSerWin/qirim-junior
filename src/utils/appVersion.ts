import { Platform, NativeModules } from 'react-native';

/**
 * Get app version from native build configuration
 * iOS: CFBundleShortVersionString from Info.plist
 * Android: versionName from build.gradle
 */
export const getAppVersion = (): string => {
  if (Platform.OS === 'ios') {
    // For iOS, we need to use NativeModules to get version from Info.plist
    // Fallback to a default version if not available
    try {
      const { RNCoreVersion } = NativeModules;
      return RNCoreVersion?.appVersion || '';
    } catch {
      return '';
    }
  } else {
    // For Android, we can use DeviceInfo or fallback
    try {
      const { RNCoreVersion } = NativeModules;
      return RNCoreVersion?.appVersion || '';
    } catch {
      return '';
    }
  }
};

/**
 * Get build number from native build configuration
 * iOS: CFBundleVersion from Info.plist
 * Android: versionCode from build.gradle
 */
export const getBuildNumber = (): string => {
  if (Platform.OS === 'ios') {
    try {
      const { RNCoreVersion } = NativeModules;
      return RNCoreVersion?.buildNumber || '';
    } catch {
      return '';
    }
  } else {
    try {
      const { RNCoreVersion } = NativeModules;
      return RNCoreVersion?.buildNumber || '';
    } catch {
      return '';
    }
  }
};
