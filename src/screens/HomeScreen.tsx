import React, { useState, useLayoutEffect } from 'react';
import { StyleSheet, View, SafeAreaView, TouchableOpacity, Text } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Shop } from '../types';
import SearchBar from '../components/SearchBar';
import ShopList from '../components/ShopList';
import { mockShops } from '../data/mockData';
import { Icon } from 'react-native-elements';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const { user, loading, signOut } = useAuth()
  const [isProcessing, setIsProcessing] = useState(false);

  useLayoutEffect(() => {
    const iconName = user ? 'logout' : 'login'
    const iconText = user ? 'SignOut' : 'SignIn'
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity 
          onPressIn={handleSignInSignUp}
          style={[styles.headerButton, isProcessing && styles.disabledButton]}
          disabled={isProcessing}
          activeOpacity={0.7}
        >
          <Icon 
            name={iconName} 
            type="material" 
            size={28} 
            color={isProcessing ? '#999' : '#007AFF'}
            style={styles.headerIcon}
          />
          <Text style={[styles.headerButtonText, isProcessing && styles.disabledText]}>
            {isProcessing ? 'Processing...' : iconText}
          </Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, user, isProcessing]);

  const filteredShops = mockShops.filter(shop => 
    shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    shop.locality.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleShopPress = (shop: Shop) => {
    navigation.navigate('Shop', { shop });
  };

  const handleSignInSignUp = async () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    try {
      if(user) {
        await signOut();
      } else {
        navigation.navigate('Auth', { 
          redirect: {
            screen: 'Home',
            params: undefined
          }
        });
      }
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if(loading) {
    return <LoadingSpinner />
  }

  return (
    <SafeAreaView style={styles.container}>
      <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      <ShopList
        shops={filteredShops}
        onShopPress={handleShopPress}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 10,
    borderRadius: 8
  },
  headerIcon: {
    marginRight: 4,
  },
  headerButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  disabledButton: {
    backgroundColor: '#f8f8f8',
  },
  disabledText: {
    color: '#999',
  },
});