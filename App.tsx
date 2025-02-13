import React, { useState, useEffect } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import ShopScreen from './src/screens/ShopScreen';
import { RootStackParamList, TabStackParamList } from './src/types';
import AuthScreen from './src/screens/AuthScreen';
import { AuthProvider } from './src/contexts/AuthContext';
import { ErrorBoundary } from './src/components/ErrorBoundary';
import * as SplashScreen from 'expo-splash-screen';
import { useTheme } from './src/contexts/ThemeContext';
import { ThemeProvider } from './src/contexts/ThemeContext';
import DiscoverScreen from './src/screens/DiscoverScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from '@rneui/themed';
import FavoritesScreen from './src/screens/FavoritesScreen';
import { HeaderColorProvider, useHeaderColor } from './src/contexts/HeaderColorContext';
import { View, Text, Image, StyleSheet, TouchableOpacity, StatusBar, Platform } from 'react-native';
import { Colors } from './src/constants/Colors';
import { Theme } from './src/constants/Theme';
import ShopListScreen from './src/screens/ShopListScreen';
import * as Location from 'expo-location';
import CustomHeader from './src/components/CustomHeader';
import FAQsScreen from './src/screens/FAQsScreen';
import ShopProfileScreen from './src/screens/ShopProfileScreen';
import PrivacyPolicyScreen from './src/screens/PrivacyPolicyScreen';
import * as Updates from 'expo-updates';
import Constants from 'expo-constants';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabStackParamList>();

// Keep the splash screen visible while we load resources
SplashScreen.preventAutoHideAsync();

function Navigation() {
  const { theme } = useTheme();
  return (
    <NavigationContainer
        onReady={() => SplashScreen.hideAsync()}
      >
        <Stack.Navigator screenOptions={{
          headerShown: false,
          statusBarAnimation: 'fade',
          statusBarBackgroundColor: theme.colors.secondaryBackground,
          statusBarStyle: theme.mode === 'dark' ? 'light' : 'dark'
        }}>
          <Stack.Screen name="MainTabs" component={TabNavigator} />
          <Stack.Screen 
            name="Auth" 
            component={AuthScreen}
            options={{ 
              presentation: 'modal',
              title: 'Authentication'
            }}
          />
          <Stack.Screen 
            name="Shop" 
            component={ShopScreen}
            options={({ navigation, route }) => ({ 
              title: route.params.shop.name,
              headerStyle: {
                backgroundColor: theme.colors.primary
              },
              headerTintColor: theme.colors.background,
              headerShown: true
            })}
          />
          <Stack.Screen 
            name="ShopList" 
            component={ShopListScreen}
            options={({ navigation, route }) => ({ 
              title: route.params.title,
              headerStyle: {
                backgroundColor: theme.colors.secondaryBackground
              },
              headerTintColor: theme.colors.textPrimary,
              headerShown: true
            })}
          />
           <Stack.Screen 
              name="FAQs" 
              component={FAQsScreen}
              options={{ title: 'FAQs & Support', 
                headerStyle: {
                  backgroundColor: theme.colors.secondaryBackground
                },
                headerTintColor: theme.colors.textPrimary,
                headerShown: true
              }}
            />
            <Stack.Screen 
              name="PrivacyPolicy" 
              component={PrivacyPolicyScreen}
              options={{ 
                title: 'Privacy Policy',
                headerStyle: {
                  backgroundColor: theme.colors.secondaryBackground
                },
                headerTintColor: theme.colors.textPrimary,
                headerShown: true
              }}
            />
            {/* <Stack.Screen 
              name="Settings" 
              component={SettingsScreen}
              options={{ title: 'App Settings' }}
            /> */}
            <Stack.Screen 
              name="ShopProfile" 
              component={ShopProfileScreen}
              options={{ title: 'Shop Profile', headerShown: false }}
            />
        </Stack.Navigator>
      </NavigationContainer>
  );
}

function TabNavigator() {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          const iconMap = {
            Home: 'home',
            Discover: 'search',
            Favorites: 'favorite',
            Profile: 'person'
          }
          return <Icon name={iconMap[route.name]} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.primary,
        },
        headerShown: false,
        contentStyle: {
          flex: 1,
          backgroundColor: theme.colors.background
        }
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{
        header: () => <CustomHeader/>,
        headerShown: true
      }} />
      <Tab.Screen name="Discover" component={DiscoverScreen} />
      {/* <Tab.Screen name="Favorites" component={FavoritesScreen} /> */}
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function AppWrapper() {

  useEffect(() => {
    if (Constants.executionEnvironment !== 'standalone') {
      console.log('Skipping update check in Expo Go');
      return;
    }

    async function checkUpdates() {
      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          await Updates.reloadAsync();
        }
      } catch (error) {
        console.log('Update check error:', error);
      }
    }
    
    checkUpdates();
  }, []);
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
