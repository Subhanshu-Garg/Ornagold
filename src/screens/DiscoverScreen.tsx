import React from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import { useTheme } from '../contexts/ThemeContext';
import SearchBar from '../components/SearchBar';
import { Theme } from '../constants/Theme';

export default function DiscoverScreen() {
  const { theme } = useTheme();
  const styles = makeStyles(theme.colors);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Find the Best Gold Prices Near You</Text>
      <Text style={styles.subtitle}>Compare prices, locate nearby shops, and get the best deals on gold purchases</Text>
      
      <SearchBar value='' onChangeText={() => ''}/>

      <TouchableOpacity style={styles.ctaButton}>
        <Text style={styles.ctaText}>Find Best Deals</Text>
        <Icon name="arrow-forward" color={theme.colors.background} />
      </TouchableOpacity>

      <View style={styles.featuresContainer}>
        <View style={styles.featureCard}>
          <Icon name="timeline" size={30} color={theme.colors.primary} />
          <Text style={styles.featureTitle}>Real-time Prices</Text>
          <Text style={styles.featureText}>Get up-to-date gold prices from shops in your area</Text>
        </View>

        <View style={styles.featureCard}>
          <Icon name="location-on" size={30} color={theme.colors.primary} />
          <Text style={styles.featureTitle}>Shop Locator</Text>
          <Text style={styles.featureText}>Find trusted gold shops near you with detailed directions</Text>
        </View>

        <View style={styles.featureCard}>
          <Icon name="verified-user" size={30} color={theme.colors.primary} />
          <Text style={styles.featureTitle}>Verified Reviews</Text>
          <Text style={styles.featureText}>Read authentic reviews from verified customers</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const makeStyles = (colors: Theme['colors']) => StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 40,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 15,
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 30,
    lineHeight: 24,
  },
  searchBar: {
    marginBottom: 20,
  },
  ctaButton: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  ctaText: {
    color: colors.background,
    fontSize: 18,
    fontWeight: '600',
  },
  featuresContainer: {
    gap: 20,
  },
  featureCard: {
    backgroundColor: colors.secondaryBackground,
    padding: 20,
    borderRadius: 12,
    gap: 12,
  },
  featureTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '600',
  },
  featureText: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
}); 