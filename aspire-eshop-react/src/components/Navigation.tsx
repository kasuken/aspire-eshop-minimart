import React from 'react';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Home as HomeIcon,
  Inventory as InventoryIcon,
  ShoppingCart as ShoppingCartIcon,
  Add as AddIcon,
  Cloud as CloudIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

interface NavigationProps {
  onItemClick?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ onItemClick }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    navigate(path);
    onItemClick?.();
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <List>
      <ListItem disablePadding>
        <ListItemButton
          selected={isActive('/')}
          onClick={() => handleNavigation('/')}
        >
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItemButton>
      </ListItem>

      <ListItem disablePadding>
        <ListItemButton
          selected={isActive('/products')}
          onClick={() => handleNavigation('/products')}
        >
          <ListItemIcon>
            <InventoryIcon />
          </ListItemIcon>
          <ListItemText primary="Products" />
        </ListItemButton>
      </ListItem>

      <ListItem disablePadding>
        <ListItemButton
          selected={isActive('/cart')}
          onClick={() => handleNavigation('/cart')}
        >
          <ListItemIcon>
            <ShoppingCartIcon />
          </ListItemIcon>
          <ListItemText primary="Shopping Cart" />
        </ListItemButton>
      </ListItem>

      <Divider sx={{ my: 1 }} />

      <ListItem disablePadding>
        <ListItemButton
          selected={isActive('/counter')}
          onClick={() => handleNavigation('/counter')}
        >
          <ListItemIcon>
            <AddIcon />
          </ListItemIcon>
          <ListItemText primary="Counter" />
        </ListItemButton>
      </ListItem>

      <ListItem disablePadding>
        <ListItemButton
          selected={isActive('/weather')}
          onClick={() => handleNavigation('/weather')}
        >
          <ListItemIcon>
            <CloudIcon />
          </ListItemIcon>
          <ListItemText primary="Weather" />
        </ListItemButton>
      </ListItem>
    </List>
  );
};