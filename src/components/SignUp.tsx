import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Switch,
} from "react-native";
import { RootStackParamList } from "../types";
import { useAuth } from "../contexts/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTheme } from "../contexts/ThemeContext";
import { Theme } from "../constants/Theme";

type SignUpProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Auth">;
  route?: RouteProp<RootStackParamList, "Auth">;
};

export default function SignUp({ navigation, route }: SignUpProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isShopOwner, setIsShopOwner] = useState(false);
  const [error, setError] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpField, setShowOtpField] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [form, setForm] = useState<"email" | "phone">("email");

  const { signUp, loading } = useAuth();
  const { theme } = useTheme()

  const styles = makeStyles(theme.colors)

  const validatePhone = (phone: string) => {
    const regex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im;
    return regex.test(phone);
  };

  const handleSignUp = async (method: 'email' | 'phone') => {
    try {
      await signUp({
        method,
        email,
        password,
        phone,
        code: otp,
        displayName
      });

      navigation.goBack()
    } catch (error) {
      setError(error instanceof Error ? error.message : "Sign up failed");
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <View>
      <TextInput
        style={styles.input}
        placeholder="Your name"
        placeholderTextColor={theme.colors.textSecondary}
        value={displayName}
        onChangeText={setDisplayName}
        autoCapitalize="none"
      />
      
      {form === "phone" && (
        <TextInput
          style={styles.input}
          placeholder="Mobile Number"
          placeholderTextColor={theme.colors.textSecondary}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          onBlur={() => {
            if (!validatePhone(phone)) {
              setError("Please enter a valid phone number");
            }
          }}
        />
      )}

      {showOtpField && (
        <TextInput
          style={styles.input}
          placeholder="Enter OTP"
          placeholderTextColor={theme.colors.textSecondary}
          value={otp}
          onChangeText={setOtp}
          keyboardType="number-pad"
        />
      )}

      {form === "email" && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={theme.colors.textSecondary}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={theme.colors.textSecondary}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </>
      )}

      {/* <View style={styles.switchContainer}>
        <Text>Are you a shop owner?</Text>
        <Switch value={isShopOwner} onValueChange={setIsShopOwner} />
      </View> */}

      {error && <Text style={{ color: "red" }}>{error}</Text>}

      <TouchableOpacity
        style={styles.button}
        onPress={async () => {
          if (form === 'email') {
            await handleSignUp('email');
          } else if (validatePhone(phone)) {
            setShowOtpField(true);
            await handleSignUp('phone');
          }
        }}
      >
        <Text style={styles.buttonText}>
          {form === 'email' ? 'Sign Up' : showOtpField ? 'Verify OTP' : 'Send OTP'}
        </Text>
      </TouchableOpacity>

      {/* <TouchableOpacity
        style={styles.switchText}
        onPress={() => setForm(form === "email" ? "phone" : "email")}
      >
        <Text style={styles.switchText}>
          {form === "email" ? "Use Phone Instead" : "Use Email Instead"}
        </Text>
      </TouchableOpacity> */}
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
  switchText: {
    color: colours.primary,
    textAlign: "center",
    marginTop: 20,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  }
});
