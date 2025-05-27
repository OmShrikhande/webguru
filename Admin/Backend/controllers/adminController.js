

const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

exports.registerAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({ email, password: hashedPassword });
    await newAdmin.save();
    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.toLowerCase().trim();
    console.log("Login attempt:", normalizedEmail);

    const admin = await Admin.findOne({ email: normalizedEmail });
    console.log("Admin found:", admin);

    if (!admin) return res.status(400).json({ message: 'Invalid credentials (email not found)' });

    const isMatch = await bcrypt.compare(password, admin.password);
    console.log("Password match result:", isMatch);

    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials (wrong password)' });

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, admin: { id: admin._id, email: admin.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });

    console.log("Reset request:", { email, otp, newPassword });
    console.log("Admin from DB:", admin);

    if (!admin) {
      console.log("Admin not found for email:", email);
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }
    if (admin.otp !== otp) {
      console.log("OTP does not match. Provided:", otp, "Expected:", admin.otp);
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }
    if (admin.otpExpires < Date.now()) {
      console.log("OTP expired at:", admin.otpExpires, "Current time:", Date.now());
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    admin.password = await bcrypt.hash(newPassword, 10);
    admin.otp = undefined;
    admin.otpExpires = undefined;
    await admin.save();

    res.json({ message: 'Password reset successful' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const normalizedEmail = email.toLowerCase().trim();
    const admin = await Admin.findOne({ email: normalizedEmail });
    if (!admin) return res.status(400).json({ message: 'Email not found' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    admin.otp = otp;
    admin.otpExpires = otpExpires;
    await admin.save();

    // Send email with hardcoded credentials
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'kdkuldeeptiwari26@gmail.com',           // ✅ Your full Gmail address
        pass: 'rnuo mvur mpkh ohog'     // ✅ Your app password (not normal Gmail password)
      }
    });

    await transporter.sendMail({
      from: `"Kudeep Projects" <kdkuldeeptiwari26@gmail.com>`,
      to: admin.email,
      subject: "Your OTP for Password Reset",
      text: `Your OTP is: ${otp}`
    });

    res.json({ message: 'OTP sent to email' });
  } catch (err) {
    console.error('❌ Error in sendOTP:', err);
    res.status(500).json({ error: err.message });
  }
};
