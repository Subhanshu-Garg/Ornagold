import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Theme } from '../constants/Theme';

const LoadingSpinner = () => {
  const { theme } = useTheme();
  const styles = makeStyles(theme.colors)
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
    </View>
  );
};

const makeStyles = (colours: Theme['colors']) => StyleSheet.create({
  container: {
    backgroundColor: colours.secondaryBackground,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoadingSpinner; 