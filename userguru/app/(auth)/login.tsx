import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { useRouter } from "expo-router";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true); // To handle the initial loading state

  useEffect(() => {
    // Check if the user is already logged in
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // If the user is logged in, navigate to the dashboard
        router.replace("../(dashboard)");
      } else {
        // If no user is logged in, stop the loading spinner
        setLoading(false);
      }
    });

    // Cleanup the listener on unmount
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      setLoading(true); // Show loading spinner during login
      // Sign in the user
      await signInWithEmailAndPassword(auth, email, password);

      // Navigate to the dashboard
      router.replace("../(dashboard)");
    } catch (error: any) {
      Alert.alert("Login Error", error.message);
    } finally {
      setLoading(false); // Stop loading spinner after login attempt
    }
  };

  if (loading) {
    // Show a loading spinner while checking the user's authentication state
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text>Checking authentication...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} />
      <Text style={styles.link} onPress={() => router.push("/(auth)/register")}>
        Don't have an account? Register
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: "center" },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 24 },
  input: { borderWidth: 1, borderColor: "#ccc", marginBottom: 12, padding: 12, borderRadius: 8 },
  link: { marginTop: 12, color: "blue", textAlign: "center" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
});
