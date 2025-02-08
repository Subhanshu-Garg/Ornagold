import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Theme } from '../constants/Theme';

type Metric = {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
};

const MetricCards = () => {
  const { theme } = useTheme();
  const styles = makeStyles(theme.colors);
  
  const metrics: Metric[] = [
    {
      title: '24K Gold Rate',
      value: '₹5,800/g',
      change: '↓ 1.2%',
      isPositive: false
    },
    {
      title: 'Making Charges',
      value: '12% Avg',
      change: '→ 0%',
      isPositive: true
    }
  ];

  return (
    <FlatList
      horizontal
      data={metrics}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.subtitle}>{item.title}</Text>
          <Text style={styles.value}>{item.value}</Text>
          <Text style={[
            styles.change,
            { color: item.isPositive ? theme.colors.success : theme.colors.error }
          ]}>
            {item.change}
          </Text>
        </View>
      )}
      contentContainerStyle={styles.container}
      showsHorizontalScrollIndicator={false}
    />
  );
};

const makeStyles = (colors: Theme['colors']) => StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    marginVertical: 10
  },
  card: {
    backgroundColor: colors.secondaryBackground,
    padding: 15,
    borderRadius: 10,
    marginRight: 15,
    width: 200
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: 'bold'
  },
  value: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 5
  },
  change: {
    fontSize: 14
  }
});

export default MetricCards; 