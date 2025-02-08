import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Theme } from '../constants/Theme';

interface ProgressCircleProps {
  progress: number;
  showsText?: boolean;
  size?: number;
  strokeWidth?: number;
}

export const ProgressCircle = ({
  progress,
  showsText = false,
  size = 40,
  strokeWidth = 3
}: ProgressCircleProps) => {
  const { theme } = useTheme();
  const styles = makeStyles(theme.colors, size, strokeWidth);
  
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - Math.min(progress, 1));

  return (
    <View style={styles.container}>
      <View style={styles.background} />
      <View 
        style={[
          styles.progress, 
          { 
            borderColor: theme.colors.primary,
            transform: [{ rotate: '-90deg' }],
            width: size,
            height: size,
            borderRadius: radius,
            borderWidth: strokeWidth,
          }
        ]}
      />
      {showsText && (
        <Text style={styles.text}>
          {Math.round(progress * 100)}%
        </Text>
      )}
    </View>
  );
};

const makeStyles = (
  colors: Theme['colors'], 
  size: number, 
  strokeWidth: number
) => StyleSheet.create({
  container: {
    width: size,
    height: size,
    alignItems: 'center',
    justifyContent: 'center',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: (size - strokeWidth) / 2,
    borderWidth: strokeWidth,
    borderColor: colors.secondaryBackground,
  },
  progress: {
    position: 'absolute',
  },
  text: {
    color: colors.textPrimary,
    fontSize: size * 0.3,
    fontWeight: 'bold',
  },
});