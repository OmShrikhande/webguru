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
      className="absolute top-4 right-4 z-[1000] bg-gradient-to-r from-indigo-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white font-semibold py-1.5 px-4 rounded-lg shadow-lg transition-all duration-300 text-sm"
      style={{ pointerEvents: 'auto' }}
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
  const hasRoute = routePositions && routePositions.length > 1;

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
      <div className="flex items-center justify-center h-full w-full text-indigo-400 animate-pulse">
        Loading map...
      </div>
    );
  }

  if ((isNaN(lat) || isNaN(lng) || lat === 0 || lng === 0) && !hasRoute) {
    return (
      <div className="flex items-center justify-center h-full w-full text-gray-500 dark:text-gray-400">
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
    <div className="w-full h-full flex items-center justify-center relative">
      <div className="rounded-2xl overflow-hidden border-2 border-indigo-200 dark:border-indigo-700 shadow-lg w-full h-full relative">
        <MapContainer
          center={centerPosition}
          zoom={13}
          className="w-full h-[400px] min-h-[300px] bg-white dark:bg-gray-900"
          style={{ minHeight: 300, height: 400, width: '100%', position: 'relative' }}
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
                positions={routePositions}
                pathOptions={{ 
                  color: '#6366F1', // Indigo color
                  weight: 5,
                  opacity: 0.7,
                  lineCap: 'round',
                  lineJoin: 'round'
                }}
              />
              
              {/* Route highlight effect */}
              <Polyline 
                positions={routePositions}
                pathOptions={{ 
                  color: '#C4B5FD', // Light indigo
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
                positions={routePositions}
                pathOptions={{ 
                  color: '#4F46E5', // Darker indigo
                  weight: 3,
                  opacity: 0.8,
                  lineCap: 'round',
                  lineJoin: 'round',
                  dashArray: '0, 15, 10, 15',
                  dashOffset: '0'
                }}
              />
              
              {/* Add markers for each point in the route */}
              {routePositions.map((position, index) => {
                // Only show markers for start, end, and every 3rd point to avoid clutter
                if (index === 0 || index === routePositions.length - 1 || index % 3 === 0) {
                  // Get timestamp from locationData if available
                  const timestamp = locationData && locationData[index] ? 
                    locationData[index].timestamp : null;
                  
                  return (
                    <Marker 
                      key={`route-point-${index}`} 
                      position={position}
                      opacity={index === routePositions.length - 1 ? 1 : 
                               index === 0 ? 0.9 : 0.6}
                    >
                      <Popup>
                        <div className="text-center">
                          <div className="font-semibold">
                            {index === 0 ? 'Starting Point' : 
                             index === routePositions.length - 1 ? 'Latest Location' : 
                             `Waypoint ${index}`}
                          </div>
                          {timestamp && (
                            <div className="text-xs text-gray-600 mt-1">
                              {formatDate(timestamp)}
                            </div>
                          )}
                          <div className="text-xs mt-1">
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
              <FitBoundsToRoute positions={routePositions} />
            </>
          )}
          
          {/* Focus button */}
          {(!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) && (
            <FocusButton lat={lat} lng={lng} />
          )}
        </MapContainer>
      </div>
    </div>
  );
};

// --- UserLocationSection component ---
const UserLocationSection = ({ userId }) => {
  const [location, setLocation] = useState(null);
  const [allLocations, setAllLocations] = useState([]);
  const [locationData, setLocationData] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [filteredLocationData, setFilteredLocationData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newLatitude, setNewLatitude] = useState('');
  const [newLongitude, setNewLongitude] = useState('');
  const [locationMessage, setLocationMessage] = useState('');
  const [showRoute, setShowRoute] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [filterActive, setFilterActive] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [addMsg, setAddMsg] = useState('');

  // Format date for display
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Format date for input value (YYYY-MM-DD)
  const formatDateForInput = (date) => {
    const d = new Date(date);
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${d.getFullYear()}-${month}-${day}`;
  };
  
  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    return formatDateForInput(today);
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
  
  // Filter locations by date
  const filterLocationsByDate = (date) => {
    if (!date || !locationData.length) {
      setFilterActive(false);
      setFilteredLocations([]);
      setFilteredLocationData([]);
      return;
    }
    
    const selectedDateObj = new Date(date);
    selectedDateObj.setHours(0, 0, 0, 0); // Start of day
    
    const nextDay = new Date(selectedDateObj);
    nextDay.setDate(nextDay.getDate() + 1); // End of day (start of next day)
    
    // Filter locations that fall within the selected date
    const filtered = locationData.filter(loc => {
      const locDate = new Date(loc.timestamp);
      return locDate >= selectedDateObj && locDate < nextDay;
    });
    
    if (filtered.length > 0) {
      // Extract coordinates for the filtered route
      const filteredCoordinates = filtered.map(loc => [
        loc.location.latitude,
        loc.location.longitude
      ]);
      
      setFilteredLocations(filteredCoordinates);
      setFilteredLocationData(filtered);
      setFilterActive(true);
    } else {
      setFilteredLocations([]);
      setFilteredLocationData([]);
      setFilterActive(true); // Still show it's active but with no results
    }
  };

  // Fetch the most recent location
  const fetchLocation = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/admin/users/${userId}/locations`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setLocation(data.location);
      } else {
        setLocation(null);
      }
    } catch (err) {
      setLocation(null);
    }
  };

  // Fetch all locations for the route
  const fetchAllLocations = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/admin/users/${userId}/all-locations`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && data.locations && data.locations.length > 0) {
        // Sort locations by timestamp (oldest to newest)
        const sortedLocations = [...data.locations].sort((a, b) => 
          new Date(a.timestamp) - new Date(b.timestamp)
        );
        
        // Store the full location data for popups
        setLocationData(sortedLocations);
        
        // Extract coordinates for the route
        const routeCoordinates = sortedLocations.map(loc => [
          loc.location.latitude,
          loc.location.longitude
        ]);
        
        setAllLocations(routeCoordinates);
        
        // Set the most recent location if not already set
        if (!location && sortedLocations.length > 0) {
          const mostRecent = sortedLocations[sortedLocations.length - 1];
          setLocation(mostRecent.location);
        }
        
        // If there's a selected date, apply the filter
        if (selectedDate) {
          filterLocationsByDate(selectedDate);
        }
      } else {
        setAllLocations([]);
        setLocationData([]);
        setFilteredLocations([]);
        setFilteredLocationData([]);
      }
    } catch (err) {
      console.error('Error fetching all locations:', err);
      setAllLocations([]);
      setLocationData([]);
      setFilteredLocations([]);
      setFilteredLocationData([]);
    }
    setLoading(false);
  };
  
  // Handle date filter change
  const handleDateChange = (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    
    if (date) {
      filterLocationsByDate(date);
    } else {
      // Clear filter if date is empty
      setFilterActive(false);
      setFilteredLocations([]);
      setFilteredLocationData([]);
    }
  };
  
  // Clear date filter
  const clearDateFilter = () => {
    setSelectedDate('');
    setFilterActive(false);
    setFilteredLocations([]);
    setFilteredLocationData([]);
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchLocation();
      await fetchAllLocations();
    };
    
    fetchData();
    // eslint-disable-next-line
  }, [userId]);
  
  // Apply date filter when selectedDate changes
  useEffect(() => {
    if (locationData.length > 0 && selectedDate) {
      filterLocationsByDate(selectedDate);
    }
    // eslint-disable-next-line
  }, [selectedDate]);

  const handleAddLocation = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const latitude = parseFloat(newLatitude);
      const longitude = parseFloat(newLongitude);
      if (isNaN(latitude) || isNaN(longitude)) {
        setLocationMessage('Please enter valid numbers for latitude and longitude');
        return;
      }
      const res = await fetch(`http://localhost:5000/api/admin/users/${userId}/locations`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ latitude, longitude })
      });
      const data = await res.json();
      if (data.success) {
        setLocationMessage('Location added successfully!');
        setNewLatitude('');
        setNewLongitude('');
        // Refresh both location data
        await fetchLocation();
        await fetchAllLocations();
      } else {
        setLocationMessage(`Failed to add location: ${data.message}`);
      }
    } catch (err) {
      setLocationMessage('An error occurred while adding location');
    }
  };

  const toggleRouteDisplay = () => {
    setShowRoute(!showRoute);
  };
  
  const toggleDatePicker = () => {
    setDatePickerOpen(!datePickerOpen);
  };

  return (
    <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg rounded-3xl shadow-xl p-6 border border-indigo-100 dark:border-gray-800">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-indigo-700 dark:text-indigo-200">User Location</h3>
        <div className="flex items-center gap-2">
          {/* Date filter button */}
          <div className="relative">
            <button
              onClick={toggleDatePicker}
              className="px-3 py-1.5 bg-indigo-100 dark:bg-indigo-800 text-indigo-700 dark:text-indigo-200 rounded-lg text-sm font-medium hover:bg-indigo-200 dark:hover:bg-indigo-700 transition-colors flex items-center gap-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {filterActive ? 'Change Date' : 'Filter by Date'}
            </button>
            
            {/* Date picker dropdown */}
            {datePickerOpen && (
              <div className="absolute right-0 mt-2 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-10 border border-indigo-100 dark:border-indigo-800 min-w-[260px]">
                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Select Date to View Route
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={handleDateChange}
                    max={getTodayDate()}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white text-sm"
                  />
                </div>
                <div className="flex justify-between">
                  <button
                    onClick={clearDateFilter}
                    className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    Clear Filter
                  </button>
                  <button
                    onClick={toggleDatePicker}
                    className="px-3 py-1 text-xs bg-indigo-100 dark:bg-indigo-800 text-indigo-700 dark:text-indigo-200 rounded hover:bg-indigo-200 dark:hover:bg-indigo-700"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Show/Hide Route button */}
          {(allLocations.length > 1 || filteredLocations.length > 1) && (
            <button
              onClick={toggleRouteDisplay}
              className="px-3 py-1.5 bg-indigo-100 dark:bg-indigo-800 text-indigo-700 dark:text-indigo-200 rounded-lg text-sm font-medium hover:bg-indigo-200 dark:hover:bg-indigo-700 transition-colors"
            >
              {showRoute ? 'Hide Route' : 'Show Route'}
            </button>
          )}
        </div>
      </div>
      
      {/* Date filter indicator */}
      {filterActive && (
        <div className="mb-4 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/40 rounded-lg border border-indigo-100 dark:border-indigo-800 flex justify-between items-center">
          <div>
            <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
              Showing route for: {selectedDate ? new Date(selectedDate).toLocaleDateString(undefined, {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'}) : ''}
            </span>
            {filteredLocations.length === 0 && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                No location data available for this date.
              </p>
            )}
          </div>
          <button
            onClick={clearDateFilter}
            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}
      
      <div className="rounded-2xl overflow-hidden border-2 border-indigo-200 dark:border-indigo-700 shadow-lg mb-6" style={{ height: 400, width: "100%" }}>
        <UserMap
          latitude={location?.latitude}
          longitude={location?.longitude}
          loading={loading}
          routePositions={showRoute ? (filterActive ? filteredLocations : allLocations) : []}
          locationData={showRoute ? (filterActive ? filteredLocationData : locationData) : []}
        />
      </div>
      
      {/* Route information */}
      {showRoute && ((filterActive && filteredLocations.length > 1) || (!filterActive && allLocations.length > 1)) && (
        <div className="mb-6 p-4 bg-indigo-50/80 dark:bg-gray-800/80 rounded-xl shadow border border-indigo-100 dark:border-gray-700">
          <h4 className="text-md font-semibold text-indigo-700 dark:text-indigo-200 mb-2">
            {filterActive ? 'Daily Travel Route' : 'Complete Travel Route'}
          </h4>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Showing travel history with {filterActive ? filteredLocations.length : allLocations.length} location points.
                {filterActive && ' Data filtered by selected date.'}
              </p>
              
              {/* Route legend */}
              <div className="mt-3 flex flex-wrap gap-3">
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-indigo-500 mr-1"></div>
                  <span className="text-xs text-gray-600 dark:text-gray-300">Start</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-indigo-700 mr-1"></div>
                  <span className="text-xs text-gray-600 dark:text-gray-300">Current</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-1 bg-indigo-500 mr-1"></div>
                  <span className="text-xs text-gray-600 dark:text-gray-300">Route</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center px-4 py-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
              <span className="text-xs text-indigo-500 dark:text-indigo-300 font-medium">TOTAL DISTANCE</span>
              <span className="text-lg font-bold text-indigo-700 dark:text-indigo-200">
                {calculateRouteDistance(filterActive ? filteredLocations : allLocations)} km
              </span>
            </div>
          </div>
          
          {/* Time span information */}
          {(filterActive ? filteredLocationData : locationData).length > 0 && (
            <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
              <span className="font-medium">Time span:</span> {
                formatDate((filterActive ? filteredLocationData : locationData)[0]?.timestamp)
              } → {
                formatDate((filterActive ? filteredLocationData : locationData)[(filterActive ? filteredLocationData : locationData).length-1]?.timestamp)
              }
            </div>
          )}
          
          <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
            <span className="font-medium">Note:</span> Click on any marker to see location details and timestamp.
          </div>
        </div>
      )}
      
      {/* Add Location Form */}
      <div className="mt-6 p-4 bg-indigo-50/80 dark:bg-gray-800/80 rounded-xl shadow border border-indigo-100 dark:border-gray-700">
        <h4 className="text-lg font-semibold text-indigo-700 dark:text-indigo-200 mb-3">Add New Location</h4>
        <form onSubmit={e => { e.preventDefault(); handleAddLocation(); }} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Latitude</label>
              <input
                type="number"
                step="any"
                value={lat}
                onChange={e => setLat(e.target.value)}
                placeholder="e.g. 40.7128"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Longitude</label>
              <input
                type="number"
                step="any"
                value={lng}
                onChange={e => setLng(e.target.value)}
                placeholder="e.g. -74.0060"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white font-semibold py-2 px-4 rounded-md shadow transition-colors duration-300"
          >
            Add Location
          </button>
          {addMsg && <div className="mt-3 text-sm text-gray-700 dark:text-gray-300">{addMsg}</div>}
        </form>
        {locationMessage && (
          <div className={`mt-3 p-3 rounded-md shadow ${locationMessage.includes('success') ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'}`}>
            {locationMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export { UserMap, UserLocationSection };
export default UserMap;