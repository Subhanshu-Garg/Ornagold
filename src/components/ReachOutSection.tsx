import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Theme } from '../constants/Theme';
// import { Icon } from '@expo/vector-icons';
import { Icon } from 'react-native-elements';

const ReachOutSection = () => {
  const { theme } = useTheme();
  const styles = makeStyles(theme.colors);

  const handleContactPress = () => {
    // Implement contact logic
    console.log('Contact support pressed');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Need Help?</Text>
      <TouchableOpacity 
        style={styles.contactButton}
        onPress={handleContactPress}
        activeOpacity={0.8}
      >
        <Icon 
          name="headset-mic" 
          size={24} 
          color={theme.colors.background} 
          style={styles.icon}
        />
        <Text style={styles.buttonText}>24/7 Customer Support</Text>
      </TouchableOpacity>
    </View>
  );
};

const makeStyles = (colors: Theme['colors']) => StyleSheet.create({
  container: {
    padding: 20,
    marginHorizontal: 15,
    borderRadius: 12,
    backgroundColor: colors.secondaryBackground,
    marginVertical: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 15,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  icon: {
    marginRight: 10,
  },
  buttonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '500',
  },
});

export default ReachOutSection; 