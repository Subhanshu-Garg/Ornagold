import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Theme } from '../constants/Theme';
import ShopList from '../components/ShopList';

export default function FavoritesScreen() {
  const { theme } = useTheme();
  const styles = makeStyles(theme.colors);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Favorite Shops</Text>
      <ShopList 
        shops={[]} // Pass favorite shops here
        onShopPress={(shop) => console.log('Navigate to shop', shop)}
        horizontal={false}
        showDistance={true}
      />
    </View>
  );
}

const makeStyles = (colors: Theme['colors']) => StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 20,
  },
}); 