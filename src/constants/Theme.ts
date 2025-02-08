import { ColorSchemeName } from 'react-native';
import { Colors } from './Colors'

export type Theme = {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    secondaryBackground: string;
    textPrimary: string;
    textSecondary: string;
    success: string
  };
  mode: 'light' | 'dark';
};

export const lightTheme: Theme = {
  mode: 'light',
  colors: {
    primary: Colors.driftwood_1, // Primary brand color
    secondary: Colors.laser_2, // Secondary brand color

    background: Colors.pureWhite, // Background color for light theme
    secondaryBackground: Colors.starkWhite_4,

    textPrimary: Colors.pureBlack, // Primary text color
    textSecondary: Colors.darkGray, // Secondary text color
    success: Colors.successGreen
  },
};

export const darkTheme: Theme = {
  mode: 'dark',
  colors: {
    primary: Colors.driftwood_1, // Primary brand color
    secondary: Colors.laser_2, // Secondary brand color
    
    background: Colors.pureBlack, // Background color for dark theme
    secondaryBackground: Colors.darkGray,


    textPrimary: Colors.pureWhite, // Primary text color
    textSecondary: Colors.starkWhite_4, // Secondary text color
    success: Colors.successGreen
  },
}; 