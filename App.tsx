import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import ShopScreen from './src/screens/ShopScreen';
import { RootStackParamList } from './src/types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ title: 'OrnaGold' }}
        />
        <Stack.Screen 
          name="Shop" 
          component={ShopScreen}
          options={({ route }) => ({ title: route.params.shop.name })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}