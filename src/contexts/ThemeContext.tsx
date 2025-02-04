import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SystemUI from 'expo-system-ui';
import { ColorSchemeName, useColorScheme } from 'react-native';
import { darkTheme, lightTheme, Theme } from '../constants/Theme';
import { AppState } from 'react-native';

type ThemeContextType = {
  theme: Theme;
  setTheme: (scheme: ColorSchemeName) => void;
};

const ThemeContext = createContext<ThemeContextType>({} as ThemeContextType);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const systemScheme = useColorScheme();
  const [theme, setTheme] = useState<Theme>(systemScheme === 'dark' ? darkTheme : lightTheme);

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(theme.colors.background);
  }, [theme]);

  useEffect(() => {
    const listener = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        setTheme(systemScheme === 'dark' ? darkTheme : lightTheme);
      }
    });

    return () => listener.remove();
  }, [systemScheme]);

  const handleSetTheme = (scheme: ColorSchemeName) => {
    setTheme(scheme === 'dark' ? darkTheme : lightTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme: handleSetTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext); 