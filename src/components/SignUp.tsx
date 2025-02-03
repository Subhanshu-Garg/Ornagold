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

      
      const redirect = route?.params?.redirect
      if (redirect) {
        navigation.navigate(redirect.screen, redirect.params);
      } else {
        navigation.navigate('Home');
      }
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
        value={displayName}
        onChangeText={setDisplayName}
        autoCapitalize="none"
      />
      
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
