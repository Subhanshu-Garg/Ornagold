import { useCallback, useEffect } from 'react';
import { StatusBar, Platform } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../contexts/ThemeContext';

export default function useStatusBarColor(headerColor?: string) {
  const { theme } = useTheme();

  const updateStatusBar = useCallback(() => {
    const color = headerColor || theme.colors.background;
    const isDark = theme.mode === 'dark';
    
    // Batch status bar updates
    StatusBar.setBarStyle(
      isDark ? 'light-content' : 'dark-content',
      true // Enable animation
    );
    
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(color, true); // Enable animation
    }
  }, [theme, headerColor]);

  useFocusEffect(
    useCallback(() => {
      const id = setTimeout(updateStatusBar, 20); // Small delay to batch with navigation animation
      return () => clearTimeout(id);
    }, [updateStatusBar])
  );

  useEffect(() => {
    updateStatusBar();
  }, [updateStatusBar]);
} 