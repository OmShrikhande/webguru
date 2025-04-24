import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, TextInput, Button } from "react-native";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useAuthContext } from "../../context/AuthContext";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import Papa from "papaparse";

interface Record {
  id: string;
  uid: string;
  email: string;
  status: string;
  timestamp: string;
}

export default function ViewAllAttendance() {
  const { role } = useAuthContext();
  const [records, setRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState(true);
  const [emailFilter, setEmailFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  useEffect(() => {
    const fetchAllAttendance = async () => {
      try {
        const q = query(collection(db, "attendance"), orderBy("timestamp", "desc"));
        const snapshot = await getDocs(q);

        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          uid: doc.data().uid,
          email: doc.data().email,
          status: doc.data().status,
          timestamp: doc.data().timestamp.toDate().toISOString().split("T")[0],
        }));

        setRecords(data);
      } catch (error) {
        console.error("Error fetching attendance:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllAttendance();
  }, []);

  const filteredRecords = records.filter((r) => {
    const matchesEmail = emailFilter ? r.email.includes(emailFilter) : true;
    const matchesDate = dateFilter ? r.timestamp.includes(dateFilter) : true;
    return matchesEmail && matchesDate;
  });

  const handleExportCSV = async () => {
    const csv = Papa.unparse(records);
    const path = FileSystem.documentDirectory + "attendance.csv";

    await FileSystem.writeAsStringAsync(path, csv, {
      encoding: FileSystem.EncodingType.UTF8,
    });
    await Sharing.shareAsync(path);
  };

  if (role !== "admin") {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text>You are not authorized to view this page.</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white px-4 pt-6">
      <Text className="text-2xl font-bold mb-4">All Attendance Records</Text>

      <TextInput
        placeholder="Filter by email"
        value={emailFilter}
        onChangeText={setEmailFilter}
        className="border px-2 py-1 mb-2"
      />
      <TextInput
        placeholder="Filter by date (YYYY-MM-DD)"
        value={dateFilter}
        onChangeText={setDateFilter}
        className="border px-2 py-1 mb-4"
      />

      <Button title="Export to CSV" onPress={handleExportCSV} />

      <FlatList
        data={filteredRecords}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="mb-3 p-3 bg-gray-100 rounded-xl">
            <Text className="font-bold">{item.email}</Text>
            <Text>Status: {item.status}</Text>
            <Text>Date: {item.timestamp}</Text>
          </View>
        )}
      />
    </View>
  );
}
