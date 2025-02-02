import React, { useState, useLayoutEffect } from 'react';
import { StyleSheet, View, SafeAreaView, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Shop } from '../types';
import SearchBar from '../components/SearchBar';
import ShopList from '../components/ShopList';
import { mockShops } from '../data/mockData';
import { Icon } from 'react-native-elements';

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleSignInSignUp}>
          <Icon name="login" type="material" size={28} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const filteredShops = mockShops.filter(shop => 
    shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    shop.locality.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleShopPress = (shop: Shop) => {
    navigation.navigate('Shop', { shop });
  };

  const handleSignInSignUp = () => {
    // Need to Login Logout
  };

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
  }
});