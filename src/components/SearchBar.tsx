import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { Theme } from '../constants/Theme';
import { useTheme } from '../contexts/ThemeContext';
import { Icon } from '@rneui/themed';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => Promise<any>
}

export default function SearchBar({ value, onChangeText, onSubmit }: SearchBarProps) {
  const { theme } = useTheme()
  const styles = makeStyles(theme.colors)
  
  return (
    <View style={styles.container}>
      <Icon
        name="search"
        type="material"
        color={theme.colors.darkGray}
        style={styles.searchIcon}
      />
      <TextInput
        style={styles.input}
        placeholder="Search for gold shops nearby..."
        placeholderTextColor={theme.colors.darkGray}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
        submitBehavior='blurAndSubmit'
        returnKeyType='search'
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
    borderColor: colours.darkGray,
    borderWidth: 1
  },
  input: {
    flex: 1,
    height: 52,
    color: colours.darkGray,
    fontSize: 16,
    marginLeft: 12,
    paddingRight: 15,
  },
  searchIcon: {
    marginRight: 0,
  },
});