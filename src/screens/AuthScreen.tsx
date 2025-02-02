import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Switch,
  Button,
} from "react-native";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../types";
import { useAuth } from "../contexts/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import { NativeStackNavigationProp } from "@react-navigation/native-stack/lib/typescript/src/types";
import SignIn from "../components/SignIn";
import SignUp from "../components/SignUp";

type AuthScreenProps = {
  route: RouteProp<RootStackParamList, "Auth">;
  navigation: NativeStackNavigationProp<RootStackParamList, "Auth">;
};

export default function AuthScreen({ route, navigation }: AuthScreenProps) {
  const [isLogin, setIsLogin] = useState(true);

  const { loading, authError } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isLogin ? "Sign In" : "Sign Up"}</Text>

      {isLogin && <SignIn route={route} navigation={navigation}/>}

      {!isLogin && <SignUp navigation={navigation}/>}

      <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
        <Text style={styles.switchText}>
          {isLogin
            ? "Don't have an account? Sign Up"
            : "Already have an account? Sign In"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  switchText: {
    color: "#007AFF",
    textAlign: "center",
    marginTop: 20,
  }
});
