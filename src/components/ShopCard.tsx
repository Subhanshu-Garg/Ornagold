import React, { View, Image, Text } from 'react';
import { Icon } from '@expo/vector-icons';
import { ShopCardProps } from '../types/ShopCardProps';
import { styles } from '../styles/ShopCardStyles';
import MetricItem from './MetricItem';

// Enhanced shop card with Stable Money-like design
export default function ShopCard({ shop, distance }: ShopCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Image source={{ uri: shop.logoImage }} style={styles.shopLogo} />
        <View style={styles.distanceBadge}>
          <Icon name="location-pin" size={14} />
          <Text style={styles.distanceText}>{distance}</Text>
        </View>
      </View>
      
      <Text style={styles.shopName}>{shop.name}</Text>
      
      <View style={styles.metricsContainer}>
        <MetricItem value={`${shop.makingCharges}%`} label="Making" />
        <MetricItem value={`₹${shop.goldRate}/g`} label="Gold Rate" />
        <MetricItem value="4.8 ★" label="Rating" />
      </View>

      {shop.specialOffer && (
        <View style={styles.offerBadge}>
          <Text style={styles.offerText}>{shop.specialOffer}</Text>
        </View>
      )}
    </View>
  );
} 