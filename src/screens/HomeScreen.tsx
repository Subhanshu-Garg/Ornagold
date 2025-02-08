import React, { useState, useLayoutEffect, useEffect, useRef } from 'react';
import { StyleSheet, View, SafeAreaView, TouchableOpacity, Text, ScrollView, Image, FlatList, Dimensions } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Shop, TabStackParamList } from '../types';
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

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'MainTabs'>
};

const BANNER_IMAGES = [
  { 
    uri: 'https://t4.ftcdn.net/jpg/05/27/71/81/360_F_527718147_x7XDK929xZnZqjgh0oPYz7xK0EvtnlIF.jpg',
    color: '#F9DEB3'
  },
  {
    uri: 'https://cdn.shopify.com/s/files/1/1115/6326/files/B1007_Diamond_Pendants_1002_thumb_cdacec1a-3aec-487f-b9be-4c723c3801ca.jpg?v=1602840981',
    color: '#D8BAC0'
  },
  {
    uri: 'https://t3.ftcdn.net/jpg/05/79/60/44/360_F_579604488_9ACQ2qfvXqH4B6VQoEi7ZG29X0qjlIfT.jpg',
    color: '#FDFDFB' 
  }
];

const PARTNER_LOGOS = [
  require('../../assets/images/icon.png')
  // 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIGlkPSJhIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMTQuODMgNzQuNzkiPjxkZWZzPjxzdHlsZT4uYntmaWxsOiM4MzI3Mjk7ZmlsbC1ydWxlOmV2ZW5vZGQ7fTwvc3R5bGU+PC9kZWZzPjxwYXRoIGNsYXNzPSJiIiBkPSJNMzguNzksNy41NWMtLjYyLTIuOTEsMS4zMi01LjU2LDQuMTUtNS41Nmg3Ljk1YzIuMTIsLjA5LDQuNzctMS41OSw0Ljc3LTEuNTlWMTMuNzNjMCwxMy41MS03LjQyLDE5LjI0LTEwLjg2LDE5Ljc3LS42MiwuMjctMS4wNiwuMDktLjI2LS41Myw0LjY4LTMsNy40Mi0xMC4xNSw3LjY4LTE2LjI0VjQuNTVjLS45NywuNjItMi44MiwuNzEtMi44MiwuNzFoLTYuOTdjLTEuODUsMC0yLjgyLC42Mi0zLjYyLDIuMjltMzUuNTgsMGMuNjItMi45MS0xLjI0LTUuNTYtNC4xNS01LjU2aC03Ljk1Yy0yLjAzLC4wOS00Ljc3LTEuNTktNC43Ny0xLjU5VjEzLjczYzAsMTMuNTEsNy40MiwxOS4yNCwxMC44NiwxOS43NywuNjIsLjI3LDEuMDYsLjA5LC4yNy0uNTMtNC42OC0zLTcuNDItMTAuMTUtNy42OC0xNi4yNFY0LjU1Yy45NywuNjIsMi44MiwuNzEsMi44MiwuNzFoNy4wNmMxLjg1LDAsMi44MywuNjIsMy41MywyLjI5aDBaTTIwLjI2LDYyLjk5Yy0uNzEtMS43Ny0uMTgtMy43MSwuMjYtNC40MWg4LjAzdjQuNDFoMi4wM3YtMTkuNTFzLS42Mi0uMDktMS4wNiwuNjJjLTMsNC43Ny01LjMsNi04LjY1LDkuMzYtMi44MywyLjgyLTQuOTQsNi0zLjg5LDkuNTNoMy4yN1ptLjg4LTUuNzRoNy40MnYtOC4zOWMtMS44NSwzLjQ0LTYuMjcsNS4zLTcuNDIsOC4zOVptODQuOTMtMTUuOGMtMi41NiwyLjUzLTQuNjgsMy44LTUuODMsNi40NC0xLjI0LDIuNjUtMS41OSw2LjQ0LDAsOS43MSwxLjc3LDMuNjIsMy44LDUuNTYsNi4xOCw3Ljk0LDEuNjgsMS44NSw0Ljg2LDUuNTYsMy44LDguODMsLjc5LDAsMS44NS0xLjk0LDIuMDMtMi42NSwuNDQtMi4yOSwuMTgtMy40NC0uNzktNS4xMi0uNjItMS4xNS0xLjk0LTIuMjktMi45MS0zLjQ0LDEuNDEtMS4xNSwyLjkxLTIuODMsNC4xNS00LjUsMS41OS0yLjIxLDIuNTYtNS45MSwuNTMtOS41My0xLjg1LTMuNDQtNy4wNi02LjYyLTcuMTUtNy42OGgwWm0xLjA2LDIwLjM5Yy0yLjAzLTEuNjgtMy4yNy0zLjA5LTQuNS01LjgzLTEuMjQtMi40Ny0xLjMyLTUuMzktLjc5LTcuNDIsLjYyLTIuMjEsMi4xMi0zLjgsMy41My00Ljk0LDEuNTksMS4xNSwzLjI3LDIuNTYsNC41LDQuNTksMi4wMywzLjQ0LDIuMDMsNS45MSwuNzEsOS4yNy0uNzksMS45NC0xLjY4LDMuMDktMy40NCw0LjMzaDBaTS41Nyw0NS4wN2MtLjM1LS43MSwuMTgtMi41NiwyLjMtMi4zOEgxMy4yOGMxLjMyLC4wOSwyLjEyLS44OCwzLjgtLjcxLTIuMzgsMS45NC0yLjY1LDIuOTEtMy4wOSw0Ljc3bC0xLjY4LDEzLjY4Yy0uNDQsNS41NiwxLjE1LDEwLjE1LDUuMywxMy45NS0yLjU2LC4zNS04LjEyLTMuNzEtOC4zLTExLjEyLS4xOC0zLjcxLC44OC0xNS41NCwuODgtMTUuNTQsLjI2LTEuOTQsMS41LTMuMzUsMS41LTMuMzVIMS44Yy0uNjIsLjA5LS45NywuMDktMS4yNCwuNzFILjU3Wm04MS44NCwxNy4zOWgyLjU2di01LjIxaDYuOTd2NS40N2gyLjY1di0xOC44OWgtMi42NXYxMS45MmgtNi45N3YtMTEuOTJoLTIuNTZ2MTguNjNoMFptLTcuMTUtMTQuMjFjLS42MiwuMTgtMS4yNC0uMDktMS44NS0uNjItLjg4LS43OS0xLjI0LTEuNTktMi4zOC0yLjI5LTEuMjQtLjYyLTMtLjcxLTQuMDYsLjA5LS45NywuNzEtLjk3LDIuMywuMDksMy4xOCwyLjAzLDEuNTksNC4yNCwyLjQ3LDYuOCwzLjgsNC42OCwyLjQ3LDUuNDcsNi44LDIuMjEsOS0yLjc0LDEuODUtNi4xOCwyLjAzLTkuMjcsLjg4LTIuMzgtLjk3LTQuMjQtMi45MS00LjUtNS4zLDEuNTksMCwyLjEyLC43MSwyLjc0LDEuNjgsLjk3LDEuMzIsMS41OSwxLjg1LDMsMi40NywyLjAzLC43OSw0LjMzLC41Myw1LjY1LS4yNiwxLjk4LTEuMjQsMS42OC0zLjI3LC4yNi00LjU5LTIuOTEtMi43NC02LjUzLTMuNTMtOC41Ni01LjU2LTEuNzctMS43Ny0yLjM4LTMuNzEtLjUzLTUuNzQsMS41OS0xLjY4LDUuODMtMi4yMSw4LjMtLjA5LDEuMDYsLjk3LDEuODUsMi4xMiwyLjEyLDMuMzVoMFptLTIxLjEtMTAuMDZjMC0xLjQxLDEuMDYtMi40NywyLjQ3LTIuNDcsMS4yNCwwLDIuMzgsMS4wNiwyLjM4LDIuNDcsMCwxLjMyLTEuMTUsMi40Ny0yLjM4LDIuNDctMS40MSwwLTIuNDctMS4xNS0yLjQ3LTIuNDdabTEuMTUsNS42NWgyLjQ3djE5LjE2aC0yLjQ3di0xOS4xNptLTE5LjI1LDE5LjE2aDEuNzd2LTEzLjE1Yy44OCwyLjU2LDUuMjEsNS45Miw1LjIxLDUuOTIsMCwwLDMuMzUsMi44Myw0Ljk0LDYuNzFsMS4wNiwuNTN2LTE5LjE2aC0xLjc3djEzLjQyYy0uOTctMi41Ni00Ljc3LTUuNTYtNC43Ny01LjU2LTIuOTEtMi41Ni00Ljg2LTYuMDktNS4zLTcuNzdsLTEuMTUtLjM1djE5LjQyaDBaIi8+PC9zdmc+',
];

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const {  loading } = useAuth()
  const [shops, setShops] = useState<Shop[]>([]);
  const { theme } = useTheme();
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [currentCity, setCurrentCity] = useState('');
  const [activeBanner, setActiveBanner] = useState(0);
  const { setHeaderColor } = useHeaderColor();
  const flatListRef = useRef<FlatList>(null);

  const styles = makeStyles(theme.colors)

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if(location) {
        const geo = await Location.reverseGeocodeAsync(location.coords);
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
    <SafeAreaView style={styles.container}>
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
              onViewAll={() => navigation.navigate('ShopList', { 
                filter: 'nearby',
                title: 'All Nearby Shops'
              })}
              location={location}
              showDistance={true}
            />

            <ShopListContainer
              title="Best Deals"
              shops={shops}
              filter={s => Number(s.makingCharges) < 15}
              onShopPress={handleShopPress}
              location={location}
            />

            <ReachOutSection />
            <PartnerLogos logos={PARTNER_LOGOS} />
            <MetricCards />
          </>
        }
        ListFooterComponent={<View style={{ height: 80 }} />}
      />
    </SafeAreaView>
  );
}

const makeStyles = (colors: Theme['colors']) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 0,
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
    marginTop: 50, // Add space for system status bar
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
