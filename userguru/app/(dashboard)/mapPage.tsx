import React, { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { WebView } from "react-native-webview";
import * as FileSystem from "expo-file-system";
import XLSX from "xlsx";
import { collection, query, where, getDocs, Timestamp } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useAuthContext } from "../../context/AuthContext";

export default function MapPage() {
  const { user } = useAuthContext();
  const [markers, setMarkers] = useState<{ latitude: number; longitude: number; description: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0); // Start of the day
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999); // End of the day

        if (!user) {
          throw new Error("User is not authenticated.");
        }

        const attendanceQuery = query(
          collection(db, "attendance"),
          where("uid", "==", user.uid),
          where("timestamp", ">=", Timestamp.fromDate(todayStart)),
          where("timestamp", "<=", Timestamp.fromDate(todayEnd))
        );

        const attendanceSnapshot = await getDocs(attendanceQuery);
        const attendanceMarkers = attendanceSnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            latitude: data.location.latitude,
            longitude: data.location.longitude,
            description: `Attendance Time: ${data.timestamp.toDate().toLocaleString()}`,
            source: "firestore", // Add source
          };
        });

        const fileUri = FileSystem.documentDirectory + "locations.xlsx";
        const fileExists = await FileSystem.getInfoAsync(fileUri);

        let xlsxMarkers: { latitude: number; longitude: number; description: string }[] = [];
        if (fileExists.exists) {
          try {
            const fileData = await FileSystem.readAsStringAsync(fileUri, {
              encoding: FileSystem.EncodingType.Base64,
            });
            const workbook = XLSX.read(fileData, { type: "base64" });
            const worksheet = workbook.Sheets["Locations"];
            const jsonData = XLSX.utils.sheet_to_json<{ Latitude: number; Longitude: number; Timestamp: string }>(worksheet);

            xlsxMarkers = jsonData.map((item) => ({
              latitude: item.Latitude,
              longitude: item.Longitude,
              description: `Logged Time: ${item.Timestamp}`,
              source: "xlsx", // Add source
            }));
          } catch (error) {
            console.error("Error processing XLSX file:", error);
            Alert.alert("Error", "Failed to process location data from the file.");
          }
        }

        if (attendanceMarkers.length === 0 && xlsxMarkers.length === 0) {
          Alert.alert("No Data", "No markers available to display on the map.");
        }

        setMarkers([...attendanceMarkers, ...xlsxMarkers]);
      } catch (error) {
        console.error("Error fetching data:", error);
        Alert.alert("Error", "Failed to load map data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading || markers.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  const markersString = JSON.stringify(markers);

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Google Maps</title>
        <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAUgBbj1x9Pnm-XbGbJ-N-erUw6p10oqJ8"></script>
        <style>
          #map {
            height: 100%;
            width: 100%;
          }
          html, body {
            height: 100%;
            margin: 0;
            padding: 0;
          }
          .custom-label {
            font-size: 16px;
            font-weight: bold;
            color: #333;
            background-color: rgba(255, 255, 255, 0.8);
            padding: 4px;
            border-radius: 4px;
          }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          const markers = ${markersString};

          function initMap() {
            const map = new google.maps.Map(document.getElementById("map"), {
              center: { lat: 28.7041, lng: 77.1025 }, // Default to Delhi
              zoom: 4,
              gestureHandling: "greedy", // Enables zooming with gestures
              zoomControl: true, // Displays zoom controls
            });

            const bounds = new google.maps.LatLngBounds();

            markers.forEach(marker => {
              const icon = {
                url: marker.source === "firestore"
                  ? "http://maps.google.com/mapfiles/ms/icons/red-dot.png" // Firestore markers
                  : "http://maps.google.com/mapfiles/ms/icons/blue-dot.png", // XLSX markers
                scaledSize: new google.maps.Size(40, 40), // Increase marker size
              };

              const markerInstance = new google.maps.Marker({
                position: { lat: marker.latitude, lng: marker.longitude },
                map: map,
                title: "Location",
                icon: icon, // Assign the custom icon
              });

              const infoWindow = new google.maps.InfoWindow({
                content: \`<div class="custom-label">\${marker.description}</div>\`,
              });

              markerInstance.addListener("click", () => {
                infoWindow.open(map, markerInstance);
              });

              bounds.extend(markerInstance.position); // Extend bounds to include this marker
            });

            // Adjust the map to fit all markers
            map.fitBounds(bounds);
          }

          window.onload = initMap;
        </script>
      </body>
    </html>
  `;

  return <WebView originWhitelist={['*']} source={{ html: htmlContent }} style={styles.map} />;
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});