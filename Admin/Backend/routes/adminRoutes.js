
const express = require('express');
const router = express.Router();
const { loginAdmin, registerAdmin, sendOTP, resetPassword } = require('../controllers/adminController');

router.post('/request-otp', sendOTP);
router.post('/reset-password', resetPassword);

router.post('/login', loginAdmin);
router.post('/register', registerAdmin);

module.exports = router;
