// app/(attendance)/history.tsx
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useAuthContext } from "../../context/AuthContext";

interface AttendanceRecord {
  id: string;
  timestamp: string;
  status: string;
  email: string;
  location?: {
    latitude: number;
    longitude: number;
  };
}

export default function AttendanceHistory() {
  const { user } = useAuthContext();
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState("date");

  useEffect(() => {
    const fetchAttendance = async () => {
      if (!user) return;

      try {
        const q = query(
          collection(db, "attendance"),
          where("uid", "==", user.uid),
          orderBy("timestamp", "desc")
        );

        const snapshot = await getDocs(q);

        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          email: doc.data().email,
          timestamp: doc.data().timestamp.toDate().toLocaleString(),
          status: doc.data().status,
          location: doc.data().location,
        }));

        setRecords(data);
      } catch (error) {
        console.error("Error fetching attendance:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [user]);

  const sortRecords = (option: string) => {
    let sortedRecords = [...records];
    if (option === "date") {
      sortedRecords.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    } else if (option === "status") {
      sortedRecords.sort((a, b) => a.status.localeCompare(b.status));
    } else if (option === "email") {
      sortedRecords.sort((a, b) => a.email.localeCompare(b.email));
    }
    return sortedRecords;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Fetching Attendance Records...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Attendance History</Text>
      </View>

      {/* Sorting Dropdown */}
      <Picker
        selectedValue={sortOption}
        style={styles.picker}
        onValueChange={(itemValue) => setSortOption(itemValue)}
      >
        <Picker.Item label="Sort by Date" value="date" />
        <Picker.Item label="Sort by Status" value="status" />
        <Picker.Item label="Sort by Email" value="email" />
      </Picker>

      {records.length === 0 ? (
        <Text style={styles.noRecordsText}>No attendance records found.</Text>
      ) : (
        <FlatList
          data={sortRecords(sortOption)}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Status: {item.status}</Text>
              <Text style={styles.cardText}>Time: {item.timestamp}</Text>
              <Text style={styles.cardText}>Email: {item.email}</Text>
              {item.location && (
                <>
                  <Text style={styles.cardText}>
                    Latitude: {item.location.latitude}
                  </Text>
                  <Text style={styles.cardText}>
                    Longitude: {item.location.longitude}
                  </Text>
                </>
              )}
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 16,
  },
  header: {
    backgroundColor: "#4CAF50",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: "center",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  picker: {
    height: 50,
    width: "100%",
    marginBottom: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: 8,
    elevation: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#555",
  },
  noRecordsText: {
    fontSize: 18,
    color: "#888",
    textAlign: "center",
    marginTop: 20,
    fontStyle: "italic",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  cardText: {
    fontSize: 16,
    color: "#555",
    marginBottom: 4,
  },
});
