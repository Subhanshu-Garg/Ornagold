import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import Modal from 'react-native-modal';
import { validatePhoneNumber } from '../helpers';

type EditProfileModalProps = {
  isVisible: boolean;
  onClose: () => void;
};

export default function EditProfileModal({ isVisible, onClose }: EditProfileModalProps) {
  const { theme } = useTheme();
  const { user, updateProfile, sendOTP, verifyOTP } = useAuth();
  const styles = makeStyles(theme.colors);

  const userPhone = user?.phone || ''
  const currentPhone = userPhone.length > 10 ?  userPhone?.slice(userPhone.length - 10) : userPhone
  const currentName = user?.user_metadata?.displayName
  
  const [name, setName] = useState(currentName);
  const [phone, setPhone] = useState(currentPhone);
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSendOTP = async () => {
    try {
      if(!phone || !validatePhoneNumber(phone)) {
        throw Error('No phone provided.')
      }
      await sendOTP(phone);
      setIsOtpSent(true);
      Alert.alert('OTP Sent', 'Please check your phone for the verification code');
    } catch (error) {
      Alert.alert('Error', 'Failed to send OTP');
    }
  };

  const handleUpdateProfile = async () => {
    // If only name is being changed, no OTP required
    if (phone === currentPhone) {
      setIsUpdating(true);
      try {
        await updateProfile({ name });
        onClose();
        Alert.alert('Success', 'Profile updated successfully');
      } catch (error) {
        Alert.alert('Error', 'Failed to update profile');
      } finally {
        setIsUpdating(false);
      }
      return;
    }

    // If phone number is being changed, require OTP verification
    if (!isOtpSent) {
      Alert.alert('Error', 'Please verify your phone number first');
      return;
    }

    setIsUpdating(true);
    try {
      if(!phone) {
        throw Error('No phone provided')
      }
      // Verify OTP first
      await verifyOTP(phone, otp);
      
      // Update profile
      await updateProfile({ name, phone });
      onClose();
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setPhone(user?.phone || '')
      setName(user?.user_metadata?.displayName)
      setIsOtpSent(false)
      setIsUpdating(false);
    }
  };

  return (
    <Modal isVisible={isVisible} onBackdropPress={onClose}>
      <View style={styles.container}>
        <Text style={styles.title}>Edit Profile</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          editable={!isOtpSent}
        />
        
        {isOtpSent && (
          <TextInput
            style={styles.input}
            placeholder="Enter OTP"
            value={otp}
            onChangeText={setOtp}
            keyboardType="number-pad"
          />
        )}
        
        <View style={styles.buttonContainer}>
          {!isOtpSent && phone != currentPhone ? (
            <TouchableOpacity style={styles.button} onPress={handleSendOTP}>
              <Text style={styles.buttonText}>Send OTP</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={styles.button} 
              onPress={handleUpdateProfile}
              disabled={isUpdating}
            >
              <Text style={styles.buttonText}>
                {isUpdating ? 'Updating...' : 'Update Profile'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
}

const makeStyles = (colors: any) => StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    padding: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: colors.textPrimary,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    color: colors.textPrimary,
  },
  buttonContainer: {
    marginTop: 10,
  },
  button: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.background,
    fontWeight: 'bold',
  },
}); 