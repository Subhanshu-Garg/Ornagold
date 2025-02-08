import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Theme } from '../constants/Theme';

type Props = {
  title: string;
  onViewAll?: () => void;
};

const SectionHeader = ({ title, onViewAll }: Props) => {
  const { theme } = useTheme();
  const styles = makeStyles(theme.colors);

  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {onViewAll && (
        <TouchableOpacity onPress={onViewAll}>
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const makeStyles = (colors: Theme['colors']) => StyleSheet.create({
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  viewAll: {
    color: colors.primary,
    fontSize: 14,
  },
});

export default SectionHeader; 