import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Theme } from '../../constants/Theme';

interface AuthButtonProps {
  title: string;
  onPress: () => void;
  colors: Theme['colors'];
}

export const AuthButton = ({ title, onPress, colors }: AuthButtonProps) => (
  <TouchableOpacity
    style={[styles.button, { backgroundColor: colors.primary }]}
    onPress={onPress}
  >
    <Text style={[styles.buttonText, { color: colors.secondaryBackground }]}>
      {title}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    fontWeight: "bold",
  },
}); 