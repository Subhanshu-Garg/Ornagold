import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Icon } from '@rneui/themed';
import { useHeaderColor } from '../contexts/HeaderColorContext';
import { useTheme } from '../contexts/ThemeContext';
import { Theme } from '../constants/Theme';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';

export default function CustomHeader() {
  const navigation = useNavigation();
  const { headerColor } = useHeaderColor();
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
    <View style={[styles.header, { backgroundColor: theme.colors.secondaryBackground }]}>
      {/* <Image 
        source={require('../../assets/images/logo.png')}
        style={styles.logo}
      /> */}
      <Image 
        source={require('../../assets/images/brand-name.png')}
        style={styles.name}
      />
      <TouchableOpacity 
        style={styles.cityTag}
        // onPress={() => navigation.navigate('CitySelect')}
      >
        <Icon name="location-on" size={20} color={theme.colors.primary} />
        <Text style={styles.cityText}>{currentCity}</Text>
      </TouchableOpacity>
    </View>
  );
}

const makeStyles = (colors: Theme['colors']) => StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    paddingTop: 50,
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
    width: 180,
    height: 40,
    marginRight: 10,
  },
  cityTag: {
    flexDirection: 'column',
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
  }
}); 