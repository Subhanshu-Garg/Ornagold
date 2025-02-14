import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { Icon } from "react-native-elements";
import { Share } from "react-native";
import { handleContactPress } from "../helpers";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList, Shop } from "../types";
import { SafeAreaView } from "react-native-safe-area-context";
import EditProfileModal from "../components/EditProfileModal";
import { Theme } from "../constants/Theme";
import useStatusBarColor from "../hooks/useStatusBarColor";
import { errorHandler } from "../utils/errorHandler";
import { getMyShops } from "../services/shops";

type ProfileScreenNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

type ProfileScreenProps = {
  navigation: ProfileScreenNavigationProp;
};

export default function ProfileScreen({ navigation }: ProfileScreenProps) {
  const { user, myShops, signOut } = useAuth();
  const { theme } = useTheme();
  const styles = makeStyles(theme.colors);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  useStatusBarColor(theme.colors.primary);
  const isShopOwner = myShops.length > 0;

  const handleAuth = async () => {
    if (user) {
      await signOut();
    } else {
      navigation.navigate("Auth");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Profile Header */}
        <View style={styles.profileBackground}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <Icon
                name="person"
                size={40}
                color={theme.colors.background}
                containerStyle={styles.avatar}
              />
              <TouchableOpacity
                style={styles.editIcon}
                onPress={() => setEditModalVisible(true)}
              >
                <Icon name="edit" size={16} color={theme.colors.primary} />
              </TouchableOpacity>
            </View>
            <View style={styles.profileDetails}>
              <Text style={styles.userName}>
                {user?.user_metadata?.displayName || "Guest User"}
              </Text>
              {user?.email && (
                <Text style={styles.userDetail}>{user.email}</Text>
              )}
              {user?.phone && (
                <Text style={styles.userDetail}>+{user.phone}</Text>
              )}
            </View>
          </View>
        </View>

        {/* Shop Owner Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Business Tools</Text>
          {isShopOwner && (
            <>
              <MenuItem
                icon="store"
                title="My Shops"
                color={theme.colors.primary}
                onPress={() =>
                  myShops.length > 1
                    ? navigation.navigate("ShopList", {
                        title: "My Shops",
                        isMyShops: true,
                      })
                    : navigation.navigate("Shop", {
                        shop: myShops[0],
                      })
                }
              />
              {/* <MenuItem
              icon="analytics"
              title="Shop Analytics"
              color={theme.colors.primary}
              onPress={() => navigation.navigate('ShopAnalytics')}
            />
            <MenuItem
              icon="inventory"
              title="Manage Inventory"
              color={theme.colors.primary}
              onPress={() => navigation.navigate('Inventory')}
            /> */}
            </>
          )}
          <MenuItem
            icon="add-business"
            title="Create New Shop"
            color={theme.colors.primary}
            onPress={() =>
              navigation.navigate("CreateShop", {
                title: "Create Shop",
              })
            }
          />
        </View>

        {/* General Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Features</Text>
          <MenuItem
            icon="group-add"
            title="Invite a Friend"
            color="#4CAF50"
            onPress={() => {
              Share.share({
                message: `Check out this awesome jewelry app! Find the best gold rates and shops near you.\n\nDownload now: https://play.google.com/store/apps/details?id=com.goldapp`,
                title: "Share Ornagold App",
              });
            }}
          />
          <MenuItem
            icon="support-agent"
            title="Talk to Our Expert"
            color="#2196F3"
            onPress={() => handleContactPress()}
          />
          <MenuItem
            icon="help-center"
            title="FAQs & Support"
            color="#9C27B0"
            onPress={() => navigation.navigate("FAQs")}
          />
        </View>

        {/* Account Management */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          {/* <MenuItem
            icon="settings"
            title="App Settings"
            onPress={() => navigation.navigate('Settings')}
          /> */}
          <MenuItem
            icon="security"
            title="Privacy Policy"
            onPress={() => navigation.navigate("PrivacyPolicy")}
          />
          <TouchableOpacity style={styles.authButton} onPress={handleAuth}>
            <Text style={styles.authButtonText}>
              {user ? "Sign Out" : "Sign In"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <EditProfileModal
        isVisible={isEditModalVisible}
        onClose={() => setEditModalVisible(false)}
      />
    </SafeAreaView>
  );
}

const MenuItem = ({ icon, title, onPress, color }: any) => {
  const { theme } = useTheme();
  const styles = makeStyles(theme.colors);
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <Icon
        name={icon}
        size={24}
        color={color || theme.colors.primary}
        style={styles.menuIcon}
      />
      <Text style={styles.menuText}>{title}</Text>
      <Icon name="chevron-right" size={24} color="#888" />
    </TouchableOpacity>
  );
};

const makeStyles = (colors: Theme["colors"]) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContainer: {
      // paddingHorizontal: 20
    },
    profileBackground: {
      backgroundColor: colors.primary,
      padding: 20,
      borderBottomStartRadius: 16,
      borderBottomEndRadius: 16,
      elevation: 5,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      marginBottom: 10,
    },
    profileHeader: {
      flexDirection: "row",
      alignItems: "center",
      padding: 20,
      backgroundColor: colors.secondaryBackground,
      borderRadius: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    avatarContainer: {
      position: "relative",
      backgroundColor: colors.primary,
      borderRadius: 50,
      width: 70,
      height: 70,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 20,
    },
    avatar: {
      width: 60,
      height: 60,
      borderRadius: 30,
      justifyContent: "center",
      alignItems: "center",
    },
    editIcon: {
      position: "absolute",
      bottom: 0,
      right: 0,
      backgroundColor: colors.background,
      borderRadius: 12,
      padding: 4,
      borderWidth: 2,
      borderColor: colors.primary,
    },
    profileDetails: {
      flex: 1,
    },
    userName: {
      fontSize: 22,
      fontWeight: "600",
      color: colors.textPrimary,
      marginBottom: 4,
    },
    userDetail: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 2,
    },
    section: {
      marginBottom: 25,
      backgroundColor: colors.background,
      borderRadius: 12,
      padding: 15,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.textPrimary,
      marginBottom: 15,
    },
    authButton: {
      borderWidth: 1,
      borderColor: colors.pureBlack,
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: "center",
      marginTop: 15,
    },
    authButtonText: {
      color: colors.primary,
      fontSize: 16,
      fontWeight: "500",
    },
    menuItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 12,
      paddingHorizontal: 10,
    },
    menuIcon: {
      marginRight: 15,
      width: 24,
      alignItems: "center",
    },
    menuText: {
      flex: 1,
      fontSize: 16,
      color: colors.textPrimary,
      fontWeight: "500",
    },
  });
