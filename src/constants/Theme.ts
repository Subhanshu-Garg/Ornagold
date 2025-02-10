import { Colors } from './Colors'

export type Theme = {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    secondaryBackground: string;
    textPrimary: string;
    textSecondary: string;
    success: string;
    error: string;
    primaryDark: string; // Darker gold shade
    pureBlack: string;
    pureWhite: string;
    darkGray: string;
  };
  mode: 'light' | 'dark';
};

// Use Pick to extract only the common color properties
type CommonColors = Pick<
  Theme['colors'],
  'primary' | 'secondary' | 'success' | 'error' | 'pureBlack' | 'pureWhite' | 'primaryDark'
>;

const commonColors: CommonColors = {
  primary: Colors.driftwood_1, // Primary brand color
  secondary: Colors.laser_2, // Secondary brand color
  success: Colors.successGreen,
  error: Colors.errorRed,
  pureBlack: Colors.pureBlack,
  darkGray: Colors.darkGray,
  pureWhite: Colors.pureWhite,
  primaryDark: '#c5a20a', // Darker gold shade
};

// Helper function to create themes with type safety
const createTheme = (mode: Theme['mode'], specificColors: Omit<Theme['colors'], keyof CommonColors>): Theme => ({
  mode,
  colors: {
    ...commonColors,
    ...specificColors,
  },
});

export const lightTheme = createTheme('light', {
  background: Colors.pureWhite, // Background color for light theme
  secondaryBackground: Colors.starkWhite_4,
  textPrimary: Colors.pureBlack, // Primary text color
  textSecondary: Colors.darkGray, // Secondary text color
}) satisfies Theme;

export const darkTheme = createTheme('dark', {
  background: Colors.pureBlack, // Background color for dark theme
  secondaryBackground: Colors.darkGray,
  textPrimary: Colors.pureWhite, // Primary text color
  textSecondary: Colors.starkWhite_4, // Secondary text color
}) satisfies Theme; 
