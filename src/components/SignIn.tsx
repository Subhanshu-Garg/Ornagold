import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
} from "react-native";
import { RootStackParamList } from "../types";
import { useAuth } from "../contexts/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTheme } from "../contexts/ThemeContext";
import { Theme } from "../constants/Theme";

type SignInProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Auth">;
  route?: RouteProp<RootStackParamList, "Auth">;
};

export default function SignIn({ navigation }: SignInProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpField, setShowOtpField] = useState(false);
  const [form, setForm] = useState("email");

  const { signIn, signUp, loading } = useAuth();
  const { theme } = useTheme();

  const styles = makeStyles(theme.colors);

  const validatePhone = (phone: string) => {
    const regex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im;
    return regex.test(phone);
  };

  const handleSignIn = async (method: "email" | "google" | "otp") => {
    await signIn({
      method,
      phone,
      code: otp,
      email,
      password,
    });

    navigation.goBack()
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      {error && <Text style={{ color: "red" }}>{error}</Text>}

      {form === "phone" && (
        <TextInput
          style={styles.input}
          placeholder="Mobile Number"
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

      {form === "email" ? (
        <TouchableOpacity
          style={styles.button}
          onPress={async () => await handleSignIn("email")}
        >
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.button}
          onPress={async () => {
            if (validatePhone(phone)) {
              setShowOtpField(true);
              await signIn({
                method: "otp",
                phone,
              });
              // Implement OTP sending logic here
            }
          }}
        >
          <Text style={styles.buttonText}>
            {showOtpField ? "Verify OTP" : "Send OTP"}
          </Text>
        </TouchableOpacity>
      )}

      {/* <TouchableOpacity
        style={styles.socialButton}
        onPress={async () => await handleSignIn("google")}
      >
        <Text style={styles.socialButtonText}>Continue with Google</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.socialButton}
        onPress={() => setForm(form === "email" ? "phone" : "email")}
      >
        <Text style={styles.socialButtonText}>
          {form === "email" ? "Continue with Mobile" : "Continue with Email"}
        </Text>
      </TouchableOpacity> */}
    </>
  );
}

const makeStyles = (colors: Theme["colors"]) => StyleSheet.create({
    input: {
      borderWidth: 1,
      borderColor: colors.primary,
      padding: 10,
      borderRadius: 8,
      marginBottom: 10,
      color: colors.textPrimary
    },
    button: {
      backgroundColor: colors.primary,
      padding: 15,
      borderRadius: 8,
      alignItems: "center",
      marginTop: 10,
    },
    buttonText: {
      color: colors.secondaryBackground,
      fontWeight: "bold",
    },
    switchText: {
      color: colors.textPrimary,
      textAlign: "center",
      marginTop: 20,
    },
    socialButton: {
      backgroundColor: colors.secondaryBackground,
    },
  });
