import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from './types';
// import PoemsListScreen from '@screens/PoemsListScreen';
// import AboutScreen from '@screens/AboutScreen';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import { theme } from '@/theme';
import { Platform } from 'react-native';
import PoemsListScreen from '../screens/PoemsListScreen';
import AboutScreen from '../screens/AboutScreen';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        // tabBarActiveTintColor: theme.colors.primary,
        // tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          // backgroundColor: theme.colors.surface,
          borderTopWidth: 1,
          // borderTopColor: theme.colors.border,
          paddingBottom: Platform.OS === 'ios' ? 20 : 8,
          paddingTop: 8,
          height: Platform.OS === 'ios' ? 88 : 68,
          // ...theme.shadows.small,
        },
        tabBarLabelStyle: {
          // fontSize: theme.fontSize.xs,
          // fontWeight: theme.fontWeight.semibold,
        },
        headerStyle: {
          // backgroundColor: theme.colors.surface,
          // ...theme.shadows.small,
        },
        headerTitleStyle: {
        //   fontWeight: theme.fontWeight.bold,
        //   fontSize: theme.fontSize.xl,
        //   color: theme.colors.text,
        },
        headerShadowVisible: false,
      }}
    >
      <Tab.Screen
        name="PoemsList"
        component={PoemsListScreen}
        options={{
          tabBarLabel: 'Стихи',
          headerTitle: 'Qırım Junior',
          tabBarIcon: ({ color, size }) => (
            <Icon name="book-open-page-variant" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="About"
        component={AboutScreen}
        options={{
          tabBarLabel: 'О нас',
          headerTitle: 'О приложении',
          tabBarIcon: ({ color, size }) => (
            <Icon name="information" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
