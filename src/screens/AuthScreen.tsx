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
import SignIn from "../components/SignIn";
import SignUp from "../components/SignUp";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTheme } from "../contexts/ThemeContext";
import { Theme } from "../constants/Theme";

type AuthScreenProps = {
  route: RouteProp<RootStackParamList, "Auth">;
  navigation: NativeStackNavigationProp<RootStackParamList, "Auth">;
};

export default function AuthScreen({ route, navigation }: AuthScreenProps) {
  const [isLogin, setIsLogin] = useState(true);

  const { loading, authError } = useAuth();
  const { theme } = useTheme();

  const styles = makeStyles(theme.colors)

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

const makeStyles = (colors: Theme['colors']) => StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      justifyContent: "center",
      backgroundColor: colors.secondaryBackground
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 20,
      textAlign: "center",
      color: colors.primary
    },
    switchText: {
      color: colors.primary,
      textAlign: "center",
      marginTop: 20,
    }
  });