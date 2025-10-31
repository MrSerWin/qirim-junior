import { useState, useEffect } from 'react';
import { Dimensions, ScaledSize } from 'react-native';

export type DeviceType = 'phone' | 'tablet';
export type Orientation = 'portrait' | 'landscape';

interface DeviceInfo {
  deviceType: DeviceType;
  orientation: Orientation;
  width: number;
  height: number;
  numColumns: number;
}

// iPad mini has shortest side of 768px, iPhone Pro Max has 430px
const TABLET_MIN_SHORT_SIDE = 600;

const getDeviceInfo = ({ width, height }: ScaledSize): DeviceInfo => {
  const isLandscape = width > height;
  const orientation: Orientation = isLandscape ? 'landscape' : 'portrait';

  // Use the shorter side to determine if it's a tablet
  // This way iPhone in landscape (e.g., 932x430) won't be detected as tablet
  const shortSide = Math.min(width, height);
  const isTablet = shortSide >= TABLET_MIN_SHORT_SIDE;
  const deviceType: DeviceType = isTablet ? 'tablet' : 'phone';

  // Determine number of columns based on device and orientation
  let numColumns = 1;
  if (deviceType === 'tablet') {
    numColumns = orientation === 'portrait' ? 2 : 3;
  }

  return {
    deviceType,
    orientation,
    width,
    height,
    numColumns,
  };
};

export const useDeviceOrientation = (): DeviceInfo => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(() =>
    getDeviceInfo(Dimensions.get('window'))
  );

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDeviceInfo(getDeviceInfo(window));
    });

    return () => subscription?.remove();
  }, []);

  return deviceInfo;
};
