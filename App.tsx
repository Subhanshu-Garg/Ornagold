import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import ShopScreen from './src/screens/ShopScreen';
import { RootStackParamList } from './src/types';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import AuthScreen from './src/screens/AuthScreen';
import LoadingSpinner from './src/components/LoadingSpinner';
import AuthGate from './src/components/AuthGate';

const Stack = createNativeStackNavigator<RootStackParamList>();

function Navigation() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ title: 'Gold Shops' }}
        />
        <Stack.Screen 
          name="Shop" 
          component={ShopScreen}
          options={({ route }) => ({ title: route.params.shop.name })}
        />
        {/* <Stack.Screen
          name="Auth"
          component={AuthScreen}
        /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Navigation />
      {/* <AuthGate /> */}
    </AuthProvider>
  );
}