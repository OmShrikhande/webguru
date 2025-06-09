import React from 'react';
import { Card, CardContent, CardHeader, Typography, Box, IconButton, Divider, alpha } from '@mui/material';
import { MoreVert as MoreVertIcon } from '@mui/icons-material';

// Note: In a real application, you would use a proper map library like Leaflet, Google Maps, or Mapbox
// This is a placeholder component for demonstration purposes
const UserLocationMap = ({ userLocations }) => {
  return (
    <Card sx={{
      backgroundColor: 'rgba(25, 35, 60, 0.7)',
      borderRadius: 3,
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(100, 180, 255, 0.1)',
      height: '100%',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    }}>
      <CardHeader
        title={
          <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600 }}>
            User Locations
          </Typography>
        }
        action={
          <IconButton aria-label="settings" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            <MoreVertIcon />
          </IconButton>
        }
        sx={{ pb: 1 }}
      />
      <Divider sx={{ opacity: 0.1 }} />
      <CardContent sx={{ p: 2, position: 'relative', height: 'calc(100% - 72px)' }}>
        <Box 
          sx={{
            width: '100%',
            height: '100%',
            minHeight: '300px',
            backgroundColor: alpha('#0a1929', 0.5),
            borderRadius: 2,
            border: '1px solid rgba(100, 180, 255, 0.15)',
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='rgba(30, 136, 229, 0.1)' fill-rule='evenodd'/%3E%3C/svg%3E")`,
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(circle at center, rgba(30, 136, 229, 0.1) 0%, transparent 70%)',
              zIndex: 1
            }
          }}
        >
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', textAlign: 'center', zIndex: 2, maxWidth: '300px' }}>
            This is a placeholder for a map displaying user locations. In a real application, integrate a map library like Leaflet, Google Maps, or Mapbox.
          </Typography>
          
          {/* User location markers would be rendered here */}
          {userLocations && userLocations.map((location, index) => (
            <Box
              key={index}
              sx={{
                position: 'absolute',
                top: `${location.y}%`,
                left: `${location.x}%`,
                width: 20,
                height: 20,
                backgroundColor: location.online ? '#4caf50' : '#9e9e9e',
                borderRadius: '50%',
                boxShadow: `0 0 0 4px ${alpha(location.online ? '#4caf50' : '#9e9e9e', 0.2)}, 0 0 0 8px ${alpha(location.online ? '#4caf50' : '#9e9e9e', 0.1)}`,
                zIndex: 3,
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '70%',
                  height: '70%',
                  borderRadius: '50%',
                  backgroundColor: '#fff',
                  opacity: 0.8
                },
                '&:hover': {
                  cursor: 'pointer',
                  transform: 'scale(1.2)',
                  transition: 'transform 0.2s'
                }
              }}
            />
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default UserLocationMap;