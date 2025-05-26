import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useAuthContext } from "../../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../../lib/firebase";
import LocationDetcher from "../../components/Locationdetcher"; // Corrected import path

export default function Dashboard() {
  const { user } = useAuthContext();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth); // Sign out the user
      router.replace("/(auth)/login"); // Navigate back to the login screen
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome,</Text>
      <Text style={styles.emailText}>{user?.email}</Text>

      <TouchableOpacity
        style={[styles.button, styles.attendanceButton]}
        onPress={() => router.push("/(attendance)/mark")}
      >
        <Text style={styles.buttonText}>Mark Attendance</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.historyButton]}
        onPress={() => router.push("/(attendance)/history")}
      >
        <Text style={styles.buttonText}>View History</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.mapButton]}
        onPress={() => router.push("/(dashboard)/mapPage")}
      >
        <Text style={styles.buttonText}>View Map</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.logoutButton]}
        onPress={handleLogout}
      >
        <Text style={styles.logoutButtonText}>Logout</Text> {/* Fixed Text wrapping */}
      </TouchableOpacity>

      <LocationDetcher /> {/* Ensure this is called to start location tracking */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  emailText: {
    fontSize: 18,
    color: "#555",
    marginBottom: 20,
  },
  button: {
    width: "80%",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 10,
  },
  attendanceButton: {
    backgroundColor: "#4CAF50",
  },
  historyButton: {
    backgroundColor: "#2196F3",
  },
  newPageButton: {
    backgroundColor: "#FFC107",
  },
  mapButton: {
    backgroundColor: "#FF5722",
  },
  logoutButton: {
    backgroundColor: "#F44336",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
