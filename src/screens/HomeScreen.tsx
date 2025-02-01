import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Shop } from '../types';
import SearchBar from '../components/SearchBar';
import ShopList from '../components/ShopList';
import { mockShops } from '../data/mockData';

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredShops = mockShops.filter(shop => 
    shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    shop.locality.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleShopPress = (shop: Shop) => {
    navigation.navigate('Shop', { shop });
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
  },
});