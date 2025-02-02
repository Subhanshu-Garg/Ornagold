import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import ShopScreen from './src/screens/ShopScreen';
import { RootStackParamList } from './src/types';
import AuthScreen from './src/screens/AuthScreen';
import { AuthProvider } from './src/contexts/AuthContext';
import { ErrorBoundary } from './src/components/ErrorBoundary';
import * as SplashScreen from 'expo-splash-screen';

const Stack = createNativeStackNavigator<RootStackParamList>();

// Keep the splash screen visible while we load resources
SplashScreen.preventAutoHideAsync();

function Navigation() {
  return (
    <NavigationContainer onReady={() => SplashScreen.hideAsync()}>
      <Stack.Navigator>
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ 
            title: 'OrnaGold',
            headerTitleAlign: 'left',
            headerStyle: {
              backgroundColor: '#ffffff',
            },
            headerShadowVisible: false,
          }}
        />
        <Stack.Screen 
          name="Shop" 
          component={ShopScreen}
          options={({ route }) => ({ title: route.params.shop.name })}
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

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Navigation />
      </AuthProvider>
    </ErrorBoundary>
  );
}