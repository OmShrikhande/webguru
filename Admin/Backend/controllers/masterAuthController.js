const Master = require('../models/Master');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Creating nodemailer transporter for sending OTP emails
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Logging environment variables for debugging email configuration
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '***' : 'NOT SET');

// Generating a 6-digit OTP with leading zeros
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString().padStart(6, '0');
};

// Sending OTP to email
exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // Validating email input
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email'
      });
    }

    // Checking if email is already registered and active
    const existingMaster = await Master.findOne({ email });
    if (existingMaster && existingMaster.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Generating OTP and setting expiration
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Updating existing master or creating a new temporary master
    if (existingMaster) {
      existingMaster.otp = otp;
      existingMaster.otpExpires = otpExpires;
      await existingMaster.save();
      console.log('Updated OTP for existing master:', { email, otp });
    } else {
      const newMaster = new Master({
        email,
        otp,
        otpExpires,
        isActive: false // Temporary record until registration is complete
      });
      await newMaster.save();
      console.log('Created temporary master with OTP:', { email, otp });
    }

    // Sending OTP email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is: ${otp}. It is valid for 15 minutes.`
    });

    res.status(200).json({
      success: true,
      message: 'OTP sent to email'
    });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send OTP'
    });
  }
};

// Verifying OTP
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Validating email and OTP input
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and OTP'
      });
    }

    // Checking OTP length
    if (!otp || otp.length !== 6) {
      return res.status(400).json({
        success: false,
        message: 'OTP must be 6 digits'
      });
    }

    // Logging OTP verification attempt
    console.log('Verifying OTP for:', { email, otp });

    // Checking if OTP is valid and not expired
    const master = await Master.findOne({
      email,
      otp,
      otpExpires: { $gt: Date.now() }
    });

    // Logging master document found (or not)
    console.log('Master found:', master ? master : 'No matching master');

    if (!master) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP'
      });
    }

    res.status(200).json({
      success: true,
      message: 'OTP verified successfully'
    });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify OTP',
      error: error.message
    });
  }
};

// Registering master with OTP verification
exports.registerMaster = async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body;

    // Validating required fields
    if (!email || !password || !firstName || !lastName || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Checking if master exists and OTP is verified
    const master = await Master.findOne({ email });
    if (!master) {
      return res.status(400).json({
        success: false,
        message: 'Email not verified. Please request OTP first'
      });
    }

    // Logging registration attempt
    console.log('Registering master for:', { email, firstName, lastName });

    // Hashing password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Updating master with registration details
    master.password = hashedPassword;
    master.firstName = firstName;
    master.lastName = lastName;
    master.phone = phone;
    master.username = email.split('@')[0];
    master.isActive = true;
    master.otp = undefined;
    master.otpExpires = undefined;

    await master.save();

    // Logging successful registration
    console.log('Master registered:', master.email);

    res.status(201).json({
      success: true,
      message: 'Master registered successfully',
      master: {
        id: master._id,
        email: master.email,
        firstName: master.firstName,
        lastName: master.lastName
      }
    });
  } catch (error) {
    console.error('Error registering master:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to register master',
      error: error.message
    });
  }
};