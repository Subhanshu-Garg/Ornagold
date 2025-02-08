import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Theme } from '../constants/Theme';
import { Icon } from 'react-native-elements';

export default function ProfileScreen({ navigation }: any) {
  const { user, signOut } = useAuth();
  const { theme } = useTheme();
  const styles = makeStyles(theme.colors);

  const handleAuth = async () => {
    if (user) {
      await signOut();
    } else {
      navigation.navigate('Auth');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon name="person" size={60} color={theme.colors.primary} />
        <Text style={styles.userEmail}>
          {user?.email || 'Guest User'}
        </Text>
        <TouchableOpacity 
          style={styles.authButton} 
          onPress={handleAuth}
        >
          <Text style={styles.authButtonText}>
            {user ? 'Sign Out' : 'Sign In'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Settings</Text>
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigation.navigate('AccountSettings')}
        >
          <Icon name="settings" style={styles.menuIcon} />
          <Text style={styles.menuText}>Update Profile</Text>
          <Icon name="chevron-right" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigation.navigate('NotificationSettings')}
        >
          <Icon name="notifications" style={styles.menuIcon} />
          <Text style={styles.menuText}>Alert Preferences</Text>
          <Icon name="chevron-right" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Price Alerts</Text>
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigation.navigate('PriceAlerts')}
        >
          <Icon name="history" style={styles.menuIcon} />
          <Text style={styles.menuText}>Alert History</Text>
          <Icon name="chevron-right" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const makeStyles = (colors: Theme['colors']) => StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.background,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 30,
    borderBottomWidth: 1,
    borderBottomColor: colors.primary,
    marginBottom: 20,
  },
  userEmail: {
    fontSize: 16,
    color: colors.textPrimary,
    marginVertical: 10,
  },
  authButton: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
  },
  authButtonText: {
    color: colors.background,
    fontSize: 16,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 15,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.primary,
  },
  menuIcon: {
    marginRight: 15,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: colors.textPrimary,
  },
}); 