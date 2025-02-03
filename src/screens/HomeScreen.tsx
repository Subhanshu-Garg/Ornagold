import React, { useState, useLayoutEffect, useEffect } from 'react';
import { StyleSheet, View, SafeAreaView, TouchableOpacity, Text } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Shop } from '../types';
import SearchBar from '../components/SearchBar';
import ShopList from '../components/ShopList';
import { Icon } from 'react-native-elements';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { getShops } from '../services/shops';
import { errorHandler } from '../utils/errorHandler';

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, loading, signOut } = useAuth()
  const [isProcessing, setIsProcessing] = useState(false);
  const [shops, setShops] = useState<Shop[]>([]);
  const [error, setError] = useState<Error | null>(null);

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

  const loadShops = async (currentPage: number, query: string) => {
    try {
      const { shops: newShops, hasMore } = await getShops(
        query || undefined,
        currentPage
      );
      
      setShops(prev => 
        currentPage === 1 ? newShops : [...prev, ...newShops]
      );
      setHasMore(hasMore);
    } catch (error) {
      errorHandler.handle(error, 'shop_list');
    }
  };

  // Handle search with debounce
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setPage(1);
      loadShops(1, searchQuery);
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  // Load more shops
  const handleLoadMore = () => {
    if (hasMore) {
      setPage(prev => prev + 1);
      loadShops(page + 1, searchQuery);
    }
  };

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
        shops={shops}
        onShopPress={handleShopPress}
        onEndReached={handleLoadMore}
        hasMore={hasMore}
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