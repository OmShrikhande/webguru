import React, { useEffect, useRef } from 'react';
import { Box } from '@mui/material';

const ParticlesBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Create particle class
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 5 + 1;
        this.baseSize = this.size;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 - 1.5;
        this.color = `rgba(${Math.floor(Math.random() * 100 + 155)}, ${Math.floor(Math.random() * 100 + 155)}, ${Math.floor(Math.random() * 100 + 155)}, ${Math.random() * 0.5 + 0.3})`;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Edge detection
        if (this.x > canvas.width || this.x < 0) {
          this.speedX = -this.speedX;
        }

        if (this.y > canvas.height || this.y < 0) {
          this.speedY = -this.speedY;
        }

        // Pulsing effect
        this.size = this.baseSize + Math.sin(Date.now() * 0.005) * 2;
      }

      draw() {
        if (this.size <= 0) return; // Prevent negative or zero radius
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;
        ctx.fill();
      }
    }

    // Create wave class for flowing background
    class Wave {
      constructor(yPos, amplitude) {
        this.yPos = yPos;
        this.amplitude = amplitude;
        this.frequency = 0.01;
        this.speed = 0.05;
        this.time = 0;
        this.color = `rgba(30, 136, 229, ${Math.random() * 0.2 + 0.1})`;
      }

      update() {
        this.time += this.speed;
      }

      draw(ctx) {
        ctx.beginPath();
        ctx.moveTo(0, this.yPos);
        for (let i = 0; i < ctx.canvas.width; i++) {
          const y = this.yPos + Math.sin(i * this.frequency + this.time) * this.amplitude;
          ctx.lineTo(i, y);
        }
        ctx.lineTo(ctx.canvas.width, ctx.canvas.height);
        ctx.lineTo(0, ctx.canvas.height);
        ctx.closePath();

        const gradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
        gradient.addColorStop(0, 'rgba(30, 136, 229, 0)');
        gradient.addColorStop(0.5, this.color);
        gradient.addColorStop(1, 'rgba(10, 25, 41, 0.5)');

        ctx.fillStyle = gradient;
        ctx.fill();
      }
    }

    // Create grid line effect
    const drawGrid = () => {
      const gridSize = 30;
      ctx.strokeStyle = 'rgba(100, 180, 255, 0.08)';
      ctx.lineWidth = 0.5;

      // Draw vertical lines
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // Draw horizontal lines
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    };

    // Create glowing circles effect
    const drawGlowingCircles = () => {
      const time = Date.now() * 0.001;

      // Large circle in the bottom left
      ctx.beginPath();
      const radius1 = 100 + Math.sin(time * 0.5) * 20;
      ctx.arc(100, canvas.height - 100, radius1, 0, Math.PI * 2);
      const gradient1 = ctx.createRadialGradient(100, canvas.height - 100, 0, 100, canvas.height - 100, radius1);
      gradient1.addColorStop(0, 'rgba(30, 136, 229, 0.2)');
      gradient1.addColorStop(1, 'rgba(30, 136, 229, 0)');
      ctx.fillStyle = gradient1;
      ctx.fill();

      // Medium circle in the top right
      ctx.beginPath();
      const radius2 = 150 + Math.sin(time * 0.7) * 30;
      ctx.arc(canvas.width - 150, 150, radius2, 0, Math.PI * 2);
      const gradient2 = ctx.createRadialGradient(canvas.width - 150, 150, 0, canvas.width - 150, 150, radius2);
      gradient2.addColorStop(0, 'rgba(123, 31, 162, 0.15)');
      gradient2.addColorStop(1, 'rgba(123, 31, 162, 0)');
      ctx.fillStyle = gradient2;
      ctx.fill();

      // Small circle in the center
      ctx.beginPath();
      const radius3 = 70 + Math.sin(time * 0.9) * 15;
      ctx.arc(canvas.width / 2, canvas.height / 2, radius3, 0, Math.PI * 2);
      const gradient3 = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, radius3);
      gradient3.addColorStop(0, 'rgba(0, 150, 136, 0.1)');
      gradient3.addColorStop(1, 'rgba(0, 150, 136, 0)');
      ctx.fillStyle = gradient3;
      ctx.fill();
    };

    // Create particles
    const particlesArray = [];
    const createParticles = () => {
      particlesArray.length = 0; // Clear the array before adding new particles
      const numberOfParticles = Math.min(Math.floor(canvas.width * canvas.height / 20000), 100);
      for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
      }
    };

    // Create waves
    const wavesArray = [];
    const createWaves = () => {
      wavesArray.length = 0; // Clear the array before adding new waves
      const numberOfWaves = 3;
      for (let i = 0; i < numberOfWaves; i++) {
        const yPos = canvas.height * (0.3 + i * 0.2);
        const amplitude = 20 + i * 10;
        wavesArray.push(new Wave(yPos, amplitude));
      }
    };

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      createParticles();
      createWaves();
    };

    setCanvasDimensions();
    window.addEventListener('resize', setCanvasDimensions);

    // Initialize particles and waves
    createParticles();
    createWaves();

    // Animation loop
    const animate = () => {
      // Clear canvas with semi-transparent background for trail effect
      ctx.fillStyle = 'rgba(10, 25, 41, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw background gradient
      const bgGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      bgGradient.addColorStop(0, 'rgba(10, 25, 41, 1)');
      bgGradient.addColorStop(1, 'rgba(25, 42, 86, 1)');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid
      drawGrid();

      // Draw glowing circles
      drawGlowingCircles();

      // Update and draw waves
      for (let i = 0; i < wavesArray.length; i++) {
        wavesArray[i].update();
        wavesArray[i].draw(ctx);
      }

      // Update and draw particles
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
      }

      // Connect particles with lines
      connectParticles();

      // Request next animation frame
      animationFrameId = requestAnimationFrame(animate);
    };

    // Function to draw lines between nearby particles
    const connectParticles = () => {
      const maxDistance = 150;
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
          const dx = particlesArray[a].x - particlesArray[b].x;
          const dy = particlesArray[a].y - particlesArray[b].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDistance) {
            const opacity = 1 - distance / maxDistance;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(100, 180, 255, ${opacity * 0.2})`;
            ctx.lineWidth = 1;
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
            ctx.stroke();
          }
        }
      }
    };

    // Start animation
    animate();

    // Cleanup function
    return () => {
      window.removeEventListener('resize', setCanvasDimensions);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
        pointerEvents: 'none', // Allow clicking through the canvas
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
        }}
      />
    </Box>
  );
};

export default ParticlesBackground;