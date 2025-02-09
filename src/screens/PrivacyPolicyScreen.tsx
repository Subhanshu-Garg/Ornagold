import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Theme } from '../constants/Theme';

export default function PrivacyPolicyScreen() {
  const { theme } = useTheme();
  const styles = makeStyles(theme.colors);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* <Text style={styles.title}>Privacy Policy</Text> */}
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Introduction</Text>
        <Text style={styles.content}>
          We are committed to protecting your personal information and your right to privacy...
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data Collection</Text>
        <Text style={styles.content}>
          We collect information you provide directly when you use our services, including...
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data Usage</Text>
        <Text style={styles.content}>
          We use the information we collect to provide and improve our services...
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data Protection</Text>
        <Text style={styles.content}>
          We implement security measures to protect your information...
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Rights</Text>
        <Text style={styles.content}>
          You have the right to access, correct, or delete your personal data...
        </Text>
      </View>

      <View style={styles.contactSection}>
        <Text style={styles.contactText}>
          For any privacy-related questions, contact us at:
          {'\n\n'}privacy@ornagold.com
        </Text>
      </View>
    </ScrollView>
  );
}

const makeStyles = (colors: Theme['colors']) => StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: colors.background,
    paddingBottom: 100
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 25,
  },
  section: {
    marginBottom: 25,
    padding: 15,
    backgroundColor: colors.secondaryBackground,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  content: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
  },
  contactSection: {
    marginTop: 20,
    padding: 15,
    backgroundColor: colors.secondaryBackground,
    borderRadius: 8,
  },
  contactText: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
    textAlign: 'center',
  }
}); 