// app/(attendance)/mark.tsx
import React, { useState } from "react";
import { View, Text, Button, Alert, StyleSheet, ActivityIndicator } from "react-native";
import { addDoc, collection, doc, getDoc, getDocs, query, where, Timestamp } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useAuthContext } from "../../context/AuthContext";
import * as Location from "expo-location";

export default function MarkAttendance() {
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(false);

  const handleMarkAttendance = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Get the current time
      const now = new Date();
      const currentHour = now.getHours();

      // Check if the current time is within office hours (10 AM to 7 PM)
      if (currentHour < 10 || currentHour > 19) {
        Alert.alert("Office Hours Over", "You can only mark attendance between 10 AM and 7 PM.");
        setLoading(false);
        return;
      }

      // Fetch today's attendance records for the user
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0); // Start of the day
      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999); // End of the day

      const attendanceQuery = query(
        collection(db, "attendance"),
        where("uid", "==", user.uid),
        where("timestamp", ">=", Timestamp.fromDate(todayStart)),
        where("timestamp", "<=", Timestamp.fromDate(todayEnd))
      );

      const attendanceSnapshot = await getDocs(attendanceQuery);
      const attendanceCount = attendanceSnapshot.size;

      // Check if the user has already marked attendance 3 times today
      if (attendanceCount >= 3) {
        Alert.alert("Limit Reached", "You can only mark attendance 3 times a day.");
        setLoading(false);
        return;
      }

      // Request location permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Location permission is required to mark attendance.");
        setLoading(false);
        return;
      }

      // Fetch the user's current location
      const locationData = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = locationData.coords;

      // Fetch the constant allowed location from Firestore
      const userDocRef = doc(db, "users", user.uid); // Assuming the document ID is the user's UID
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        Alert.alert("Error", "User data not found.");
        setLoading(false);
        return;
      }

      const allowedLocation = userDoc.data()?.location; // Assuming the location field exists in the user's document
      if (!allowedLocation) {
        Alert.alert("Error", "Allowed location not set for this user.");
        setLoading(false);
        return;
      }

      const distance = calculateDistance(
        latitude,
        longitude,
        allowedLocation.latitude,
        allowedLocation.longitude
      );

      // Check if the user is within 100 meters of the allowed location
      if (distance <= 0.1) {
        // Mark attendance as "present"
        await addDoc(collection(db, "attendance"), {
          uid: user.uid,
          email: user.email,
          timestamp: Timestamp.now(),
          status: "present",
          location: {
            latitude,
            longitude,
          },
        });

        Alert.alert("Success", "Attendance marked successfully!");
      } else {
        // Mark attendance as "absent"
        await addDoc(collection(db, "attendance"), {
          uid: user.uid,
          email: user.email,
          timestamp: Timestamp.now(),
          status: "absent",
          location: {
            latitude,
            longitude,
          },
        });

        Alert.alert("Error", "You are not at the allowed location. Attendance marked as absent.");
      }
    } catch (error) {
      console.error("Error marking attendance:", error);
      Alert.alert("Error", "Failed to mark attendance.");
    } finally {
      setLoading(false);
    }
  };

  // Function to calculate the distance between two coordinates (in kilometers)
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const toRad = (value: number) => (value * Math.PI) / 180;
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mark Attendance</Text>
      <Text style={styles.subtitle}>Welcome, {user?.email}</Text>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Marking Attendance...</Text>
        </View>
      ) : (
        <Button title="Mark Attendance" onPress={handleMarkAttendance} color="#4CAF50" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4f7",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 20,
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#555",
  },
});
