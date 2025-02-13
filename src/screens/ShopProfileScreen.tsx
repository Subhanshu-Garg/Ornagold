import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
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
    goldRate: '0',
    makingCharges: '0',
    latitude: 0,
    longitude: 0,
    logoImage: ''
  });
  const [isExisting, setIsExisting] = useState(false);
  const [myShops, setMyShops] = useState<Shop[]>([]);
  const navigation = useNavigation<ProfileScreenNavigationProp>();

  useEffect(() => {
    const loadShops = async () => {
      try {
        const existingShops = await getMyShops();
        setMyShops(existingShops);
        
        if (route.params?.createNew) {
          setShop({ /* new shop defaults */ });
          setIsExisting(false);
        } else if (existingShops.length > 0) {
          setShop(existingShops[0]);
          setIsExisting(true);
        }
      } catch (error) {
        errorHandler.handle(error);
      }
    };
    loadShops();
  }, [route.params]);

  const handleSubmit = async () => {
    try {
      if (isExisting && shop.id) {
        await updateShop(shop.id, shop);
      } else {
        const newShop = await createShop(shop);
        setShop(newShop);
        setIsExisting(true);
      }
      // Show success message
    } catch (error) {
      errorHandler.handle(error, 'shop_profile');
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>{isExisting ? 'Manage Shop' : 'Create Shop'}</Text>
        
        <Text style={styles.label}>Shop Name</Text>
        <TextInput
          style={styles.input}
          value={shop.name}
          onChangeText={text => setShop({...shop, name: text})}
        />

        <Text style={styles.label}>Address</Text>
        <TextInput
          style={styles.input}
          value={shop.address}
          onChangeText={text => setShop({...shop, address: text})}
        />

        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          value={shop.phone}
          onChangeText={text => setShop({...shop, phone: text})}
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Today's Gold Rate (per gram)</Text>
        <TextInput
          style={styles.input}
          value={shop.goldRate}
          onChangeText={text => setShop({...shop, goldRate: text})}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Making Charges (%)</Text>
        <TextInput
          style={styles.input}
          value={String(shop.makingCharges)}
          onChangeText={text => setShop({...shop, makingCharges: text})}
          keyboardType="numeric"
        />

        <Picker
          selectedValue={shop.id}
          onValueChange={(id) => setShop(myShops.find(s => s.id === id)!)}
          style={styles.picker}
        >
          {myShops.map(shop => (
            <Picker.Item label={shop.name} value={shop.id} key={shop.id} />
          ))}
          <Picker.Item label="Create New Shop" value="" />
        </Picker>

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>{isExisting ? 'Update Shop' : 'Create Shop'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const makeStyles = (colors: any) => StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 20,
  },
  label: {
    color: colors.textPrimary,
    marginBottom: 8,
    fontSize: 16,
  },
  input: {
    backgroundColor: colors.secondaryBackground,
    color: colors.textPrimary,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
  picker: {
    backgroundColor: colors.secondaryBackground,
    color: colors.textPrimary,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
  },
}); 