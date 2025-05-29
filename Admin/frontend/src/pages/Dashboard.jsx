import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Login from './Login';  
import { useNavigate } from 'react-router-dom';
import UserData from '../components/dashboard/userdata';
import AnimatedParticlesBackground from '../components/dashboard/AnimatedParticlesBackground';

const Dashboard = () => {
  const [authorized, setAuthorized] = useState(true); // security flag
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    address: '',
    joiningDate: '',
    is_active: true,
    department: '',
    adhar: '',
    pan: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  // Run on mount
  // useEffect(() => {
  //   const token = localStorage.getItem('token');
  //   if (!token) {
  //     navigate('/'); // Not logged in
  //     return;
  //   }

  //   // Set authorized and fetch users
  //   setAuthorized(true);
  //   fetchUsers(token);
  // }, []);

  // Fetch all users
  const fetchUsers = async (token) => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data.users);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to fetch users');
      localStorage.removeItem('token'); // Logout user on failure
      navigate('/Login');
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/admin/users', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('User added successfully');
      setFormData({
        name: '',
        email: '',
        mobile: '',
        address: '',
        joiningDate: '',
        is_active: true,
        department: '',
        adhar: '',
        pan: ''
      });
      setShowForm(false);
      fetchUsers(token);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add user');
      setLoading(false);
      console.error('Error adding user:', err);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    let animationId;
    const particles = [];
    const PARTICLE_COUNT = 60;
    const MAX_DISTANCE = 140;
    const mouse = { x: null, y: null };

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    }

    window.addEventListener('resize', resize);

    // Particle class
    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.radius = 2 + Math.random() * 2.5;
        this.color = `rgba(129,140,248,${0.5 + Math.random() * 0.5})`;
        this.vx = (Math.random() - 0.5) * 1.2;
        this.vy = (Math.random() - 0.5) * 1.2;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowColor = "#6366f1";
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off edges
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }
    }

    // Initialize particles
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new Particle());
    }

    // Mouse interaction
    canvas.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });
    canvas.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    function drawLines() {
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        for (let j = i + 1; j < PARTICLE_COUNT; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DISTANCE) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(99,102,241,${1 - dist / MAX_DISTANCE})`;
            ctx.lineWidth = 1.2;
            ctx.stroke();
          }
        }
        // Draw line to mouse if close
        if (mouse.x !== null && mouse.y !== null) {
          const dx = particles[i].x - mouse.x;
          const dy = particles[i].y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DISTANCE) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(236,72,153,${1 - dist / MAX_DISTANCE})`;
            ctx.lineWidth = 1.5;
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);
      for (let p of particles) {
        p.update();
        p.draw();
      }
      drawLines();
      animationId = requestAnimationFrame(animate);
    }

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  // 🔐 If not authorized, render nothing (or a loader)
  if (!authorized) return null;

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gray-900">
      {/* Animated SVG background */}
      <svg
        className="absolute inset-0 w-full h-full z-0 pointer-events-none"
        style={{ opacity: 0.18 }}
      >
        <circle cx="20%" cy="30%" r="120" fill="#6366f1">
          <animate attributeName="cx" values="20%;80%;20%" dur="10s" repeatCount="indefinite" />
        </circle>
        <circle cx="80%" cy="70%" r="90" fill="#818cf8">
          <animate attributeName="cy" values="70%;20%;70%" dur="12s" repeatCount="indefinite" />
        </circle>
        <circle cx="50%" cy="50%" r="200" fill="#312e81">
          <animate attributeName="r" values="200;250;200" dur="8s" repeatCount="indefinite" />
        </circle>
      </svg>

      {/* Advanced Animated Canvas background */}
      <AnimatedParticlesBackground />

      {/* Main content */}
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-6 px-8 pt-8">
          <h2 className="text-3xl font-bold text-indigo-100">Admin Dashboard</h2>
          <button
            onClick={() => navigate('/adduser')}
            className="bg-indigo-700 hover:bg-indigo-800 text-white font-bold py-2 px-6 rounded-lg shadow transition-all duration-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50"
          >
            Add User
          </button>
        </div>
        <div className="px-8 pb-8">
          <UserData />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
