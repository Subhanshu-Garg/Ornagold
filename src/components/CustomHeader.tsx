import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Icon } from '@rneui/themed';
import { useTheme } from '../contexts/ThemeContext';
import { Theme } from '../constants/Theme';
import * as Location from 'expo-location';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CustomHeader() {
  const { theme } = useTheme();
  const styles = makeStyles(theme.colors);
  const [currentCity, setCurrentCity] = useState('');

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      
      let location = await Location.getLastKnownPositionAsync({}) || await Location.getCurrentPositionAsync({});
      const geo = await Location.reverseGeocodeAsync(location.coords);
      setCurrentCity(geo[0].city || 'Your City');
    })();
  }, []);

  return (
    <SafeAreaView edges={['top']} style={styles.headerContainer}>
      <View style={styles.header}>
        <Image 
          source={require('../../assets/images/adaptive-icon.png')}
          style={styles.logo}
        />
        {/* <Image 
          source={require('../../assets/images/brand-name.png')}
          style={styles.name}
        /> */}
        <Text style={styles.name}>OrnaGold</Text>
        <TouchableOpacity 
          style={styles.cityTag}
          // onPress={() => navigation.navigate('CitySelect')}
        >
          <Text style={styles.cityText}>{currentCity}</Text>
          <Icon name="location-on" size={20} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const makeStyles = (colors: Theme['colors']) => StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    height: 60,
    backgroundColor: colors.secondaryBackground,
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  name: {
    fontSize: 25,
    fontWeight: '800',
    color: colors.primary,
    width: 'auto',
    height: 40,
    marginRight: 10,
  },
  cityTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginLeft: 'auto',
    gap: 4
  },
  cityText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary
  },
  headerContainer: {
    backgroundColor: colors.background
  },
}); 