import React, { useState } from 'react';
import { 
  Box, 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Divider, 
  Typography, 
  IconButton,
  useTheme,
  Avatar,
  Tooltip,
  Badge
} from '@mui/material';
import { 
  Dashboard as DashboardIcon, 
  People as PeopleIcon, 
  AdminPanelSettings as AdminIcon, 
  Analytics as AnalyticsIcon, 
  LocationOn as LocationIcon, 
  CalendarMonth as CalendarIcon, 
  Settings as SettingsIcon, 
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Notifications as NotificationsIcon,
  Bolt as BoltIcon,
  SupervisorAccount as SupervisorAccountIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

// Styled components
const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

const LogoContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2),
  marginBottom: theme.spacing(1),
}));

const AnimatedListItem = motion.create(ListItemButton);

const Sidebar = ({ open, handleDrawerClose }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'User Management', icon: <PeopleIcon />, path: '/dashboard/userdata' },
    { text: 'Admin Controls', icon: <AdminIcon />, path: '/dashboard/admin' },
    { text: 'Analytics', icon: <AnalyticsIcon />, path: '/dashboard/analytics' },
    { text: 'Attendance', icon: <CalendarIcon />, path: '/dashboard/attendance' },
  ];

  const secondaryMenuItems = [
    { text: 'Settings', icon: <SettingsIcon />, path: '/dashboard/settings' },
  ];

  return (
    <Drawer
      sx={{
        width: 280,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 280,
          boxSizing: 'border-box',
          backgroundColor: 'rgba(15, 20, 40, 0.95)',
          backgroundImage: 'linear-gradient(135deg, rgba(20, 30, 70, 0.9) 0%, rgba(10, 15, 35, 0.95) 100%)',
          color: '#fff',
          borderRight: '1px solid rgba(100, 180, 255, 0.1)',
          boxShadow: '0 0 20px rgba(0, 150, 255, 0.1)',
        },
      }}
      variant="persistent"
      anchor="left"
      open={open}
    >
      <DrawerHeader>
        <IconButton onClick={handleDrawerClose} sx={{ color: 'rgba(100, 200, 255, 0.8)' }}>
          {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </DrawerHeader>
      
      <LogoContainer>
        <Box 
          component={motion.div} 
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          sx={{ mr: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <BoltIcon sx={{ fontSize: 28, color: '#4fc3f7' }} />
        </Box>
        <Typography variant="h6" component="div" sx={{ 
          fontWeight: 700, 
          background: 'linear-gradient(90deg, #64b5f6, #4fc3f7, #29b6f6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          WEBGURU MASTER
        </Typography>
      </LogoContainer>
      
      <Divider sx={{ backgroundColor: 'rgba(100, 180, 255, 0.1)' }}/>
      
      <Box sx={{ px: 1, py: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', px: 2, mb: 2 }}>
          <Avatar sx={{ width: 40, height: 40, bgcolor: '#1e88e5', mr: 2 }}>
            {user?.name?.charAt(0) || 'U'}
          </Avatar>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#e3f2fd' }}>
              {user?.name || 'User'}
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
              {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1) || 'User'}
            </Typography>
          </Box>
          <Box sx={{ ml: 'auto' }}>
            <Tooltip title="Notifications">
              <IconButton size="small" sx={{ color: '#90caf9' }}>
                <Badge badgeContent={3} color="error" sx={{ '& .MuiBadge-badge': { fontSize: '0.6rem' } }}>
                  <NotificationsIcon fontSize="small" />
                </Badge>
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Box>
      
      <Divider sx={{ backgroundColor: 'rgba(100, 180, 255, 0.1)' }}/>
      
      <List>
        {menuItems.map((item, index) => (
          <ListItem key={item.text} disablePadding>
            <AnimatedListItem
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
              sx={{
                my: 0.5,
                mx: 1,
                borderRadius: 2,
                '&.Mui-selected': {
                  backgroundColor: 'rgba(66, 165, 245, 0.15)',
                  '&:hover': {
                    backgroundColor: 'rgba(66, 165, 245, 0.25)',
                  },
                },
                '&:hover': {
                  backgroundColor: 'rgba(66, 165, 245, 0.1)',
                },
              }}
              whileHover={{ x: 5 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
              <ListItemIcon sx={{ color: location.pathname === item.path ? '#42a5f5' : 'rgba(255, 255, 255, 0.6)' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{ 
                  fontWeight: location.pathname === item.path ? 600 : 400,
                  fontSize: '0.95rem',
                  color: location.pathname === item.path ? '#e3f2fd' : 'rgba(255, 255, 255, 0.8)'
                }} 
              />
            </AnimatedListItem>
          </ListItem>
        ))}
      </List>
      
      <Divider sx={{ backgroundColor: 'rgba(100, 180, 255, 0.1)', mt: 'auto' }}/>
      
      <List>
        {secondaryMenuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <AnimatedListItem
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
              sx={{
                my: 0.5,
                mx: 1,
                borderRadius: 2,
                '&.Mui-selected': {
                  backgroundColor: 'rgba(66, 165, 245, 0.15)',
                  '&:hover': {
                    backgroundColor: 'rgba(66, 165, 245, 0.25)',
                  },
                },
                '&:hover': {
                  backgroundColor: 'rgba(66, 165, 245, 0.1)',
                },
              }}
              whileHover={{ x: 5 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
              <ListItemIcon sx={{ color: location.pathname === item.path ? '#42a5f5' : 'rgba(255, 255, 255, 0.6)' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{ 
                  fontWeight: location.pathname === item.path ? 600 : 400,
                  fontSize: '0.95rem',
                  color: location.pathname === item.path ? '#e3f2fd' : 'rgba(255, 255, 255, 0.8)'
                }} 
              />
            </AnimatedListItem>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;