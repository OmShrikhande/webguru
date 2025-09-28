const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { sendAlert, getAlerts } = require('../controllers/alertController');

router.post('/alerts', protect, sendAlert);
router.get('/alerts', protect, getAlerts);

module.exports = router;