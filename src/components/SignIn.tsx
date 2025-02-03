import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text
} from "react-native";
import { RootStackParamList } from "../types";
import { useAuth } from "../contexts/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type SignInProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Auth">;
  route?: RouteProp<RootStackParamList, "Auth">;
};

export default function SignIn({ navigation, route }: SignInProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpField, setShowOtpField] = useState(false);
  const [form, setForm] = useState("email");

  const { signIn, signUp, loading } = useAuth();

  const validatePhone = (phone: string) => {
    const regex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im;
    return regex.test(phone);
  };

  const handleSignIn = async (method: 'email' | 'google' | 'otp') => {
    await signIn({
      method,
      phone,
      code: otp,
      email,
      password,
    });
    
    const redirect = route?.params?.redirect;
    if (redirect) {
      navigation.navigate(redirect.screen, redirect.params);
    } else {
      navigation.navigate('Home');
    }
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
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
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
          <Text style={styles.buttonText}>
            Sign In
          </Text>
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

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  switchText: {
    color: "#007AFF",
    textAlign: "center",
    marginTop: 20,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  socialButton: {
    backgroundColor: "#e3e3e3",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 5,
  },
  socialButtonText: {
    color: "#333",
    fontWeight: "bold",
  },
});
