const VisitLocation = require('../models/visitLocation');
const Location = require('../models/location');

// Helper function to calculate distance between two points using Haversine formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in kilometers
  return distance;
};

// Function to start tracking distance for a visit
const startVisitTracking = async (visitId, userLocation) => {
  try {
    const visit = await VisitLocation.findById(visitId);
    if (!visit) {
      throw new Error('Visit not found');
    }

    // Set start location
    visit.startLocation = {
      latitude: userLocation.latitude,
      longitude: userLocation.longitude,
      timestamp: new Date()
    };

    // Initialize route points array with starting point
    visit.routePoints = [{
      latitude: userLocation.latitude,
      longitude: userLocation.longitude,
      timestamp: new Date()
    }];

    await visit.save();
    return visit;
  } catch (error) {
    console.error('Error starting visit tracking:', error);
    throw error;
  }
};

// Function to update route during visit
const updateVisitRoute = async (visitId, userLocation) => {
  try {
    const visit = await VisitLocation.findById(visitId);
    if (!visit) {
      throw new Error('Visit not found');
    }

    // Add new point to route
    const newPoint = {
      latitude: userLocation.latitude,
      longitude: userLocation.longitude,
      timestamp: new Date()
    };

    if (!visit.routePoints) {
      visit.routePoints = [];
    }

    visit.routePoints.push(newPoint);

    // Calculate total distance if we have at least 2 points
    if (visit.routePoints.length >= 2) {
      let totalDistance = 0;
      for (let i = 1; i < visit.routePoints.length; i++) {
        const distance = calculateDistance(
          visit.routePoints[i-1].latitude,
          visit.routePoints[i-1].longitude,
          visit.routePoints[i].latitude,
          visit.routePoints[i].longitude
        );
        totalDistance += distance;
      }
      visit.distanceTraveled = Math.round(totalDistance * 100) / 100; // Round to 2 decimal places
    }

    await visit.save();
    return visit;
  } catch (error) {
    console.error('Error updating visit route:', error);
    throw error;
  }
};

// Function to complete visit tracking
const completeVisitTracking = async (visitId, userLocation) => {
  try {
    const visit = await VisitLocation.findById(visitId);
    if (!visit) {
      throw new Error('Visit not found');
    }

    // Set end location
    visit.endLocation = {
      latitude: userLocation.latitude,
      longitude: userLocation.longitude,
      timestamp: new Date()
    };

    // Add final point to route
    if (!visit.routePoints) {
      visit.routePoints = [];
    }

    visit.routePoints.push({
      latitude: userLocation.latitude,
      longitude: userLocation.longitude,
      timestamp: new Date()
    });

    // Calculate final total distance
    if (visit.routePoints.length >= 2) {
      let totalDistance = 0;
      for (let i = 1; i < visit.routePoints.length; i++) {
        const distance = calculateDistance(
          visit.routePoints[i-1].latitude,
          visit.routePoints[i-1].longitude,
          visit.routePoints[i].latitude,
          visit.routePoints[i].longitude
        );
        totalDistance += distance;
      }
      visit.distanceTraveled = Math.round(totalDistance * 100) / 100;
    } else if (visit.startLocation && visit.endLocation) {
      // Fallback: calculate straight-line distance if route points are missing
      const distance = calculateDistance(
        visit.startLocation.latitude,
        visit.startLocation.longitude,
        visit.endLocation.latitude,
        visit.endLocation.longitude
      );
      visit.distanceTraveled = Math.round(distance * 100) / 100;
    }

    // Mark visit as completed
    visit.visitStatus = 'completed';
    visit.visitDate = new Date();
    visit.updatedAt = new Date();

    await visit.save();
    return visit;
  } catch (error) {
    console.error('Error completing visit tracking:', error);
    throw error;
  }
};

// Function to automatically track user movement and update active visits
const trackUserMovement = async (userId, userLocation) => {
  try {
    // Find active visits for this user
    const activeVisits = await VisitLocation.find({
      userId: userId,
      visitStatus: 'pending',
      startLocation: { $exists: true, $ne: null }
    });

    // Update route for all active visits
    for (const visit of activeVisits) {
      await updateVisitRoute(visit._id, userLocation);
    }

    return activeVisits.length;
  } catch (error) {
    console.error('Error tracking user movement:', error);
    throw error;
  }
};

// Function to get distance summary for a user in a date range
const getUserDistanceSummary = async (userId, startDate, endDate) => {
  try {
    const visits = await VisitLocation.find({
      userId: userId,
      visitStatus: 'completed',
      visitDate: {
        $gte: startDate,
        $lte: endDate
      }
    });

    const summary = {
      totalVisits: visits.length,
      totalDistance: 0,
      averageDistance: 0,
      visitDetails: []
    };

    visits.forEach(visit => {
      const distance = visit.distanceTraveled || 0;
      summary.totalDistance += distance;
      summary.visitDetails.push({
        id: visit._id,
        address: visit.address,
        visitDate: visit.visitDate,
        distance: distance,
        routePoints: visit.routePoints ? visit.routePoints.length : 0
      });
    });

    summary.totalDistance = Math.round(summary.totalDistance * 100) / 100;
    summary.averageDistance = visits.length > 0 ? 
      Math.round((summary.totalDistance / visits.length) * 100) / 100 : 0;

    return summary;
  } catch (error) {
    console.error('Error getting user distance summary:', error);
    throw error;
  }
};

module.exports = {
  calculateDistance,
  startVisitTracking,
  updateVisitRoute,
  completeVisitTracking,
  trackUserMovement,
  getUserDistanceSummary
};