import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { Theme } from '../constants/Theme';
import { useTheme } from '../contexts/ThemeContext';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
}

export default function SearchBar({ value, onChangeText }: SearchBarProps) {
  const { theme } = useTheme()
  const styles = makeStyles(theme.colors)
  
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search shops by name or locality..."
        placeholderTextColor={theme.colors.textPrimary}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}

const makeStyles = (colours: Theme['colors']) => StyleSheet.create({
  container: {
    color: colours.secondary,
    padding: 10,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: colours.primary,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: colours.background,
    color: colours.textPrimary
  },
});