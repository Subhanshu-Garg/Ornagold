import React from 'react';
import { TextInput, StyleSheet } from 'react-native';
import { Theme } from '../../constants/Theme';

interface OtpInputProps {
  value: string;
  onChangeText: (text: string) => void;
  colors: Theme['colors'];
}

export const OtpInput = ({ value, onChangeText, colors }: OtpInputProps) => (
  <TextInput
    style={[styles.input, { color: colors.textPrimary }]}
    placeholder="Enter OTP"
    value={value}
    onChangeText={onChangeText}
    keyboardType="number-pad"
    maxLength={6}
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