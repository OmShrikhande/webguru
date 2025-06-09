import React from 'react';
import { 
  Box, 
  Card, 
  CardHeader, 
  CardContent, 
  Typography, 
  Avatar, 
  IconButton,
  Divider,
  alpha
} from '@mui/material';
import { MoreVert as MoreVertIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';

const timelineItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.4
    }
  })
};

const ActivityTimeline = ({ activities }) => {
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
            Recent Activities
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
      <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
        <Box sx={{ p: 2 }}>
          {activities.map((activity, index) => (
            <motion.div
              key={index}
              custom={index}
              initial="hidden"
              animate="visible"
              variants={timelineItemVariants}
            >
              <Box sx={{ 
                display: 'flex', 
                mb: index !== activities.length - 1 ? 3 : 0,
                position: 'relative',
                '&::before': index !== activities.length - 1 ? {
                  content: '""',
                  position: 'absolute',
                  left: '20px',
                  top: '40px',
                  bottom: '-20px',
                  width: '1px',
                  backgroundColor: alpha(activity.color || '#42a5f5', 0.3),
                } : {}
              }}>
                <Avatar 
                  sx={{ 
                    bgcolor: alpha(activity.color || '#42a5f5', 0.15), 
                    color: activity.color || '#42a5f5',
                    width: 40,
                    height: 40,
                    mr: 2,
                    boxShadow: `0 0 0 3px ${alpha(activity.color || '#42a5f5', 0.1)}`
                  }}
                >
                  {activity.icon}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#fff', mb: 0.5 }}>
                      {activity.title}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                      {activity.time}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 0.5 }}>
                    {activity.description}
                  </Typography>
                  {activity.location && (
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      mt: 1, 
                      p: '4px 8px', 
                      borderRadius: 1,
                      backgroundColor: alpha('#1e88e5', 0.1),
                      width: 'fit-content'
                    }}>
                      <Typography variant="caption" sx={{ color: alpha('#90caf9', 0.9), fontWeight: 500 }}>
                        📍 {activity.location}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            </motion.div>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default ActivityTimeline;