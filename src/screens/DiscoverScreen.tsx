import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Icon } from "react-native-elements";
import { useTheme } from "../contexts/ThemeContext";
import SearchBar from "../components/SearchBar";
import { Theme } from "../constants/Theme";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList, Shop, TabStackParamList } from "../types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type DiscoverScreenProps = {
  route: RouteProp<TabStackParamList, "Discover">;
  navigation: NativeStackNavigationProp<RootStackParamList, "Home">;
};

export default function DiscoverScreen({
  route,
  navigation,
}: DiscoverScreenProps) {
  const { theme } = useTheme();
  const styles = makeStyles(theme.colors);
  const [searchVal, setSearchVal] = useState("");

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.heroSection}>
        <Text style={styles.heading}>Discover the Best Gold Prices</Text>
        <Text style={styles.subtitle}>
          Compare, locate, and get the best deals from trusted shops near you.
        </Text>

        <SearchBar
          value={searchVal}
          onChangeText={(text) => setSearchVal(text)}
        />

        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => {
            if (!searchVal) {
              return;
            }
            navigation.navigate("ShopList", {
              title: "Search Results...",
              searchQuery: searchVal,
              sort: {
                field: "updatedAt",
                order: "des",
              },
            });
            setSearchVal('')
          }} 
        >
          <Text style={styles.ctaText}>Find Best Deals</Text>
          <Icon
            name="arrow-forward"
            color={theme.colors.darkGray}
            size={22}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.featuresContainer}>
        <View style={styles.featureCard}>
          <Icon name="timeline" size={30} color={theme.colors.primary} />
          <Text style={styles.featureTitle}>Real-time Prices</Text>
          <Text style={styles.featureText}>
            Get up-to-date gold prices from shops in your area
          </Text>
        </View>

        <View style={styles.featureCard}>
          <Icon name="location-on" size={30} color={theme.colors.primary} />
          <Text style={styles.featureTitle}>Shop Locator</Text>
          <Text style={styles.featureText}>
            Find trusted gold shops near you with detailed directions
          </Text>
        </View>

        <View style={styles.featureCard}>
          <Icon name="verified-user" size={30} color={theme.colors.primary} />
          <Text style={styles.featureTitle}>Verified Reviews</Text>
          <Text style={styles.featureText}>
            Read authentic reviews from verified customers
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const makeStyles = (colors: Theme["colors"]) =>
  StyleSheet.create({
    container: {
      // padding: 20,
      // paddingTop: 80,
      alignItems: "center",
      backgroundColor: colors.background,
    },
    heroSection: {
      width: "100%",
      alignItems: "center",
      padding: 20,
      paddingTop: 80,
      backgroundColor: colors.primary,
      borderRadius: 16,
      elevation: 5,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
    },
    heading: {
      fontSize: 26,
      fontWeight: "bold",
      color: colors.pureBlack,
      marginBottom: 10,
      textAlign: "center",
    },
    subtitle: {
      fontSize: 16,
      color: colors.darkGray,
      marginBottom: 20,
      textAlign: "center",
    },
    searchBar: {
      width: "100%",
      marginBottom: 20,
    },
    ctaButton: {
      flexDirection: "row",
      backgroundColor: colors.primary,
      paddingVertical: 15,
      paddingHorizontal: 25,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
    },
    ctaText: {
      color: colors.darkGray,
      fontSize: 18,
      fontWeight: "600",
      marginRight: 10,
    },
    featuresContainer: {
      padding: 20,
      marginTop: 30,
      width: "100%",
    },
    featureCard: {
      backgroundColor: colors.secondaryBackground,
      padding: 20,
      borderRadius: 12,
      marginBottom: 15,
    },
    featureTitle: {
      color: colors.textPrimary,
      fontSize: 18,
      fontWeight: "600",
      marginBottom: 5,
    },
    featureText: {
      color: colors.textSecondary,
      fontSize: 14,
      lineHeight: 20,
    },
  });
