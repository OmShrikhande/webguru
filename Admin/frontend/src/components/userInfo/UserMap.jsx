import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const UserMap = ({ latitude, longitude }) => (
  <MapContainer center={[latitude, longitude]} zoom={13} style={{ height: '100%', width: '100%' }}>
    <TileLayer
      attribution='&copy; OpenStreetMap contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    <Marker position={[latitude, longitude]}>
      <Popup>User Location</Popup>
    </Marker>
  </MapContainer>
);
export default UserMap;