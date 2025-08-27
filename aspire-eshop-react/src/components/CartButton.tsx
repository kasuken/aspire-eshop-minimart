import React, { useState, useEffect } from 'react';
import { IconButton, Badge } from '@mui/material';
import { ShoppingCart as ShoppingCartIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { cartService } from '../services/cartService';

export const CartButton: React.FC = () => {
  const [itemCount, setItemCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const updateCartCount = async () => {
      try {
        const count = await cartService.getCartItemCount();
        setItemCount(count);
      } catch (error) {
        console.error('Error updating cart count:', error);
        setItemCount(0);
      }
    };

    updateCartCount();

    // Subscribe to cart changes
    const unsubscribe = cartService.subscribe(() => {
      updateCartCount();
    });

    return unsubscribe;
  }, []);

  const handleCartClick = () => {
    navigate('/cart');
  };

  return (
    <IconButton
      color="inherit"
      onClick={handleCartClick}
      size="large"
    >
      <Badge
        badgeContent={itemCount}
        color="error"
        invisible={itemCount === 0}
      >
        <ShoppingCartIcon />
      </Badge>
    </IconButton>
  );
};