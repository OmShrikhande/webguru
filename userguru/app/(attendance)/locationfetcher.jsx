// locationdetcher.jsx
import React, { useEffect } from 'react';
import { View, Text, Alert, Platform } from 'react-native';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';

const LOCATION_TASK_NAME = 'background-location-task';

const LocationDetcher = () => {
  useEffect(() => {
    startLocationUpdates();
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

    const isTaskDefined = TaskManager.isTaskDefined(LOCATION_TASK_NAME);
    const hasStarted = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);

    if (!hasStarted) {
      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.High,
        timeInterval: 15 * 60 * 1000, // 15 minutes
        distanceInterval: 0,
        showsBackgroundLocationIndicator: false,
        foregroundService: {
          notificationTitle: 'Location Tracking',
          notificationBody: 'Tracking your location in background.',
        },
      });
    }
  };

  return (
    <View>
      <Text>Location Tracker Running (Expo)</Text>
    </View>
  );
};

export default LocationDetcher;
