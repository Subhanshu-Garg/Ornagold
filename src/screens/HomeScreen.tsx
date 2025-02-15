import React, { useState, useLayoutEffect, useEffect, useRef } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, ScrollView, Image, FlatList, Dimensions, SafeAreaView, Platform, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Banner, RootStackParamList, Shop, TabStackParamList } from '../types';
import SearchBar from '../components/SearchBar';
import ShopList from '../components/ShopList';
import { Icon } from 'react-native-elements';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { getShops } from '../services/shops';
import { errorHandler } from '../utils/errorHandler';
import { useTheme } from '../contexts/ThemeContext';
import { Theme } from '../constants/Theme';
import * as Location from 'expo-location';
import { ProgressCircle } from '../components/ProgressCircle';
import { useHeaderColor } from '../contexts/HeaderColorContext';
import { LinearGradient } from 'expo-linear-gradient';
import BannerCarousel from '../components/BannerCarousel';
import ShopListContainer from '../components/ShopListContainer';
import ReachOutSection from '../components/ReachOutSection';
import PartnerLogos from '../components/PartnerLogos';
import MetricCards from '../components/MetricCards';
import useStatusBarColor from '../hooks/useStatusBarColor';
import useAppContext from '../hooks/useAppContext';
// import { SafeAreaView } from 'react-native-safe-area-context';

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'MainTabs'>
};

const BANNER_IMAGES: Banner[]  = [
  { 
    bannerTitle: 'Buy Jewellery Made Simple',
    bannerText: 'Locate nearby shops',
    ctaText: 'Contact',
    uri: 'https://t4.ftcdn.net/jpg/05/27/71/81/360_F_527718147_x7XDK929xZnZqjgh0oPYz7xK0EvtnlIF.jpg',
    color: '#F9DEB3'
  },
  {
    bannerTitle: 'Buy Jewellery Made Simple',
    bannerText: 'Compare making charges',
    ctaText: 'Contact',
    uri: 'https://cdn.shopify.com/s/files/1/1115/6326/files/B1007_Diamond_Pendants_1002_thumb_cdacec1a-3aec-487f-b9be-4c723c3801ca.jpg?v=1602840981',
    color: '#D8BAC0'
  },
  {
    bannerTitle: 'Buy Jewellery Made Simple',
    bannerText: 'Locate nearby shops',
    ctaText: 'Contact',
    uri: 'https://t3.ftcdn.net/jpg/05/79/60/44/360_F_579604488_9ACQ2qfvXqH4B6VQoEi7ZG29X0qjlIfT.jpg',
    color: '#737070' 
  }
];

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const {  loading } = useAuth()
  const [shops, setShops] = useState<Shop[]>([]);
  const { theme } = useTheme();
  const { location, reverseGeocode } = useAppContext();
  const [currentCity, setCurrentCity] = useState('');
  const [activeBanner, setActiveBanner] = useState(0);
  const { setHeaderColor } = useHeaderColor();
  const flatListRef = useRef<FlatList>(null);

  const styles = makeStyles(theme.colors)

  // Use the hook with header color
  useStatusBarColor(theme.colors.secondaryBackground);
  
  useEffect(() => {
    (async () => {
      if(location) {
        const geo = await reverseGeocode(location);
        setCurrentCity(geo[0].city || '');
      }
    })();
  }, [location]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveBanner(prev => (prev + 1) % BANNER_IMAGES.length);
      flatListRef.current?.scrollToIndex({
        index: activeBanner,
        animated: true
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [activeBanner]);

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
      console.log(error)
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
    if (!shop?.id) {
      console.error('Attempted to navigate to invalid shop:', shop);
      return;
    }
    navigation.navigate('Shop', { shop });
  };

  if(loading) {
    return <LoadingSpinner />
  } 

  return (
    <View style={styles.container}>
      <FlatList
        data={[]}
        renderItem={null}
        ListHeaderComponent={
          <>
            <BannerCarousel
              banners={BANNER_IMAGES}
              activeIndex={activeBanner}
              onBannerChange={setActiveBanner}
              headerColor={theme.colors.background}
            />

            <ShopListContainer
              title="Popular Shops Near You"
              shops={shops}
              onShopPress={handleShopPress}
              onViewAll={() => navigation.navigate('ShopList',  {
                title: 'Popular Shops Near You',
              })}
              location={location}
              showDistance={true}
            />

            <MetricCards />

            <ShopListContainer
              title="Best Deals"
              shops={shops}
              onViewAll={() => navigation.navigate('ShopList',  {
                title: 'Best Deals',
              })}
              filter={s => Number(s.makingCharges) < 15}
              onShopPress={handleShopPress}
              location={location}
            />

            <ReachOutSection />
          </>
        }
        ListFooterComponent={<View style={{ height: 10 }} />}
      />
    </View>
  );
}

const makeStyles = (colors: Theme['colors']) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
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
    color: colors.background,
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  disabledButton: {
    backgroundColor: colors.secondaryBackground,
  },
  disabledText: {
    color: colors.background,
  },
  bannerWrapper: {
    height: 400,
    marginBottom: 0,
    overflow: 'hidden',
  },
  bannerItem: {
    width: Dimensions.get('window').width,
    height: 360,
  },
  bannerGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    zIndex: 1,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
    gap: 12,
  },
  bannerButton: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  bannerButtonText: {
    color: colors.background,
    fontWeight: 'bold',
  },
  bannerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bannerSubText: {
    color: 'white',
    fontSize: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  viewAll: {
    color: colors.primary,
    fontSize: 14,
  },
  reachOutSection: {
    margin: 15,
    padding: 20,
    backgroundColor: colors.secondaryBackground,
    borderRadius: 10,
    alignItems: 'center',
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    padding: 15,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  contactText: {
    color: colors.background,
    marginLeft: 10,
    fontSize: 16,
  },
  partnerContainer: {
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  partnerLogo: {
    width: 100,
    height: 60,
    marginRight: 20,
    resizeMode: 'contain',
  },
  metricContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
  },
  metricCard: {
    backgroundColor: colors.secondaryBackground,
    padding: 15,
    borderRadius: 10,
    flex: 1,
  },
  cardSubtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  cardTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metricValue: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  metricChange: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  cardFooter: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  badge: {
    backgroundColor: colors.primary,
    padding: 5,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  badgeText: {
    color: colors.background,
    fontSize: 12,
    fontWeight: 'bold',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'transparent', // Semi-transparent white
    borderRadius: 10,
    marginHorizontal: 15,
    zIndex: 2,
    elevation: 3,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    letterSpacing: 1.5,
  },
  animatedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: colors.background,
  },
  headerRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  locationText: {
    color: colors.background,
    fontSize: 14,
    fontWeight: '500',
  },
  bannerContent: {
    paddingHorizontal: 0,
    paddingBottom: 60,
  },
  dotsContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    zIndex: 2,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.textSecondary,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: colors.primary,
  },
});
