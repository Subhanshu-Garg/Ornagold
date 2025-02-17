import React, { useRef } from "react";
import {
  FlatList,
  View,
  Text,
  Image,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";
import { Theme } from "../constants/Theme";
import Carousel, { Props } from "pinar";
import { Icon } from "@rneui/themed";
import { Banner } from "../types";

import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";
import { handleContactPress } from "../helpers";

// This is the default configuration
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false, // Reanimated runs in strict mode by default
});

export interface BannerCarouselProps {
  banners: Banner[]
};

const BannerCarousel = ({
  banners
}: BannerCarouselProps) => {
  const { theme } = useTheme();
  const styles = makeStyles(theme.colors);

  const renderBannerItem = ({ item }: { item: Banner }) => (
    <View key={item.key} style={styles.bannerItem}>
      <Image
        source={{ uri: item.uri }}
        style={styles.bannerImage}
        resizeMode="cover"
      />
      <LinearGradient
        colors={[
          theme.colors.secondaryBackground,
          "transparent",
          "transparent",
          theme.colors.background,
        ]}
        locations={[0, 0.5, 0.7, 0.95]}
        style={styles.gradientOverlay}
      >
        <View style={styles.bannerContent}>
          <Text style={styles.bannerTitle}>{item.bannerTitle}</Text>
          <Text style={styles.bannerSubtitle}>{item.bannerText}</Text>

          <TouchableOpacity
            style={styles.ctaButton}
            onPress={() => handleContactPress()}
          >
            <Text style={styles.ctaText}>{item.ctaText}</Text>
            <Icon
              name="trending-up"
              color={theme.colors.background}
              size={16}
            />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );

  const width = Dimensions.get("window").width;
  return (
    <View style={{ flex: 1 }}>
      <Carousel
        autoplay
        showsControls={false}
        loop
        width={width}
        height={width}
        dotStyle={styles.dot}
        activeDotStyle={styles.activeDot}
      >
        {banners.map((item, index) => {
          item.key = index
          return renderBannerItem({ item })
        })}
      </Carousel>
    </View>
  );
};

export default BannerCarousel;

const makeStyles = (colors: Theme["colors"]) =>
  StyleSheet.create({
    container: {
      height: 420,
      marginBottom: 10,
    },
    bannerItem: {
      width: Dimensions.get("window").width,
      height: Dimensions.get("window").width + 20,
      position: "relative",
      overflow: "visible",
    },
    bannerImage: {
      ...StyleSheet.absoluteFillObject,
      width: "100%",
      height: "100%",
    },
    gradientOverlay: {
      ...StyleSheet.absoluteFillObject,
      padding: 24,
      justifyContent: "flex-end",
      paddingBottom: 40,
    },
    bannerContent: {
      maxWidth: "70%",
    },
    bannerTitle: {
      fontSize: 28,
      fontWeight: "800",
      color: colors.background,
      lineHeight: 34,
      marginBottom: 12,
      textShadowColor: "rgba(0,0,0,0.2)",
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 2,
    },
    bannerSubtitle: {
      fontSize: 18,
      color: colors.background,
      lineHeight: 24,
      opacity: 0.9,
      marginBottom: 24,
    },
    ctaButton: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.primary,
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 6,
      alignSelf: "flex-start",
      gap: 6,
      marginTop: 5,
      marginBottom: 20,
    },
    ctaText: {
      color: colors.background,
      fontSize: 14,
      fontWeight: "600",
    },
    gradient: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      height: 100,
      zIndex: 1,
    },
    dotsContainer: {
      position: "absolute",
      bottom: 20,
      left: 0,
      right: 0,
      flexDirection: "row",
      justifyContent: "center",
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
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.primary,
      marginHorizontal: 4,
    },
  });
