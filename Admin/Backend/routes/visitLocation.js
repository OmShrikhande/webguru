const express = require('express');
const router = express.Router();
const VisitLocation = require('../models/visitLocation');

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
router.put('/visit-location/:id', async (req, res) => {
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

// Serve image buffer by index
router.get('/visit-location/:id/image/:imgIdx', async (req, res) => {
  try {
    const { id, imgIdx } = req.params;
    const visitLocation = await VisitLocation.findById(id);
    if (!visitLocation || !visitLocation.images[imgIdx]) return res.status(404).send('Not found');
    const img = visitLocation.images[imgIdx];
    res.set('Content-Type', img.contentType);
    res.send(img.data);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;