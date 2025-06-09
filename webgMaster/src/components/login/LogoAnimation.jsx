import React from 'react';
import { Box, Typography, alpha } from '@mui/material';
import { motion } from 'framer-motion';

const LogoAnimation = () => {
  // Logo variants for animation
  const logoVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
        when: 'beforeChildren',
        staggerChildren: 0.2,
      },
    },
  };

  const lineVariants = {
    hidden: { width: 0 },
    visible: {
      width: '100%',
      transition: {
        duration: 0.8,
        ease: 'easeInOut',
      },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  const glowEffectVariants = {
    initial: { opacity: 0.5 },
    animate: {
      opacity: [0.5, 0.8, 0.5],
      transition: {
        duration: 3,
        ease: 'easeInOut',
        repeat: Infinity,
      },
    },
  };

  const orbitVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 15,
        ease: 'linear',
        repeat: Infinity,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={logoVariants}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mb: 5,
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: 120,
            height: 120,
            mb: 2,
          }}
        >
          {/* Main logo circle */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              duration: 0.6,
              ease: 'easeOut',
              delay: 0.2,
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'radial-gradient(circle, #1e88e5 0%, #0d47a1 100%)',
                boxShadow: `0 0 30px ${alpha('#1e88e5', 0.8)}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 2,
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 900,
                  color: '#fff',
                  textShadow: '0 0 10px rgba(255, 255, 255, 0.7)',
                }}
              >
                W
              </Typography>
            </Box>
          </motion.div>

          {/* Orbiting element */}
          <motion.div
            variants={orbitVariants}
            animate="animate"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: '50%',
                width: 20,
                height: 20,
                borderRadius: '50%',
                backgroundColor: '#42a5f5',
                boxShadow: `0 0 15px ${alpha('#42a5f5', 0.8)}`,
                transform: 'translateX(-50%)',
              }}
            />
          </motion.div>

          {/* Outer ring */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 120,
                height: 120,
                borderRadius: '50%',
                border: `2px solid ${alpha('#90caf9', 0.6)}`,
                boxShadow: `0 0 15px ${alpha('#90caf9', 0.3)}`,
              }}
            />
          </motion.div>

          {/* Glow effect */}
          <motion.div
            variants={glowEffectVariants}
            initial="initial"
            animate="animate"
          >
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 100,
                height: 100,
                borderRadius: '50%',
                boxShadow: `0 0 50px ${alpha('#1e88e5', 0.6)}`,
                zIndex: 1,
              }}
            />
          </motion.div>
        </Box>

        {/* Logo text */}
        <motion.div variants={textVariants}>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 800,
              letterSpacing: 1,
              textAlign: 'center',
              background: 'linear-gradient(to right, #fff, #90caf9)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1,
            }}
          >
            WebGuru
          </Typography>
        </motion.div>

        {/* Horizontal line */}
        <motion.div
          variants={lineVariants}
          style={{
            height: '2px',
            background: 'linear-gradient(to right, transparent, #42a5f5, transparent)',
            marginBottom: '8px',
            width: '180px',
          }}
        />

        <motion.div variants={textVariants}>
          <Typography
            variant="subtitle1"
            sx={{
              color: alpha('#fff', 0.8),
              textAlign: 'center',
              fontWeight: 400,
              letterSpacing: 0.5,
            }}
          >
            Master Your Application
          </Typography>
        </motion.div>
      </Box>
    </motion.div>
  );
};

export default LogoAnimation;