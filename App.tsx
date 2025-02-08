import React from 'react';
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
import { View, Text, Image, StyleSheet } from 'react-native';
import { Colors } from './src/constants/Colors';
import { Theme } from './src/constants/Theme';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabStackParamList>();

// Keep the splash screen visible while we load resources
SplashScreen.preventAutoHideAsync();

function CustomHeader() {
  const { headerColor } = useHeaderColor();
  const { theme } = useTheme()
  const styles = makeStyles(theme.colors)
  return (
    <View style={styles.header}>
      <Image 
        source={require('./assets/images/logo.png')}
        style={styles.logo}
      />
      <Text style={styles.headerTitle}>OrnaGold</Text>
    </View>
  );
}

function Navigation() {
  const { theme } = useTheme();
  return (
    <HeaderColorProvider>
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
        <Stack.Navigator
          screenOptions={{
            headerShown: false
          }}
        >
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
        </Stack.Navigator>
      </NavigationContainer>
    </HeaderColorProvider>
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
            Discover: 'explore',
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
        headerShown: false
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{
        header: () => <CustomHeader/>,
        headerShown: true
      }} />
      <Tab.Screen name="Discover" component={DiscoverScreen} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function AppWrapper() {
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

const makeStyles = (colors: Theme['colors']) => StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    paddingTop: 50,
    backgroundColor: colors.secondaryBackground,
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    letterSpacing: 1.5,
  }
});