import React from 'react';
import { TextInput, StyleSheet } from 'react-native';
import { Theme } from '../../constants/Theme';

interface PhoneInputProps {
  value: string;
  onChangeText: (text: string) => void;
  colors: Theme['colors'];
}

export const PhoneInput = ({ value, onChangeText, colors }: PhoneInputProps) => (
  <TextInput
    style={[styles.input, { color: colors.textPrimary }]}
    placeholder="Mobile Number"
    value={value}
    onChangeText={onChangeText}
    keyboardType="phone-pad"
  />
);

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
}); 