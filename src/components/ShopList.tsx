import React from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity, Text, Image } from 'react-native';
import { Shop } from '../types';

interface ShopListProps {
  shops: Shop[];
  onShopPress: (shop: Shop) => void;
}

export default function ShopList({ shops, onShopPress }: ShopListProps) {
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
          <Text>Making Charges: {item.makingCharges}%</Text>
          <Text>Gold Rate: ₹{item.goldRate}/g</Text>
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
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    padding: 10,
  },
  shopItem: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
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
  },
  textContainer: {
    flex: 1,
  },
  shopName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  shopLocality: {
    color: '#666',
    marginTop: 4,
  },
  ratesContainer: {
    marginTop: 8,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
});