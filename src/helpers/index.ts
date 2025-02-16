import * as Linking from 'expo-linking';

export const handleContactPress = async (phoneNum: string | void) => {
    try {
      const rawNumber = phoneNum || '+917011564838'; // Default without country code
      const sanitized = sanitizePhoneNum(rawNumber) || rawNumber;
      const phoneNumber = `tel:${sanitized}`;
      await Linking.openURL(phoneNumber);
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
  // Remove all non-digit characters except leading +
  const cleaned = phone.replace(/[^\d+]/g, '');
  
  // Check if the number is either:
  // 1. Exactly 10 digits, or
  // 2. Starts with +91 followed by 10 digits, or
  // 3. Starts with 91 followed by 10 digits
  return /^\d{10}$/.test(cleaned) || 
         /^\+91\d{10}$/.test(cleaned) || 
         /^91\d{10}$/.test(cleaned);
};