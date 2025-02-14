import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, FlatList } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import ShopList from '../components/ShopList';
import MetricCards from '../components/MetricCards';
import { Theme } from '../constants/Theme';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Shop } from '../types';
import { RouteProp } from '@react-navigation/native';
import SearchBar from '../components/SearchBar';
import { getMyShops, getShops } from '../services/shops';
import { errorHandler } from '../utils/errorHandler';
import SectionHeader from '../components/SectionHeader';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../contexts/AuthContext';

type ShopListScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ShopList'>;
  route: RouteProp<RootStackParamList, 'ShopList'>;
};

export default function ShopListScreen({ route, navigation }: ShopListScreenProps) {
  const { theme } = useTheme();
  const styles = makeStyles(theme.colors);
  const { title, searchQuery, filters, sort, isMyShops } = route.params;
  const { myShops } = useAuth()
//   const [searchQuery, setSearchQuery] = useState('');
  const [shops, setShops] = useState<Shop[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isShopsLoading, setIsShopLoading] = useState(false);

  const loadShops = async (currentPage: number) => {
    try {
      const { shops: newShops, hasMore } = await getShops(
        searchQuery,
        currentPage,
        filters,
        sort
      );
      
      setShops(prev => 
        currentPage === 1 ? newShops : [...prev, ...newShops]
      );
      setHasMore(hasMore);
    } catch (error) {
      errorHandler.handle(error, 'shop_list');
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setPage(1);
      setIsShopLoading(true);
      if (isMyShops) {
        setShops(myShops);
      } else {
        loadShops(1);
      }
      setIsShopLoading(false);
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleLoadMore = () => {
    if (hasMore) {
      setPage(prev => prev + 1);
      loadShops(page + 1);
    }
  };

  if(isShopsLoading) {
    <LoadingSpinner/>
  }

  return (
    <SafeAreaView style={styles.container}>
      
      {/* <SectionHeader title={title} /> */}
      
      <ShopList
        shops={shops}
        onShopPress={(shop) => navigation.navigate('Shop', { shop })}
        onEndReached={handleLoadMore}
        hasMore={hasMore}
        horizontal={false}
        showDistance={true}
        location={null} // Pass actual location if available // Pass actual location if available
      />

      {/* <MetricCards /> */}
    </SafeAreaView>
  );
}

const makeStyles = (colors: Theme['colors']) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 15,
    paddingLeft: 15
  },
}); 