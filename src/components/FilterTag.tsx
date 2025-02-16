import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Icon } from "@rneui/themed";
import { Theme } from "../constants/Theme";
import { useTheme } from "../contexts/ThemeContext";

interface FilterTagProps {
  label: string;
  onPress: () => void;
  isActive: boolean;
}

export default function FilterTag({
  label,
  onPress,
  isActive,
}: FilterTagProps) {
  const { theme } = useTheme();
  const styles = makeStyles(theme.colors);
  return (
    <TouchableOpacity
      style={[styles.container, isActive && styles.active]}
      onPress={onPress}
    >
      <Text style={[styles.text, isActive && styles.activeText]}>{label}</Text>
      <Icon
        name="keyboard-arrow-down"
        type="material"
        size={18}
        color={theme.colors.textPrimary}
      />
    </TouchableOpacity>
  );
}

const makeStyles = (colors: Theme["colors"]) =>
  StyleSheet.create({
    container: {
      height: 35,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 15,
      marginRight: 10,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: "#ccc",
      flexDirection: "row",
    },
    active: {
      backgroundColor: colors.secondaryBackground,
      borderColor: colors.darkGray,
    },
    text: {
      color: colors.textPrimary,
    },
    activeText: {
      color: colors.textPrimary,
    },
  });
