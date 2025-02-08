import React from 'react';
import { View, FlatList, Image, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Theme } from '../constants/Theme';

type Props = {
  logos: Array<string | number>;
};

const PartnerLogos = ({ logos }: Props) => {
  const { theme } = useTheme();
  const styles = makeStyles(theme.colors);

  return (
    <FlatList
      horizontal
      data={logos}
      renderItem={({ item }) => (
        <Image source={typeof item === 'string' ? { uri: item } : item} 
               style={styles.logo} />
      )}
      contentContainerStyle={styles.container}
      showsHorizontalScrollIndicator={false}
    />
  );
};

const makeStyles = (colors: Theme['colors']) => StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 60,
    marginRight: 20,
    resizeMode: 'contain',
  },
});

export default PartnerLogos; 