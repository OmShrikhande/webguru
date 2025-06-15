import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AppBar, 
  Box, 
  Toolbar, 
  IconButton, 
  Typography, 
  InputBase, 
  Badge, 
  MenuItem, 
  Menu,
  Avatar,
  Tooltip,
  alpha,
  styled,
  CircularProgress,
  Paper
} from '@mui/material';
import { 
  Menu as MenuIcon, 
  Search as SearchIcon, 
  Notifications as NotificationsIcon, 
  MoreVert as MoreIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius * 3,
  backgroundColor: alpha(theme.palette.common.white, 0.08),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.12),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
  border: '1px solid rgba(100, 180, 255, 0.1)',
  transition: 'all 0.3s ease',
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'rgba(255, 255, 255, 0.7)',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
      '&:focus': {
        width: '30ch',
      },
    },
    color: 'rgba(255, 255, 255, 0.85)',
    '&::placeholder': {
      color: 'rgba(255, 255, 255, 0.5)',
    },
  },
}));

const TopBar = ({ open, handleDrawerOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate('/');
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleSearch = async (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (query.length > 2) {
      setIsSearching(true);
      try {
        const response = await axios.get(`/api/search?q=${query}`);
        setSearchResults(response.data);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsSearching(false);
      }
    } else {
      setSearchResults([]);
    }
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
      PaperProps={{
        sx: {
          backgroundColor: 'rgba(15, 20, 40, 0.97)',
          backgroundImage: 'linear-gradient(135deg, rgba(20, 30, 70, 0.95) 0%, rgba(10, 15, 35, 0.98) 100%)',
          color: '#fff',
          border: '1px solid rgba(100, 180, 255, 0.1)',
          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.5), 0 0 20px rgba(0, 150, 255, 0.1)',
          mt: 1.5
        }
      }}
    >
      <MenuItem onClick={handleMenuClose} sx={{ 
        '&:hover': { backgroundColor: 'rgba(66, 165, 245, 0.1)' }
      }}>
        <Avatar sx={{ width: 24, height: 24, bgcolor: '#1e88e5', mr: 2, fontSize: '0.8rem' }}>
          {user?.name?.charAt(0) || 'U'}
        </Avatar>
        <Typography>Profile</Typography>
      </MenuItem>
      <MenuItem onClick={handleMenuClose} sx={{ 
        '&:hover': { backgroundColor: 'rgba(66, 165, 245, 0.1)' } 
      }}>
        <SettingsIcon fontSize="small" sx={{ mr: 2, color: 'rgba(255, 255, 255, 0.6)' }} />
        <Typography>Settings</Typography>
      </MenuItem>
      <MenuItem onClick={handleLogout} sx={{ 
        '&:hover': { backgroundColor: 'rgba(244, 67, 54, 0.1)' } 
      }}>
        <LogoutIcon fontSize="small" sx={{ mr: 2, color: 'rgba(244, 67, 54, 0.8)' }} />
        <Typography color="error">Logout</Typography>
      </MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
      PaperProps={{
        sx: {
          backgroundColor: 'rgba(15, 20, 40, 0.95)',
          backgroundImage: 'linear-gradient(135deg, rgba(20, 30, 70, 0.9) 0%, rgba(10, 15, 35, 0.95) 100%)',
          color: '#fff',
          border: '1px solid rgba(100, 180, 255, 0.1)',
          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.5), 0 0 20px rgba(0, 150, 255, 0.1)',
        }
      }}
    >
      <MenuItem>
        <IconButton
          size="large"
          color="inherit"
        >
          <Badge badgeContent={17} color="primary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <Avatar sx={{ width: 24, height: 24, bgcolor: '#1e88e5', fontSize: '0.8rem' }}>
            {user?.name?.charAt(0) || 'U'}
          </Avatar>
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar 
        position="fixed" 
        sx={{
          width: { sm: `calc(100% - ${open ? 280 : 0}px)` },
          ml: { sm: `${open ? 280 : 0}px` },
          transition: theme => theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          boxShadow: 'none',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(100, 180, 255, 0.1)',
          backgroundColor: 'rgba(15, 20, 40, 0.80)',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }), color: 'rgba(255, 255, 255, 0.8)' }}
          >
            <MenuIcon />
          </IconButton>
          
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{
                  display: { xs: 'none', sm: 'block' },
                  fontWeight: 700,
                  background: 'linear-gradient(90deg, #64b5f6, #4fc3f7, #29b6f6)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mr: 1,
                  letterSpacing: '0.5px'
                }}
              >
                MASTER DASHBOARD
              </Typography>
            </motion.div>
          </Box>
          
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearch}
              endAdornment={
                isSearching ? (
                  <CircularProgress size={20} sx={{ color: 'white', opacity: 0.5 }} />
                ) : null
              }
            />
            {searchResults.length > 0 && (
              <Paper
                sx={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  mt: 1,
                  maxHeight: 400,
                  overflow: 'auto',
                  backgroundColor: 'rgba(15, 25, 45, 0.95)',
                  borderRadius: 1,
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                {/* Search results list */}
              </Paper>
            )}
          </Search>
          
          <Box sx={{ flexGrow: 1 }} />
          
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <Tooltip title="Notifications">
              <IconButton
                size="large"
                aria-label="show 17 new notifications"
                color="inherit"
                sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
              >
                <Badge badgeContent={17} color="primary">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Account">
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
                sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
              >
                <Avatar sx={{ width: 32, height: 32, bgcolor: '#1e88e5', fontSize: '0.9rem' }}>
                  {user?.name?.charAt(0) || 'U'}
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>
          
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
              sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </Box>
  );
};

export default TopBar;