import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { AuthButton } from "./auth/AuthButton";
import { OtpInput } from "./auth/OtpInput";
import { PhoneInput } from "./auth/PhoneInput";
import { RootStackParamList } from "../types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Theme } from "../constants/Theme";

type SignInProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Auth">;
};

export default function SignIn({ navigation }: SignInProps) {
  const [error, setError] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpField, setShowOtpField] = useState(false);
  const { signIn, loading } = useAuth();
  const { theme } = useTheme();
  const styles = makeStyles(theme.colors);

  const validatePhone = (phone: string) => {
    const regex = /^\+?[0-9]{7,14}$/;
    return regex.test(phone);
  };

  const handleOtpRequest = async () => {
    if (!validatePhone(phone)) {
      setError("Please enter a valid phone number");
      return;
    }

    try {
      await signIn({ method: 'otp', phone });
      setShowOtpField(true);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to send OTP");
    }
  };

  const handleOtpVerification = async () => {
    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      await signIn({ method: 'otp', phone, code: otp });
      navigation.goBack();
    } catch (error) {
      console.error('Error while verifying otp', error)
      setError(error instanceof Error ? error.message : "Failed to verify OTP");
    }
  };

  return (
    <View style={styles.container}>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {!showOtpField ? (
        <PhoneInput
          value={phone}
          onChangeText={setPhone}
          colors={theme.colors}
        />
      ) : (
        <OtpInput
          value={otp}
          onChangeText={setOtp}
          colors={theme.colors}
        />
      )}

      <AuthButton
        title={showOtpField ? "Verify OTP" : "Send OTP"}
        onPress={showOtpField ? handleOtpVerification : handleOtpRequest}
        colors={theme.colors}
      />
    </View>
  );
}

const makeStyles = (colors: Theme["colors"]) => StyleSheet.create({
  container: {
    width: '100%',
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
});
