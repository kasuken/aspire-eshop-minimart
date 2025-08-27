import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  Box,
  Container,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Store as StoreIcon,
} from '@mui/icons-material';
import { Outlet } from 'react-router-dom';
import { Navigation } from './Navigation';
import { CartButton } from './CartButton';

export const Layout: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="fixed" elevation={1}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <StoreIcon sx={{ mr: 1 }} />
            <Typography variant="h6" component="div">
              Aspire eShop Minimart
            </Typography>
          </Box>
          
          <CartButton />
        </Toolbar>
      </AppBar>

      {/* Navigation Drawer for mobile */}
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? drawerOpen : true}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 240,
            mt: 8, // Account for AppBar height
          },
        }}
      >
        <Navigation onItemClick={() => isMobile && setDrawerOpen(false)} />
      </Drawer>

      {/* Desktop Navigation */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 240,
            mt: 8, // Account for AppBar height
          },
        }}
      >
        <Navigation />
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          mt: 8, // Account for AppBar height
          ml: { md: '240px' }, // Account for drawer width on desktop
        }}
      >
        <Container maxWidth={false} sx={{ py: 3 }}>
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
};