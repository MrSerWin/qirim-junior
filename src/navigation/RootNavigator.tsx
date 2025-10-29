import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import MainTabNavigator from './MainTabNavigator';
// import PoemDetailScreen from '@screens/PoemDetailScreen';
// import { theme } from '@/theme';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            // backgroundColor: theme.colors.surface,
          },
          headerShadowVisible: true,
          // headerTintColor: theme.colors.text,
          headerTitleStyle: {
            // fontWeight: theme.fontWeight.bold,
            // fontSize: theme.fontSize.lg,
          },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen
          name="MainTabs"
          component={MainTabNavigator}
          options={{ headerShown: false }}
        />
        {/* <Stack.Screen
          name="PoemDetail"
          component={PoemDetailScreen}
          options={{
            headerTitle: '',
            headerTransparent: true,
            headerBackTitle: '',
          }}
        /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
