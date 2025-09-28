const express = require('express');
const router = express.Router();
const VisitLocation = require('../models/visitLocation');
const { protect } = require('../middleware/auth');
const { 
  startVisitTracking, 
  completeVisitTracking, 
  getUserDistanceSummary 
} = require('../utils/distanceTracker');

// CREATE
router.post('/visit-location', async (req, res) => {
  try {
    const visitLocation = new VisitLocation(req.body);
    await visitLocation.save();
    res.json(visitLocation);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ (all)
router.get('/visit-location', async (req, res) => {
  const locations = await VisitLocation.find();
  res.json(locations);
});

// UPDATE
router.put('/visit-location/:_id', async (req, res) => {
  try {
    const updated = await VisitLocation.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE
router.delete('/visit-location/:id', async (req, res) => {
  try {
    await VisitLocation.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET image by task ID and image index
router.get('/visit-location/:id/image/:index', async (req, res) => {
  const { id, index } = req.params;
  // Fetch the visit location by id
  const visit = await VisitLocation.findById(id);
  if (!visit || !visit.images || !visit.images[index]) {
    return res.status(404).send('Image not found');
  }
  const image = visit.images[index];
  res.set('Content-Type', image.mimetype || 'image/jpeg'); // set correct type
  res.send(image.data); // or image.data if already a Buffer
});

// Start visit tracking
router.post('/visit-location/:id/start', protect, async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    
    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      return res.status(400).json({
        success: false,
        message: 'Valid latitude and longitude are required'
      });
    }

    const visit = await startVisitTracking(req.params.id, { latitude, longitude });
    
    res.status(200).json({
      success: true,
      message: 'Visit tracking started successfully',
      visit: {
        id: visit._id,
        startLocation: visit.startLocation,
        distanceTraveled: visit.distanceTraveled
      }
    });
  } catch (err) {
    console.error('Error starting visit tracking:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to start visit tracking',
      error: err.message
    });
  }
});

// Complete visit tracking
router.post('/visit-location/:id/complete', protect, async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    
    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      return res.status(400).json({
        success: false,
        message: 'Valid latitude and longitude are required'
      });
    }

    const visit = await completeVisitTracking(req.params.id, { latitude, longitude });
    
    res.status(200).json({
      success: true,
      message: 'Visit completed successfully',
      visit: {
        id: visit._id,
        startLocation: visit.startLocation,
        endLocation: visit.endLocation,
        distanceTraveled: visit.distanceTraveled,
        visitStatus: visit.visitStatus,
        visitDate: visit.visitDate
      }
    });
  } catch (err) {
    console.error('Error completing visit tracking:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to complete visit tracking',
      error: err.message
    });
  }
});

// Get user distance summary
router.get('/visit-location/user/:userId/distance-summary', protect, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const start = startDate ? new Date(startDate) : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const end = endDate ? new Date(endDate) : new Date();
    
    const summary = await getUserDistanceSummary(req.params.userId, start, end);
    
    res.status(200).json({
      success: true,
      summary,
      period: {
        startDate: start.toISOString().split('T')[0],
        endDate: end.toISOString().split('T')[0]
      }
    });
  } catch (err) {
    console.error('Error getting distance summary:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to get distance summary',
      error: err.message
    });
  }
});

module.exports = router;