import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { createShop, updateShop, getMyShops } from '../services/shops';
import { errorHandler } from '../utils/errorHandler';
import { useAuth } from '../contexts/AuthContext';
import { Shop } from '../types';
import { useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from 'react-native-elements';
import * as Location from 'expo-location';

type ShopProfileScreenProps = {
  route: RouteProp<RootStackParamList, 'ShopProfile'>;
};

type ProfileScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function ShopProfileScreen({ route }: ShopProfileScreenProps) {
  const { theme } = useTheme();
  const { user } = useAuth();
  const styles = makeStyles(theme.colors);
  const [shop, setShop] = useState<Partial<Shop>>({
    name: '',
    address: '',
    phone: '',
    locality: '',
    goldRate: '',
    makingCharges: '',
    latitude: 0,
    longitude: 0,
    logoImage: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [myShops, setMyShops] = useState<Shop[]>([]);
  const [mode, setMode] = useState<'new' | 'existing'>('new');
  const navigation = useNavigation<ProfileScreenNavigationProp>();

  useEffect(() => {
    const loadShops = async () => {
      try {
        const existingShops = await getMyShops();
        setMyShops(existingShops);
        
        if (route.params?.createNew) {
          setShop({ /* new shop defaults */ });
          setMode('new');
        } else if (existingShops.length > 0) {
          setShop(existingShops[0]);
          setMode('existing');
        }
      } catch (error) {
        errorHandler.handle(error);
      }
    };
    loadShops();
  }, [route.params]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!shop.name) newErrors.name = 'Shop name is required';
    if (!shop.phone) newErrors.phone = 'Phone number is required';
    if (!shop.goldRate) newErrors.goldRate = 'Gold rate is required';
    if (!shop.makingCharges) newErrors.makingCharges = 'Making charges are required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access location was denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setShop(prev => ({
        ...prev,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      }));
    } catch (error) {
      errorHandler.handle(error, 'location');
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      if (mode === 'existing' && shop.id) {
        await updateShop(shop.id, shop);
        Alert.alert('Success', 'Shop updated successfully');
      } else {
        const newShop = await createShop(shop);
        setShop(newShop);
        setMode('existing');
        Alert.alert('Success', 'Shop created successfully');
      }
      navigation.goBack();
    } catch (error) {
      errorHandler.handle(error, 'shop_profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {mode === 'new' ? 'Create New Shop' : 'Manage Shop'}
          </Text>
          
          <View style={styles.modeSelector}>
            <TouchableOpacity
              style={[styles.modeButton, mode === 'new' && styles.activeMode]}
              onPress={() => setMode('new')}
            >
              <Text style={[styles.modeText, mode === 'new' && styles.activeModeText]}>
                New Shop
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modeButton, mode === 'existing' && styles.activeMode]}
              onPress={() => setMode('existing')}
            >
              <Text style={[styles.modeText, mode === 'existing' && styles.activeModeText]}>
                Existing Shop
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {mode === 'existing' && myShops.length > 0 && (
          <View style={styles.shopSelector}>
            <Text style={styles.label}>Select Shop to Manage</Text>
            {myShops.map(s => (
              <TouchableOpacity
                key={s.id}
                style={[styles.shopItem, shop.id === s.id && styles.selectedShop]}
                onPress={() => setShop(s)}
              >
                <Text style={styles.shopName}>{s.name}</Text>
                <Icon name="chevron-right" size={20} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Shop Name *</Text>
            <TextInput
              style={[styles.input, errors.name && styles.errorInput]}
              value={shop.name}
              onChangeText={text => setShop({...shop, name: text})}
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number *</Text>
            <TextInput
              style={[styles.input, errors.phone && styles.errorInput]}
              value={shop.phone}
              onChangeText={text => setShop({...shop, phone: text})}
              keyboardType="phone-pad"
            />
            {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
          </View>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Pricing Details</Text>
          
          <View style={styles.priceRow}>
            <View style={styles.priceInput}>
              <Text style={styles.label}>Gold Rate (₹/gram) *</Text>
              <TextInput
                style={[styles.input, errors.goldRate && styles.errorInput]}
                value={shop.goldRate}
                onChangeText={text => setShop({...shop, goldRate: text})}
                keyboardType="numeric"
              />
              {errors.goldRate && <Text style={styles.errorText}>{errors.goldRate}</Text>}
            </View>

            <View style={styles.priceInput}>
              <Text style={styles.label}>Making Charges (%) *</Text>
              <TextInput
                style={[styles.input, errors.makingCharges && styles.errorInput]}
                value={shop.makingCharges}
                onChangeText={text => setShop({...shop, makingCharges: text})}
                keyboardType="numeric"
              />
              {errors.makingCharges && <Text style={styles.errorText}>{errors.makingCharges}</Text>}
            </View>
          </View>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Location Details</Text>
          
          <TouchableOpacity style={styles.locationButton} onPress={handleLocation}>
            <Icon name="location-on" size={20} color={theme.colors.primary} />
            <Text style={styles.locationButtonText}>
              {shop.latitude ? 'Location Set' : 'Set Current Location'}
            </Text>
          </TouchableOpacity>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Address</Text>
            <TextInput
              style={styles.input}
              value={shop.address}
              onChangeText={text => setShop({...shop, address: text})}
              multiline
              numberOfLines={3}
            />
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.submitButton, isSubmitting && styles.submitDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <Text style={styles.submitButtonText}>
            {isSubmitting ? 'Processing...' : mode === 'new' ? 'Create Shop' : 'Update Shop'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
  );
}

const makeStyles = (colors: any) => StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: colors.background,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 15,
  },
  modeSelector: {
    flexDirection: 'row',
    borderRadius: 8,
    backgroundColor: colors.secondaryBackground,
    overflow: 'hidden',
  },
  modeButton: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
  },
  activeMode: {
    backgroundColor: colors.primary,
  },
  modeText: {
    color: colors.textSecondary,
    fontWeight: '500',
  },
  activeModeText: {
    color: colors.background,
  },
  formSection: {
    marginBottom: 30,
    backgroundColor: colors.secondaryBackground,
    borderRadius: 12,
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    color: colors.textSecondary,
    marginBottom: 8,
    fontSize: 14,
  },
  input: {
    backgroundColor: colors.background,
    color: colors.textPrimary,
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  errorInput: {
    borderColor: colors.error,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 5,
  },
  priceRow: {
    flexDirection: 'row',
    gap: 15,
  },
  priceInput: {
    flex: 1,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 15,
    backgroundColor: colors.background,
    borderRadius: 8,
    marginBottom: 20,
  },
  locationButtonText: {
    color: colors.textPrimary,
    fontWeight: '500',
  },
  shopSelector: {
    marginBottom: 20,
  },
  shopItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: colors.background,
    borderRadius: 8,
    marginBottom: 10,
  },
  selectedShop: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  shopName: {
    color: colors.textPrimary,
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: colors.primary,
    padding: 18,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 20,
  },
  submitDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 