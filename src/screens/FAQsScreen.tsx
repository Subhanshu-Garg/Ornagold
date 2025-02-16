import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Theme } from '../constants/Theme';
import useStatusBarColor from '../hooks/useStatusBarColor';

export default function FAQsScreen() {
  const { theme } = useTheme();
  const styles = makeStyles(theme.colors);

  useStatusBarColor(theme.colors.secondaryBackground)

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Frequently Asked Questions</Text>
      
      <View style={styles.faqItem}>
        <Text style={styles.question}>How do I find the best gold rates?</Text>
        <Text style={styles.answer}>Our app aggregates real-time rates from verified shops in your area...</Text>
      </View>

      {/* Add more FAQs */}
    </ScrollView>
  );
}

const makeStyles = (colors: Theme['colors']) => StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 20,
  },
  faqItem: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: colors.secondaryBackground,
    borderRadius: 8,
  },
  question: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  answer: {
    fontSize: 14,
    color: colors.textSecondary,
  }
}); 