import React from 'react';
import { Box, Card, CardContent, Typography, Avatar, alpha } from '@mui/material';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon, color, description, trendValue, trendDirection }) => {
  return (
    <Card
      component={motion.div}
      whileHover={{ translateY: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      sx={{
        backgroundColor: 'rgba(25, 35, 60, 0.7)',
        borderRadius: 3,
        height: '100%',
        border: '1px solid',
        borderColor: alpha(color, 0.15),
        backdropFilter: 'blur(10px)',
        boxShadow: `0 10px 15px -3px ${alpha(color, 0.1)}, 0 4px 6px -2px ${alpha(color, 0.05)}`,
        overflow: 'visible',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: `linear-gradient(90deg, ${alpha(color, 0.5)}, ${alpha(color, 0.8)})`,
          borderRadius: '4px 4px 0 0',
        }
      }}
    >
      <CardContent sx={{ p: 3, position: 'relative' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5, fontSize: '0.75rem' }}>
            {title}
          </Typography>
          <Avatar 
            sx={{ 
              bgcolor: alpha(color, 0.15), 
              width: 40, 
              height: 40,
              color: color,
              boxShadow: `0 0 0 4px ${alpha(color, 0.1)}`
            }}
          >
            {icon}
          </Avatar>
        </Box>
        
        <Typography variant="h4" sx={{ 
          fontWeight: 700, 
          mb: 0.5, 
          color: '#fff',
          background: `linear-gradient(90deg, rgba(255, 255, 255, 0.9), ${alpha(color, 0.9)})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          {value}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
          <Box 
            component={motion.div}
            animate={{ y: [0, -3, 0], opacity: [0.8, 1, 0.8] }}
            transition={{ repeat: Infinity, duration: 2 }}
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              p: '4px 8px', 
              borderRadius: 1, 
              mr: 1,
              bgcolor: trendDirection === 'up' 
                ? alpha('#4caf50', 0.15) 
                : trendDirection === 'down' 
                  ? alpha('#f44336', 0.15) 
                  : 'transparent',
              color: trendDirection === 'up' 
                ? '#4caf50' 
                : trendDirection === 'down' 
                  ? '#f44336' 
                  : 'inherit',
            }}
          >
            {trendDirection === 'up' && (
              <Box component="span" sx={{ fontSize: '1rem', mr: 0.5 }}>↑</Box>
            )}
            {trendDirection === 'down' && (
              <Box component="span" sx={{ fontSize: '1rem', mr: 0.5 }}>↓</Box>
            )}
            <Typography variant="caption" sx={{ fontWeight: 600 }}>
              {trendValue}
            </Typography>
          </Box>
          
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)', fontWeight: 400 }}>
            {description}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatCard;