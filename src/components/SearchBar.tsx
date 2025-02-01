import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
}

export default function SearchBar({ value, onChangeText }: SearchBarProps) {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search shops by name or locality..."
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: 'white',
  },
});