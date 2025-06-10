import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
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

// Helper component to focus map on marker
const FocusButton = ({ lat, lng }) => {
  const map = useMap();
  const handleFocus = () => {
    map.setView([lat, lng], 15, { animate: true });
  };
  
  return (
    <button
      type="button"
      onClick={handleFocus}
      style={{ 
        position: 'absolute', 
        top: '16px', 
        right: '16px', 
        zIndex: 1000, 
        background: 'linear-gradient(90deg, #3f51b5, #2196f3)',
        color: 'white',
        fontWeight: 600,
        padding: '6px 16px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
        border: 'none',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        pointerEvents: 'auto'
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.background = 'linear-gradient(90deg, #303f9f, #1e88e5)';
        e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.3)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.background = 'linear-gradient(90deg, #3f51b5, #2196f3)';
        e.currentTarget.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
      }}
    >
      Focus Marker
    </button>
  );
};

// Helper component to fit map to route bounds
const FitBoundsToRoute = ({ positions }) => {
  const map = useMap();
  
  useEffect(() => {
    if (positions && positions.length > 0) {
      const bounds = L.latLngBounds(positions);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, positions]);
  
  return null;
};

const UserMap = ({ latitude, longitude, loading, routePositions = [], locationData = [] }) => {
  const lat = Number(latitude);
  const lng = Number(longitude);
  
  // Make sure we have at least 2 valid positions for a route
  const validRoutePositions = Array.isArray(routePositions) ? 
    routePositions.filter(pos => 
      Array.isArray(pos) && 
      pos.length === 2 && 
      !isNaN(pos[0]) && 
      !isNaN(pos[1]) &&
      pos[0] !== 0 &&
      pos[1] !== 0
    ) : [];
  
  const hasRoute = validRoutePositions.length > 1;
  
  // Log route information
  useEffect(() => {
    console.log(`UserMap received ${routePositions.length} route positions, ${validRoutePositions.length} are valid`);
    if (validRoutePositions.length > 0) {
      console.log('First valid position:', validRoutePositions[0]);
      console.log('Last valid position:', validRoutePositions[validRoutePositions.length - 1]);
    }
  }, [routePositions, validRoutePositions]);
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown time';
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Calculate distance between two points in kilometers
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const distance = R * c; // Distance in km
    return distance;
  };
  
  // Calculate total route distance
  const calculateRouteDistance = (positions) => {
    if (!positions || positions.length < 2) return 0;
    
    let totalDistance = 0;
    for (let i = 0; i < positions.length - 1; i++) {
      const [lat1, lon1] = positions[i];
      const [lat2, lon2] = positions[i + 1];
      totalDistance += calculateDistance(lat1, lon1, lat2, lon2);
    }
    
    return totalDistance.toFixed(2);
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100%', 
        width: '100%', 
        color: '#3f51b5',
        animation: 'pulse 1.5s infinite ease-in-out'
      }}>
        Loading map...
      </div>
    );
  }

  if ((isNaN(lat) || isNaN(lng) || lat === 0 || lng === 0) && !hasRoute) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100%', 
        width: '100%', 
        color: 'rgba(255, 255, 255, 0.6)'
      }}>
        No location data available
      </div>
    );
  }

  // Center on the most recent location or the first route position
  const centerPosition = [lat, lng];
  if (isNaN(lat) || isNaN(lng) || lat === 0 || lng === 0) {
    if (hasRoute) {
      const lastPosition = routePositions[routePositions.length - 1];
      centerPosition[0] = lastPosition[0];
      centerPosition[1] = lastPosition[1];
    }
  }

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <MapContainer
        center={centerPosition}
        zoom={13}
        style={{ 
          minHeight: 300, 
          height: '100%', 
          width: '100%', 
          borderRadius: '12px',
          overflow: 'hidden'
        }}
      >
        <TileLayer
          attribution='© OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Current location marker */}
        {!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0 && (
          <Marker position={[lat, lng]}>
            <Popup>Current Location</Popup>
          </Marker>
        )}
        
        {/* Route polyline */}
        {hasRoute && (
          <>
            {/* Route track with animated effect */}
            <Polyline 
              positions={validRoutePositions}
              pathOptions={{ 
                color: '#3f51b5', // Indigo color
                weight: 5,
                opacity: 0.7,
                lineCap: 'round',
                lineJoin: 'round'
              }}
            />
            
            {/* Route highlight effect */}
            <Polyline 
              positions={validRoutePositions}
              pathOptions={{ 
                color: '#90caf9', // Light blue
                weight: 2,
                opacity: 0.9,
                lineCap: 'round',
                lineJoin: 'round',
                dashArray: '10, 10',
                dashOffset: '0'
              }}
            />
            
            {/* Direction arrow effect */}
            <Polyline 
              positions={validRoutePositions}
              pathOptions={{ 
                color: '#1a237e', // Darker indigo
                weight: 3,
                opacity: 0.8,
                lineCap: 'round',
                lineJoin: 'round',
                dashArray: '0, 15, 10, 15',
                dashOffset: '0'
              }}
            />
            
            {/* Add markers for each point in the route */}
            {validRoutePositions.map((position, index) => {
              // Only show markers for start, end, and every 3rd point to avoid clutter
              if (index === 0 || index === validRoutePositions.length - 1 || index % 3 === 0) {
                // Get timestamp from locationData if available
                const timestamp = locationData && locationData[index] ? 
                  locationData[index].timestamp : null;
                
                return (
                  <Marker 
                    key={`route-point-${index}`} 
                    position={position}
                    opacity={index === validRoutePositions.length - 1 ? 1 : 
                             index === 0 ? 0.9 : 0.6}
                  >
                    <Popup>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontWeight: 600 }}>
                          {index === 0 ? 'Starting Point' : 
                           index === validRoutePositions.length - 1 ? 'Latest Location' : 
                           `Waypoint ${index}`}
                        </div>
                        {timestamp && (
                          <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '4px' }}>
                            {formatDate(timestamp)}
                          </div>
                        )}
                        <div style={{ fontSize: '0.75rem', marginTop: '4px' }}>
                          {position[0].toFixed(6)}, {position[1].toFixed(6)}
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                );
              }
              return null;
            })}
            
            {/* Fit map to route bounds */}
            <FitBoundsToRoute positions={validRoutePositions} />
          </>
        )}
        
        {/* Focus button */}
        {(!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) && (
          <FocusButton lat={lat} lng={lng} />
        )}
      </MapContainer>
    </div>
  );
};

export default UserMap;