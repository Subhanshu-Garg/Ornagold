import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
  Image,
} from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { createShop, uploadFile } from "../services/shops";
import { errorHandler } from "../utils/errorHandler";
import { useAuth } from "../contexts/AuthContext";
import { Shop } from "../types";
import { useNavigation } from "@react-navigation/native";
import { Icon } from "react-native-elements";
import * as Location from "expo-location";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

export default function CreateShopScreen() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const styles = makeStyles(theme.colors);
  const navigation = useNavigation();
  const [shop, setShop] = useState<Partial<Shop>>({
    name: "",
    address: "",
    phone: "",
    locality: "",
    goldRate: "",
    makingCharges: "",
    latitude: 0,
    longitude: 0,
    logoImage: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasLocation, setHasLocation] = useState(false);
  const [uploading, setUploading] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!shop.name) newErrors.name = "Shop name is required";
    if (!shop.phone) newErrors.phone = "Phone number is required";
    if (!shop.goldRate) newErrors.goldRate = "Gold rate is required";
    if (!shop.makingCharges)
      newErrors.makingCharges = "Making charges are required";
    if (!shop.locality) newErrors.locality = "Locality is required";
    if (!shop.latitude || !shop.longitude) {
      newErrors.location = "Location is required";
    }
    if (!shop.address) newErrors.address = "Full address is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission to access location was denied");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const [reverseGeocode] = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      const city = reverseGeocode.city || reverseGeocode.region || "";
      const currentLocality = shop.locality || "";
      const newLocality = currentLocality.includes(city)
        ? currentLocality
        : `${currentLocality}${currentLocality ? ", " : ""}${city}`;

      setShop((prev) => ({
        ...prev,
        locality: newLocality,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      }));
      setHasLocation(true);
      setErrors(prev => ({ ...prev, location: '' }));
    } catch (error) {
      errorHandler.handle(error, "location");
    }
  };

  const handleImageUpload = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access photos is required');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled) {
        const file = result.assets[0];
        
        // Check file type
        const allowedFormats = ['jpg', 'jpeg', 'png', 'webp'];
        const fileExtension = file.uri.split('.').pop()?.toLowerCase();
        if (!fileExtension || !allowedFormats.includes(fileExtension)) {
          Alert.alert(
            'Invalid File Format',
            'Please upload an image in JPG, PNG, or WEBP format.'
          );
          return;
        }

        // Check file size
        const fileInfo = await FileSystem.getInfoAsync(file.uri);
        if (fileInfo.exists && fileInfo.size !== undefined && fileInfo.size > 200 * 1024) {
          Alert.alert(
            'File Too Large',
            'Maximum allowed size is 200KB. Please choose a smaller image.'
          );
          return;
        }

        // Store local URI temporarily
        setShop(prev => ({ 
          ...prev, 
          logoImage: file.uri 
        }));
      }
    } catch (error) {
      errorHandler.handle(error, 'image_selection');
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      let logoUrl = shop.logoImage;
      
      // Only upload if it's a local file
      if (shop.logoImage?.startsWith('file://')) {
        const uploadResponse = await uploadFile(shop.logoImage);
        logoUrl = uploadResponse.url;
      }

      const newShop = await createShop({ 
        ...shop,
        logoImage: logoUrl
      });
      
      Alert.alert("Success", "Shop created successfully");
      navigation.goBack();
    } catch (error) {
      errorHandler.handle(error, "shop_creation");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps='handled'>
      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>Basic Information</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Shop Name *</Text>
          <TextInput
            style={[styles.input, errors.name && styles.errorInput]}
            value={shop.name}
            onChangeText={(text) => setShop({ ...shop, name: text })}
            placeholder="e.g. Golden Jewelers"
          />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone Number *</Text>
          <TextInput
            style={[styles.input, errors.phone && styles.errorInput]}
            value={shop.phone}
            onChangeText={(text) => setShop({ ...shop, phone: text })}
            keyboardType="phone-pad"
            placeholder="e.g. 9876543210"
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
              onChangeText={(text) => setShop({ ...shop, goldRate: text })}
              placeholder="e.g. 5500"
              keyboardType="numeric"
            />
            {errors.goldRate && (
              <Text style={styles.errorText}>{errors.goldRate}</Text>
            )}
          </View>

          <View style={styles.priceInput}>
            <Text style={styles.label}>Making Charges (%) *</Text>
            <TextInput
              style={[styles.input, errors.makingCharges && styles.errorInput]}
              value={shop.makingCharges}
              placeholder="e.g. 12.5"
              onChangeText={(text) => setShop({ ...shop, makingCharges: text })}
              keyboardType="numeric"
            />
            {errors.makingCharges && (
              <Text style={styles.errorText}>{errors.makingCharges}</Text>
            )}
          </View>
        </View>
      </View>

      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>Location Details</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Locality *</Text>
          <TextInput
            style={[styles.input, errors.locality && styles.errorInput]}
            value={shop.locality}
            onChangeText={(text) => setShop({ ...shop, locality: text })}
            placeholder="e.g. MG Road, Bangalore"
          />
          {errors.locality && (
            <Text style={styles.errorText}>{errors.locality}</Text>
          )}
        </View>

        <TouchableOpacity
          style={[styles.locationButton, errors.location && styles.errorInput]}
          onPress={handleLocation}
        >
          <Icon
            name="location-on"
            size={20}
            color={hasLocation ? theme.colors.success : theme.colors.primary}
          />
          <Text style={styles.locationButtonText}>
            {hasLocation ? "Location Set (Tap to Update)" : "Set Current Location"}
          </Text>
        </TouchableOpacity>
        {errors.location && (
             <Text style={styles.errorText}>{errors.location}</Text>
        )}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Full Address *</Text>
          <TextInput
            style={[styles.input, errors.address && styles.errorInput]}
            value={shop.address}
            onChangeText={(text) => setShop({ ...shop, address: text })}
            placeholder="e.g. 123 Jewel Street, Near City Mall"
            multiline
            numberOfLines={3}
          />
          {errors.address && <Text style={styles.errorText}>{errors.address}</Text>}
        </View>
      </View>

      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>Shop Logo</Text>
        
        <TouchableOpacity 
          style={styles.uploadButton}
          onPress={handleImageUpload}
          disabled={uploading}
        >
          {shop.logoImage ? (
            <Image 
              source={{ uri: shop.logoImage }} 
              style={styles.logoPreview} 
            />
          ) : (
            <View style={styles.uploadContent}>
              <Icon 
                name="camera-alt" 
                size={32} 
                color={theme.colors.textSecondary} 
              />
              <View style={styles.uploadTextContainer}>
                <Text style={styles.uploadText}>Tap to upload logo</Text>
                <Text style={styles.uploadText}>(JPEG, PNG, WEBP, max 200KB)</Text>
              </View>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.submitButton, isSubmitting && styles.submitDisabled]}
        onPress={handleSubmit}
        disabled={isSubmitting}
      >
        <Text style={styles.submitButtonText}>
          {isSubmitting ? "Creating..." : "Create Shop"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// Reuse the makeStyles from ShopProfileScreen
const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      padding: 20,
      backgroundColor: colors.background,
    },
    header: {
      marginBottom: 30,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      color: colors.textPrimary,
      marginBottom: 15,
    },
    modeSelector: {
      flexDirection: "row",
      borderRadius: 8,
      backgroundColor: colors.secondaryBackground,
      overflow: "hidden",
    },
    modeButton: {
      flex: 1,
      padding: 15,
      alignItems: "center",
    },
    activeMode: {
      backgroundColor: colors.primary,
    },
    modeText: {
      color: colors.textSecondary,
      fontWeight: "500",
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
      fontWeight: "600",
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
      flexDirection: "row",
      gap: 15,
    },
    priceInput: {
      flex: 1,
    },
    locationButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      padding: 15,
      backgroundColor: colors.background,
      borderRadius: 8,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: colors.border,
    },
    locationButtonText: {
      color: colors.textPrimary,
      fontWeight: "500",
    },
    shopSelector: {
      marginBottom: 20,
    },
    shopItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
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
      alignItems: "center",
      marginVertical: 20,
    },
    submitDisabled: {
      opacity: 0.7,
    },
    submitButtonText: {
      color: colors.background,
      fontSize: 16,
      fontWeight: "bold",
    },
    success: {
      color: colors.success,
    },
    uploadButton: {
      width: '100%',
      aspectRatio: 1,
      backgroundColor: colors.background,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: colors.border,
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
    },
    logoPreview: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    uploadContent: {
      alignItems: 'center',
      gap: 10,
      padding: 20,
    },
    uploadTextContainer: {
      alignItems: 'center',
      gap: 4,
    },
    uploadText: {
      color: colors.textSecondary,
      fontSize: 14,
      textAlign: 'center',
    },
  });
