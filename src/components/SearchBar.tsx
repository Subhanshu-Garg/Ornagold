import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { Theme } from '../constants/Theme';
import { useTheme } from '../contexts/ThemeContext';
import { Icon } from '@rneui/themed';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
}

export default function SearchBar({ value, onChangeText }: SearchBarProps) {
  const { theme } = useTheme()
  const styles = makeStyles(theme.colors)
  
  return (
    <View style={styles.container}>
      <Icon
        name="search"
        type="material"
        color={theme.colors.textSecondary}
        style={styles.searchIcon}
      />
      <TextInput
        style={styles.input}
        placeholder="Search for gold shops nearby..."
        placeholderTextColor={theme.colors.textSecondary}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}

const makeStyles = (colours: Theme['colors']) => StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 10,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderColor: colours.primary,
    borderWidth: 2

  },
  input: {
    flex: 1,
    height: 52,
    color: colours.textPrimary,
    fontSize: 16,
    marginLeft: 12,
    paddingRight: 15,
  },
  searchIcon: {
    marginRight: 0,
  },
});