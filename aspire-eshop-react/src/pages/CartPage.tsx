import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  Card,
  CardContent,
  Chip,
  TextField,
  IconButton,
  Divider,
  Alert,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Remove as RemoveIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  RemoveShoppingCart as RemoveShoppingCartIcon,
  ShoppingBag as ShoppingBagIcon,
  CreditCard as CreditCardIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useAsyncOperation } from '../hooks/useApi';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorDisplay } from '../components/ErrorDisplay';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    cartItems, 
    loading, 
    error, 
    updateQuantity, 
    removeItem, 
    clearCart,
    subtotal,
    tax,
    total,
  } = useCart();
  
  const { loading: updating, execute: executeUpdate } = useAsyncOperation();
  const [quantityInputs, setQuantityInputs] = useState<Record<number, string>>({});

  const handleUpdateQuantity = async (itemId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      await executeUpdate(() => removeItem(itemId));
      return;
    }

    await executeUpdate(() => updateQuantity(itemId, newQuantity));
  };

  const handleQuantityInputChange = (itemId: number, value: string) => {
    setQuantityInputs(prev => ({
      ...prev,
      [itemId]: value,
    }));
  };

  const handleQuantityInputBlur = async (itemId: number) => {
    const value = quantityInputs[itemId];
    if (value !== undefined) {
      const newQuantity = parseInt(value);
      if (!isNaN(newQuantity) && newQuantity > 0) {
        await handleUpdateQuantity(itemId, newQuantity);
      }
      // Clear the input state
      setQuantityInputs(prev => {
        const newState = { ...prev };
        delete newState[itemId];
        return newState;
      });
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    await executeUpdate(() => removeItem(itemId));
  };

  const handleClearCart = async () => {
    await executeUpdate(() => clearCart());
  };

  if (loading) {
    return <LoadingSpinner message="Loading your cart..." />;
  }

  return (
    <Box>
      {/* Header */}
      <Grid container alignItems="center" sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Typography variant="h4" component="h1">
            Shopping Cart
          </Typography>
        </Grid>
        <Grid item xs={12} md={6} textAlign={{ md: 'right' }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/products')}
            color="primary"
          >
            Continue Shopping
          </Button>
        </Grid>
      </Grid>

      {error && (
        <ErrorDisplay message={error} />
      )}

      {cartItems.length === 0 ? (
        <Paper elevation={2} sx={{ p: 8, textAlign: 'center' }}>
          <RemoveShoppingCartIcon sx={{ fontSize: '4rem', color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" color="text.secondary" gutterBottom>
            Your cart is empty
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Add some products to get started!
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<ShoppingBagIcon />}
            onClick={() => navigate('/products')}
          >
            Start Shopping
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {/* Cart Items */}
          <Grid item xs={12} lg={8}>
            <Paper elevation={2}>
              {/* Header */}
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}
              >
                <Typography variant="h6">
                  Cart Items ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)
                </Typography>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={handleClearCart}
                  size="small"
                  disabled={updating}
                >
                  Clear Cart
                </Button>
              </Box>

              {/* Cart Items List */}
              {cartItems.map((item, index) => (
                <Box key={item.id}>
                  <Box sx={{ p: 3 }}>
                    <Grid container alignItems="center" spacing={2}>
                      {/* Product Image */}
                      <Grid item xs={12} sm={2}>
                        <Box
                          component="img"
                          src={item.product.imageUrl || '/placeholder-product.jpg'}
                          alt={item.product.name}
                          sx={{
                            width: 80,
                            height: 80,
                            objectFit: 'cover',
                            borderRadius: 1,
                          }}
                        />
                      </Grid>

                      {/* Product Info */}
                      <Grid item xs={12} sm={4}>
                        <Typography variant="h6" gutterBottom>
                          {item.product.name}
                        </Typography>
                        <Chip
                          label={item.product.category.name}
                          size="small"
                          color="secondary"
                          variant="outlined"
                          sx={{ mb: 1 }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          ${item.product.price.toFixed(2)} each
                        </Typography>
                      </Grid>

                      {/* Quantity Controls */}
                      <Grid item xs={12} sm={3}>
                        <Box display="flex" alignItems="center" justifyContent="center">
                          <IconButton
                            color="primary"
                            size="small"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            disabled={updating}
                          >
                            <RemoveIcon />
                          </IconButton>
                          <TextField
                            value={quantityInputs[item.id] ?? item.quantity}
                            onChange={(e) => handleQuantityInputChange(item.id, e.target.value)}
                            onBlur={() => handleQuantityInputBlur(item.id)}
                            size="small"
                            sx={{ mx: 1, width: 80 }}
                            inputProps={{
                              style: { textAlign: 'center' },
                              min: 1,
                              type: 'number',
                            }}
                          />
                          <IconButton
                            color="primary"
                            size="small"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            disabled={updating}
                          >
                            <AddIcon />
                          </IconButton>
                        </Box>
                      </Grid>

                      {/* Item Total */}
                      <Grid item xs={12} sm={2} textAlign="center">
                        <Typography variant="h6" color="primary" fontWeight="bold">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </Typography>
                      </Grid>

                      {/* Remove Button */}
                      <Grid item xs={12} sm={1} textAlign="center">
                        <IconButton
                          color="error"
                          size="small"
                          onClick={() => handleRemoveItem(item.id)}
                          disabled={updating}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </Box>
                  {index < cartItems.length - 1 && <Divider />}
                </Box>
              ))}
            </Paper>
          </Grid>

          {/* Order Summary */}
          <Grid item xs={12} lg={4}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Order Summary
              </Typography>

              <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
                <Typography>
                  Items ({cartItems.reduce((sum, item) => sum + item.quantity, 0)}):
                </Typography>
                <Typography>${subtotal.toFixed(2)}</Typography>
              </Box>

              <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
                <Typography>Shipping:</Typography>
                <Typography color="success.main">Free</Typography>
              </Box>

              <Box display="flex" justifyContent="space-between" sx={{ mb: 2 }}>
                <Typography>Tax:</Typography>
                <Typography>${tax.toFixed(2)}</Typography>
              </Box>

              <Divider sx={{ mb: 2 }} />

              <Box display="flex" justifyContent="space-between" sx={{ mb: 3 }}>
                <Typography variant="h6">Total:</Typography>
                <Typography variant="h6" color="primary" fontWeight="bold">
                  ${total.toFixed(2)}
                </Typography>
              </Box>

              <Button
                variant="contained"
                color="success"
                fullWidth
                size="large"
                startIcon={<CreditCardIcon />}
                disabled={cartItems.length === 0}
                sx={{ mb: 1 }}
              >
                Proceed to Checkout
              </Button>

              <Typography
                variant="caption"
                color="text.secondary"
                textAlign="center"
                display="block"
              >
                Secure checkout powered by our platform
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};