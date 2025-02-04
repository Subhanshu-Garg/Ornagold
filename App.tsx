import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import ShopScreen from './src/screens/ShopScreen';
import { RootStackParamList } from './src/types';
import AuthScreen from './src/screens/AuthScreen';
import { AuthProvider } from './src/contexts/AuthContext';
import { ErrorBoundary } from './src/components/ErrorBoundary';
import * as SplashScreen from 'expo-splash-screen';
import { useTheme } from './src/contexts/ThemeContext';
import { ThemeProvider } from './src/contexts/ThemeContext';

const Stack = createNativeStackNavigator<RootStackParamList>();

// Keep the splash screen visible while we load resources
SplashScreen.preventAutoHideAsync();

function Navigation() {
  const { theme } = useTheme();

  return (
    <NavigationContainer
      theme={{
        ...DefaultTheme,
        dark: theme.mode === 'dark',
        colors: {
          ...DefaultTheme.colors,
          ...theme.colors,
        },
      }}
      onReady={() => SplashScreen.hideAsync()}
    >
      <Stack.Navigator>
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ 
            title: 'OrnaGold',
            headerTitleAlign: 'left',
            headerStyle: {
              backgroundColor: theme.colors.primary,
            },
            headerTintColor: theme.colors.background,
            headerShadowVisible: false,
          }}
        />
        <Stack.Screen 
          name="Shop" 
          component={ShopScreen}
          options={
            ({ route }) => ({ title: route.params.shop.name, headerStyle: {
              backgroundColor: theme.colors.primary
            },
            headerTintColor: theme.colors.background
           })

          }
        />
        <Stack.Screen
          name="Auth"
          component={AuthScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function AppWrapper() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ErrorBoundary>
          <Navigation />
        </ErrorBoundary>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default AppWrapper;