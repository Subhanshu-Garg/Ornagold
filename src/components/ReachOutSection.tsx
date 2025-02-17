import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Theme } from '../constants/Theme';
// import { Icon } from '@expo/vector-icons';
import { Icon } from 'react-native-elements';
import { handleContactPress } from '../helpers';

export interface ReachOutSectionProps {}

const ReachOutSection = () => {
  const { theme } = useTheme();
  const styles = makeStyles(theme.colors);

  return (
    <TouchableOpacity style={styles.container} onPress={() => handleContactPress()} activeOpacity={0.8}>
      <Image
        source={require('../../assets/images/contact-support.png')}
        style={styles.backgroundImage}
        resizeMode="contain"
      />
      <Text style={styles.title}>
        Need Help With{'\n'}
        <Text style={{ fontWeight: '800' }}>Finding Gold Deals?</Text>
      </Text>
      <View style={styles.contactButton}> 
        <View>
          <Text style={styles.buttonText}>24/7</Text>
          <Text style={styles.buttonText}>Customer</Text>
          <Text style={styles.buttonText}>Support</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const makeStyles = (colors: Theme['colors']) => StyleSheet.create({
  container: {
    height: 180,
    margin: 15,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.primary,
  },
  backgroundImage: {
    position: 'absolute',
    right: -40,
    bottom: 0,
    width: 300,
    height: 150,
    resizeMode: 'contain',
  },
  contentContainer: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 2,
    width: '60%',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.background,
    marginBottom: 25,
    padding: 20,
    lineHeight: 24,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: 8,
    width: '30%',
    position: 'absolute',
    bottom: 20,
    left: 20,
    justifyContent: 'flex-start',
  },
  icon: {
    marginRight: 8,
  },
  buttonText: {
    color: colors.background,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 18,
  },
});

export default ReachOutSection; 