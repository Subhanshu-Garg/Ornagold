import React from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity, Text, Image, ActivityIndicator } from 'react-native';
import { Shop } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { Theme } from '../constants/Theme';

interface ShopListProps {
  shops: Shop[];
  onShopPress: (shop: Shop) => void;
  onEndReached?: () => void;
  hasMore?: boolean;
}

export default function ShopList({ 
  shops, 
  onShopPress, 
  onEndReached,
  hasMore 
}: ShopListProps) {
  const { theme } = useTheme();
  const styles = makeStyles(theme.colors);

  const renderShopItem = ({ item }: { item: Shop }) => (
    <TouchableOpacity
      style={styles.shopItem}
      onPress={() => onShopPress(item)}
    >
      <Image
        style={styles.shopImage}
        source={{ uri: item.logoImage }}
        resizeMode="cover"
      />
      <View style={styles.textContainer}>
        <Text style={styles.shopName}>{item.name}</Text>
        {/* <Text style={styles.shopLocality}>{item.locality}</Text> */}
        <View style={styles.ratesContainer}>
          <Text style={styles.rateText}>Making Charges: {item.makingCharges}%</Text>
          <Text style={styles.rateText}>Gold Rate: ₹{item.goldRate}/g</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={shops}
      renderItem={renderShopItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContainer}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        hasMore ? <ActivityIndicator size="small" color="#0000ff" /> : null
      }
    />
  );
}

const makeStyles = (colors: Theme['colors']) => StyleSheet.create({
  listContainer: {
    padding: 10,
  },
  shopItem: {
    backgroundColor: colors.secondaryBackground,
    borderColor: colors.primary,
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    flexDirection: 'row',
  },
  shopImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 15,
    backgroundColor: colors.secondary
  },
  textContainer: {
    flex: 1,
  },
  shopName: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  shopLocality: {
    color: colors.textSecondary,
    opacity: 0.8,
    marginTop: 4,
  },
  ratesContainer: {
    marginTop: 8,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  rateText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
});