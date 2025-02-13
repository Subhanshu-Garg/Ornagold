import * as Linking from 'expo-linking';

export const handleContactPress = async (phoneNum: string | void) => {
    try {
      const rawNumber = phoneNum || '+917011564838'; // Default without country code
      const sanitized = sanitizePhoneNum(rawNumber);
      const phoneNumber = `tel:${sanitized}`;
      const supported = await Linking.canOpenURL(phoneNumber)
      
      if (supported) {
        await Linking.openURL(phoneNumber);
      } else {
        console.info('Phone calls not supported on this device');
      }
    } catch (error) {
      console.error('Error opening dialer:', error);
    }
  };

export const sanitizePhoneNum = (phoneNum: string) => {
  if(!validatePhoneNumber(phoneNum)) {
    return null
  }
  // Remove all non-digit characters except potential leading +
  const cleaned = phoneNum.replace(/[^\d+]/g, '');
  
  // Handle cases where number starts with + followed by country code
  if (cleaned.startsWith('+')) {
    const digitsAfterPlus = cleaned.slice(1).replace(/\D/g, '');
    return `+${digitsAfterPlus}`;
  }
  
  // Remove any remaining non-digit characters for local numbers
  return cleaned.replace(/\D/g, '');
};

export const validatePhoneNumber = (phone: string): boolean => {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Check if the cleaned number has exactly 10 digits
  return /^\d{10}$/.test(cleaned);
};