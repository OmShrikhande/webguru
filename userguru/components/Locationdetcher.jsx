// locationdetcher.jsx
import React, { useEffect, useState } from 'react';
import { View, Text, Alert, StyleSheet, FlatList } from 'react-native';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import * as FileSystem from 'expo-file-system';
import XLSX from 'xlsx';

const LOCATION_TASK_NAME = 'background-location-task';

const LocationDetcher = () => {
  const [tracking, setTracking] = useState(false);
  const [locationData, setLocationData] = useState([]);

  useEffect(() => {
    const checkTimeAndStartUpdates = async () => {
      const now = new Date();
      const istTime = new Date(now.getTime() + 5.5 * 60 * 60 * 1000); // Convert to IST
      const currentHour = istTime.getHours();

      if (currentHour >= 10 && currentHour < 19) {
        // Start location updates if within allowed time
        await startLocationUpdates();
        setTracking(true);
      } else {
        // Stop location updates and load data if outside allowed time
        await stopLocationUpdates();
        setTracking(false);
        await loadLocationData();
      }
    };

    checkTimeAndStartUpdates();

    // Periodically check the time to stop/start tracking
    const interval = setInterval(checkTimeAndStartUpdates, 60 * 1000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const startLocationUpdates = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Location permission is required.');
      return;
    }

    const bgStatus = await Location.requestBackgroundPermissionsAsync();
    if (bgStatus.status !== 'granted') {
      Alert.alert('Permission denied', 'Background location is required.');
      return;
    }

    const hasStarted = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);

    if (!hasStarted) {
      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.High,
        timeInterval: 20 * 60 * 1000, // 20 minutes
        distanceInterval: 0,
        showsBackgroundLocationIndicator: false,
        foregroundService: {
          notificationTitle: 'Location Tracking',
          notificationBody: 'Tracking your location in background.',
        },
      });
    }
  };

  const stopLocationUpdates = async () => {
    const hasStarted = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
    if (hasStarted) {
      await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
    }
  };

  const loadLocationData = async () => {
    try {
      const fileUri = FileSystem.documentDirectory + 'locations.xlsx';
      const fileExists = await FileSystem.getInfoAsync(fileUri);

      if (!fileExists.exists) {
        console.log('No location data file found.');
        return;
      }

      const fileData = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const workbook = XLSX.read(fileData, { type: 'base64' });
      const worksheet = workbook.Sheets['Locations'];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      setLocationData(jsonData);
    } catch (error) {
      console.error('Error loading location data:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Location Tracker</Text>
      {tracking ? (
        <Text style={styles.trackingText}>Tracking your location...</Text>
      ) : (
        <View>
          <Text style={styles.trackingText}>Tracking stopped. Location data:</Text>
          {locationData.length > 0 ? (
            <View style={styles.tableContainer}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableCell, styles.headerCell]}>Timestamp</Text>
                <Text style={[styles.tableCell, styles.headerCell]}>Latitude</Text>
                <Text style={[styles.tableCell, styles.headerCell]}>Longitude</Text>
              </View>
              <FlatList
                data={locationData}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <View style={styles.tableRow}>
                    <Text style={styles.tableCell}>{item.Timestamp}</Text>
                    <Text style={styles.tableCell}>{item.Latitude}</Text>
                    <Text style={styles.tableCell}>{item.Longitude}</Text>
                  </View>
                )}
              />
            </View>
          ) : (
            <Text style={styles.noDataText}>No location data available.</Text>
          )}
        </View>
      )}
    </View>
  );
};

// Define the background task
TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error('Error in background task:', error);
    return;
  }

  if (data) {
    const { locations } = data;
    const location = locations[0]; // Get the first location from the array
    const timestamp = new Date(location.timestamp).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }); // Convert to IST
    const { latitude, longitude } = location.coords;

    const fileUri = FileSystem.documentDirectory + 'locations.xlsx';
    let existingData = [];

    // Read existing data from the file
    const fileExists = await FileSystem.getInfoAsync(fileUri);
    if (fileExists.exists) {
      const fileData = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const workbook = XLSX.read(fileData, { type: 'base64' });
      const worksheet = workbook.Sheets['Locations'];
      existingData = XLSX.utils.sheet_to_json(worksheet);
    }

    // Append new data
    const newData = [...existingData, { Timestamp: timestamp, Latitude: latitude, Longitude: longitude }];
    const worksheet = XLSX.utils.json_to_sheet(newData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Locations');

    // Write updated data back to the file
    const xlsData = XLSX.write(workbook, { type: 'base64', bookType: 'xlsx' });
    await FileSystem.writeAsStringAsync(fileUri, xlsData, {
      encoding: FileSystem.EncodingType.Base64,
    });

    console.log(`Location saved to ${fileUri}`);
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  trackingText: {
    fontSize: 16,
    marginBottom: 10,
  },
  tableContainer: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
    width: '100%', // Make the table span the full width
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    padding: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    padding: 10,
  },
  tableCell: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  headerCell: {
    fontWeight: 'bold',
    color: '#fff',
  },
  noDataText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default LocationDetcher;
