import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Icon } from 'react-native-elements';
import { Share } from 'react-native';
import * as Linking from 'expo-linking';

export default function ProfileScreen({ navigation }: any) {
  const { user, signOut } = useAuth();
  const { theme } = useTheme();
  const styles = makeStyles(theme.colors);
  const isShopOwner = user?.role === 'shop_owner';

  const handleAuth = async () => {
    if (user) {
      await signOut();
    } else {
      navigation.navigate('Auth');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Icon 
              name="person" 
              size={40} 
              color={theme.colors.background} 
              containerStyle={styles.avatar}
            />
          </View>
          <View style={styles.profileDetails}>
            <Text style={styles.userName}>{user?.user_metadata?.displayName || 'Guest User'}</Text>
            {user?.email && <Text style={styles.userDetail}>{user.email}</Text>}
            {user?.phone && <Text style={styles.userDetail}>{user.phone}</Text>}
          </View>
        </View>

        {/* Shop Owner Section */}
        {isShopOwner && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Business Tools</Text>
            <MenuItem
              icon="store"
              title="My Shop Profile"
              color={theme.colors.primary}
              onPress={() => navigation.navigate('ShopProfile')}
            />
            <MenuItem
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
            />
          </View>
        )}

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
                title: 'Share Ornagold App'
              })
            }}
          />
          <MenuItem
            icon="support-agent"
            title="Talk to Our Expert"
            color="#2196F3"
            onPress={() => Linking.openURL('tel:+917011564838')}
          />
          <MenuItem
            icon="help-center"
            title="FAQs & Support"
            color="#9C27B0"
            onPress={() => navigation.navigate('FAQs')}
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
            onPress={() => navigation.navigate('PrivacyPolicy')}
          />
          <TouchableOpacity style={styles.authButton} onPress={handleAuth}>
            <Text style={styles.authButtonText}>
              {user ? 'Sign Out' : 'Sign In'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const MenuItem = ({ icon, title, onPress, color }: any) => {
  const { theme } = useTheme();
  const styles = makeStyles(theme.colors);
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <Icon name={icon} size={24} color={color || theme.colors.primary} style={styles.menuIcon} />
      <Text style={styles.menuText}>{title}</Text>
      <Icon name="chevron-right" size={24} color="#888" />
    </TouchableOpacity>
  );
};

const makeStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  profileHeader: {
    paddingTop: 50,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 25,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  avatarContainer: {
    backgroundColor: colors.primary,
    borderRadius: 50,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
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
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 15,
  },
  authButton: {
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
  },
  authButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '500',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  menuIcon: {
    marginRight: 15,
    width: 24,
    alignItems: 'center',
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: '500',
  },
});
