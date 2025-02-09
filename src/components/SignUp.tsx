import React, { useState } from "react";
import { StyleSheet, View, TextInput, TouchableOpacity, Text } from "react-native";
import { useAuth } from "../contexts/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import { useTheme } from "../contexts/ThemeContext";
import { Theme } from "../constants/Theme";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";

type SignUpProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Auth">;
};

export default function SignUp({ navigation }: SignUpProps) {
  const [error, setError] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpField, setShowOtpField] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");

  const { signUp, loading } = useAuth();
  const { theme } = useTheme();
  const styles = makeStyles(theme.colors);

  const validatePhone = (phone: string) => {
    // const regex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im;
    // return regex.test(phone);
    return true
  };

  const handleSignUp = async () => {
    try {
      if (!showOtpField) {
        if (!validatePhone(phone)) {
          setError("Please enter a valid phone number");
          return;
        }
        await signUp({ method: 'phone', phone, displayName, password });
        setShowOtpField(true);
      } else {
        if (otp.length !== 6) {
          setError("Please enter a valid 6-digit OTP");
          return;
        }
        await signUp({ method: 'phone', phone, code: otp, password, displayName });
        navigation.goBack();
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Sign up failed");
    }
  };

  return (
    <View>
      <TextInput
        style={styles.input}
        placeholder="Your name"
        placeholderTextColor={theme.colors.textSecondary}
        value={displayName}
        onChangeText={setDisplayName}
        autoCapitalize="words"
      />

      <TextInput
        style={styles.input}
        placeholder="Enter Password"
        placeholderTextColor={theme.colors.textSecondary}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!showOtpField}
      />

      <TextInput
        style={styles.input}
        placeholder="Mobile Number"
        placeholderTextColor={theme.colors.textSecondary}
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        editable={!showOtpField}
      />

      {showOtpField && (
        <TextInput
          style={styles.input}
          placeholder="Enter OTP"
          placeholderTextColor={theme.colors.textSecondary}
          value={otp}
          onChangeText={setOtp}
          keyboardType="number-pad"
          maxLength={6}
        />
      )}

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity
        style={styles.button}
        onPress={handleSignUp}
      >
        <Text style={styles.buttonText}>
          {showOtpField ? "Verify OTP" : "Send OTP"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const makeStyles = (colours: Theme['colors']) => StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: colours.primary,
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    color: colours.textPrimary
  },
  button: {
    backgroundColor: colours.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: colours.secondaryBackground,
    fontWeight: "bold",
  },
  error: {
    color: 'red',
    marginBottom: 10,
  }
});
