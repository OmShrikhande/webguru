import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix leaflet's default icon path
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const UserMap = ({ latitude, longitude }) => {
  console.log('UserMap received props:', { latitude, longitude });
  
  // Convert to numbers to ensure proper comparison
  const lat = Number(latitude);
  const lng = Number(longitude);
  
  if (isNaN(lat) || isNaN(lng) || lat === 0 || lng === 0) {
    console.log('UserMap: Invalid coordinates, not rendering map');
    return <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">No location data available</div>;
  }

  console.log('UserMap: Rendering map with coordinates:', { lat, lng });
  return (
    <MapContainer center={[lat, lng]} zoom={13} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        attribution='© OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[lat, lng]}>
        <Popup>User Location</Popup>
      </Marker>
    </MapContainer>
  );
};

export default UserMap;