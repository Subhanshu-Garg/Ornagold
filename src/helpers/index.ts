import { Linking } from "react-native";

export const handleContactPress = async () => {
    try {
      const phoneNumber = 'tel:+917011564838';
      const supported = await Linking.canOpenURL(phoneNumber);
      
      if (supported) {
        await Linking.openURL(phoneNumber);
      } else {
        console.info('Phone calls not supported on this device');
      }
    } catch (error) {
      console.error('Error opening dialer:', error);
    }
  };