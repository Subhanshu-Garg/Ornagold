import React from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity, Text, Image, ActivityIndicator, Dimensions } from 'react-native';
import { Shop } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { Theme } from '../constants/Theme';
import { Icon } from 'react-native-elements';
import * as Location from 'expo-location';

export interface ShopListProps {
  shops: Shop[];
  onShopPress: (shop: Shop) => void;
  onEndReached?: () => void;
  hasMore?: boolean;
  horizontal?: boolean;
  showDistance?: boolean;
  location?: Location.LocationObject | null;
}

export default function ShopList({ 
  shops,
  onShopPress,
  onEndReached,
  hasMore,
  horizontal = false,
  showDistance = false,
  location
}: ShopListProps) {
  const { theme } = useTheme();
  const styles = makeStyles(theme.colors);

  const calculateDistance = (shopLat: number, shopLon: number) => {
    if (!location) return 'N/A';
    
    const R = 6371; // Earth radius in km
    const dLat = (shopLat - location.coords.latitude) * Math.PI / 180;
    const dLon = (shopLon - location.coords.longitude) * Math.PI / 180;

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + 
              Math.cos(location.coords.latitude * Math.PI / 180) * 
              Math.cos(shopLat * Math.PI / 180) * 
              Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const roadDistanceFactor = 1.2;
    const distance = R * c * roadDistanceFactor;

    return `${Math.round(distance * 10) / 10} km`;
};


  const handleShopPress = (shop: Shop) => {
    if (!shop?.id) {
      console.error('Invalid shop data:', shop);
      return;
    }
    onShopPress(shop);
  };

  const renderShopItem = ({ item }: { item: Shop }) => (
    <TouchableOpacity
      style={[styles.shopItem, horizontal ? styles.horizontalItem : styles.verticalItem]}
      onPress={() => handleShopPress(item)}
    >
      <Image
        style={styles.shopImage}
        source={{ uri: item.logoImage }}
        resizeMode="cover"
      />
      <View style={styles.textContainer}>
        <Text 
          style={styles.shopName} 
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {item.name}
        </Text>
        
        {showDistance && location && (
          <View style={styles.distanceContainer}>
            <Icon name="location-on" size={14} color={theme.colors.primary} />
            <Text style={styles.distanceText}>
              ~{calculateDistance(item.latitude, item.longitude)}
            </Text>
          </View>
        )}

        <View style={styles.ratesContainer}>
          <View style={styles.rateRow}>
            <Text style={styles.rateLabel}>Gold Rate:</Text>
            <Text style={styles.rateValue}>₹{item.goldRate}/g</Text>
          </View>
          <View style={styles.rateRow}>
            <Text style={styles.rateLabel}>Making Charges:</Text>
            <Text style={styles.rateValue}>{item.makingCharges}%</Text>
          </View>
        </View>
      </View>
      {/* {item.specialOffer && (
        <View style={styles.offerBadge}>
          <Text style={styles.offerText}>{shop.specialOffer}</Text>
        </View>
      )} */}
    </TouchableOpacity>
  );

  return (
    <FlatList
      horizontal={horizontal}
      numColumns={!horizontal ? 2 : undefined}
      data={shops}
      renderItem={renderShopItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={
        horizontal ? styles.horizontalList : styles.verticalList
      }
      onEndReached={onEndReached}
      onEndReachedThreshold={0.3}
      showsHorizontalScrollIndicator={false}
      ListFooterComponent={
        !horizontal && hasMore ? <ActivityIndicator size="small" color="#0000ff" style={{ marginVertical: 10 }} /> : null
      }
    />
  );
}

const makeStyles = (colors: Theme['colors']) => StyleSheet.create({
  horizontalList: {
    paddingLeft: 15,
  },
  verticalList: {
    paddingHorizontal: 0,
    paddingBottom: 20
  },
  shopItem: {
    backgroundColor: colors.secondaryBackground,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 2,
    shadowColor: colors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    width: (Dimensions.get('window').width - 55) / 2,
    marginRight: 15,
    height: 260,
  },
  horizontalItem: {
    marginRight: 15,
  },
  shopImage: {
    width: '100%',
    height: 140,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: colors.secondary,
  },
  textContainer: {
    padding: 10,
    flex: 1,
  },
  shopName: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 4,
    height: 32,
    lineHeight: 16,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  distanceText: {
    color: colors.textSecondary,
    fontSize: 12,
    marginLeft: 4,
  },
  ratesContainer: {
    marginTop: 'auto',
  },
  rateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  rateLabel: {
    color: colors.textSecondary,
    fontSize: 10,
  },
  rateValue: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: '500',
  },
  verticalItem: {
    width: (Dimensions.get('window').width - 45) / 2,
    marginBottom: 10,
  },
});