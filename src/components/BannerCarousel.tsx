import React, { useRef } from 'react';
import { FlatList, View, Image, Dimensions, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Theme } from '../constants/Theme';

type Props = {
  banners: Array<{ uri: string; color: string }>;
  activeIndex: number;
  onBannerChange: (index: number) => void;
  headerColor: string;
};

const BannerCarousel = ({ banners, activeIndex, onBannerChange, headerColor }: Props) => {
  const { theme } = useTheme();
  const flatListRef = useRef<FlatList>(null);
  const styles = makeStyles(theme.colors);

  const renderBannerItem = ({ item }: { item: { uri: string; color: string } }) => (
    <View style={styles.bannerItem}>
      <Image 
        source={{ uri: item.uri }} 
        style={styles.bannerImage} 
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        horizontal
        data={banners}
        renderItem={renderBannerItem}
        keyExtractor={(_, index) => index.toString()}
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={({ nativeEvent }) => {
          const index = Math.round(nativeEvent.contentOffset.x / Dimensions.get('window').width);
          if (index !== activeIndex) {
            onBannerChange(index);
          }
        }}
      />
      <LinearGradient
        colors={[banners[activeIndex].color, headerColor]}
        locations={[0, 0.7]}
        style={styles.gradient}
      />
      <View style={styles.dotsContainer}>
        {banners.map((_, index) => (
          <View 
            key={index} 
            style={[
              styles.dot,
              index === activeIndex && styles.activeDot
            ]}
          />
        ))}
      </View>
    </View>
  );
};

export default BannerCarousel; 


const makeStyles = (colors: Theme['colors']) => StyleSheet.create({
    container: {
      height: 420,
      marginBottom: 10,
    },
    bannerItem: {
      width: Dimensions.get('window').width,
      height: 420,
    },
    bannerImage: {
      flex: 1,
      resizeMode: 'cover',
    },
    gradient: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 100,
      zIndex: 1,
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
  })