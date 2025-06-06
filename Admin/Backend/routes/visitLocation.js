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

module.exports = router;