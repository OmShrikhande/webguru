import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showForgot, setShowForgot] = useState(false);
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();

  const loginHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/admin/login', { email, password });
      localStorage.setItem('token', res.data.token);
      toast.success('Login successful!');
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
  };

  const requestOtpHandler = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/admin/request-otp', { email });
      toast.info('OTP sent to your email.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error sending OTP');
    }
  };

  const resetPasswordHandler = async (e) => {
    e.preventDefault();
    if (!email.trim() || !otp.trim() || !newPassword.trim()) {
      toast.warn('Please fill all fields correctly.');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/admin/reset-password', {
        email: email.trim(),
        otp: otp.trim(),
        newPassword: newPassword.trim(),
      });
      toast.success('Password reset successful. Please login.');
      setShowForgot(false);
      setShowOtpInput(false);
      setOtp('');
      setNewPassword('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error resetting password');
    }
  };

  return (
    <div className="login-container">
      <ToastContainer position="top-center" />
      <div className="login-card">
        <img src="./../../public/logo192.png" alt="App Logo" className="login-logo" />
        <h2>{!showForgot ? 'Admin Login' : 'Reset Password'}</h2>
        {!showForgot ? (
          <>
            <form onSubmit={loginHandler}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button type="submit">Login</button>
            </form>
            <p className="link-btn" onClick={() => setShowForgot(true)}>Forgot Password?</p>
            <p className="link-btn" onClick={() => navigate('/register')}>New here? Register</p>
          </>
        ) : (
          <>
            <form onSubmit={showOtpInput ? resetPasswordHandler : requestOtpHandler}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              {showOtpInput && (
                <>
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={e => setOtp(e.target.value)}
                    required
                  />
                  <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    required
                  />
                </>
              )}
              <button type="submit">{showOtpInput ? 'Reset Password' : 'Send OTP'}</button>
            </form>
            {!showOtpInput && (
              <p className="link-btn" onClick={() => setShowOtpInput(true)}>I have the OTP</p>
            )}
            <p className="link-btn" onClick={() => {
              setShowForgot(false);
              setShowOtpInput(false);
              setOtp('');
              setNewPassword('');
            }}>Back to Login</p>
            <p className="link-btn" onClick={() => navigate('/register')}>New here? Register</p>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
