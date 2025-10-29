import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RootStackParamList } from './types';
import MainTabNavigator from './MainTabNavigator';
import PoemDetailScreen from '@screens/PoemDetailScreen';
import { theme } from '../theme';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {},
          headerShadowVisible: true,
          headerTitleStyle: {},
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen
          name="MainTabs"
          component={MainTabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PoemDetail"
          component={PoemDetailScreen}
          options={({ navigation }) => ({
            headerTitle: '',
            headerTransparent: true,
            headerBackTitle: '',
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.backButton}
              >
                <Icon name="chevron-left" size={32} color={theme.colors.text} />
              </TouchableOpacity>
            ),
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: theme.spacing.xs,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    ...theme.shadows.medium,
  },
});
