import React from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Paper,
  Chip,
  Alert,
} from '@mui/material';
import {
  ShoppingBag as ShoppingBagIcon,
  Store as StoreIcon,
  AddShoppingCart as AddShoppingCartIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { useAsyncOperation } from '../hooks/useApi';
import { useCart } from '../hooks/useCart';
import { useSnackbar } from '../contexts/SnackbarContext';
import { categoryApi, productApi } from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorDisplay } from '../components/ErrorDisplay';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { showSnackbar } = useSnackbar();
  const { loading: addingToCart, execute: executeAddToCart } = useAsyncOperation();

  const {
    data: categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useApi(() => categoryApi.getAll());

  const {
    data: featuredProducts,
    loading: productsLoading,
    error: productsError,
  } = useApi(() => productApi.getFeatured());

  const handleNavigateToCategory = (categoryId: number) => {
    navigate(`/products?category=${categoryId}`);
  };

  const handleAddToCart = async (productId: number) => {
    const result = await executeAddToCart(() => addToCart(productId, 1));
    if (result) {
      showSnackbar('Product added to cart!', 'success');
    } else {
      showSnackbar('Failed to add product to cart. Please try again.', 'error');
    }
  };

  return (
    <Box>
      {/* Hero Section */}
      <Paper
        elevation={3}
        sx={{
          background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
          color: 'white',
          p: 6,
          mb: 6,
          borderRadius: 2,
        }}
      >
        <Grid container alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
              eShop Minimart
            </Typography>
            <Typography variant="h5" component="p" gutterBottom>
              Your one-stop shop for fresh groceries and everyday essentials
            </Typography>
            <Button
              variant="contained"
              size="large"
              startIcon={<ShoppingBagIcon />}
              onClick={() => navigate('/products')}
              sx={{
                bgcolor: 'secondary.main',
                color: 'white',
                '&:hover': {
                  bgcolor: 'secondary.dark',
                },
              }}
            >
              Shop Now
            </Button>
          </Grid>
          <Grid item xs={12} md={6} textAlign="center">
            <StoreIcon sx={{ fontSize: '8rem' }} />
          </Grid>
        </Grid>
      </Paper>

      {/* Categories Section */}
      <Box mb={6}>
        <Typography variant="h4" component="h2" textAlign="center" gutterBottom>
          Shop by Category
        </Typography>

        {categoriesLoading && <LoadingSpinner message="Loading categories..." />}
        {categoriesError && (
          <ErrorDisplay message="Failed to load categories. Please try again." />
        )}

        {categories && (
          <Grid container spacing={3}>
            {categories.map((category) => (
              <Grid item xs={6} sm={4} md={2} key={category.id}>
                <Card
                  elevation={2}
                  sx={{
                    cursor: 'pointer',
                    height: '100%',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                    },
                  }}
                  onClick={() => handleNavigateToCategory(category.id)}
                >
                  <CardMedia
                    component="img"
                    height="120"
                    image={category.imageUrl || '/placeholder-category.jpg'}
                    alt={category.name}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="subtitle1" textAlign="center">
                      {category.name}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Featured Products Section */}
      <Box mb={6}>
        <Typography variant="h4" component="h2" textAlign="center" gutterBottom>
          Featured Products
        </Typography>

        {productsLoading && <LoadingSpinner message="Loading featured products..." />}
        {productsError && (
          <ErrorDisplay message="Failed to load featured products. Please try again." />
        )}

        {featuredProducts && featuredProducts.length === 0 && (
          <Alert severity="info" sx={{ mb: 4 }}>
            No featured products available.
          </Alert>
        )}

        {featuredProducts && featuredProducts.length > 0 && (
          <Grid container spacing={3}>
            {featuredProducts.map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                <Card
                  elevation={4}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                    },
                  }}
                >
                  <Box position="relative">
                    {product.isFeatured && (
                      <Chip
                        icon={<StarIcon />}
                        label="Featured"
                        color="warning"
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 8,
                          left: 8,
                          zIndex: 1,
                        }}
                      />
                    )}
                    <CardMedia
                      component="img"
                      height="200"
                      image={product.imageUrl || '/placeholder-product.jpg'}
                      alt={product.name}
                      sx={{ objectFit: 'cover' }}
                    />
                  </Box>
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h6" component="h3" gutterBottom>
                      {product.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ flexGrow: 1, mb: 2 }}
                    >
                      {product.description}
                    </Typography>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="h5" color="primary" fontWeight="bold">
                        ${product.price.toFixed(2)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Stock: {product.stockQuantity}
                      </Typography>
                    </Box>
                  </CardContent>
                  <CardActions sx={{ p: 2 }}>
                    <Button
                      variant="contained"
                      fullWidth
                      startIcon={<AddShoppingCartIcon />}
                      onClick={() => handleAddToCart(product.id)}
                      disabled={product.stockQuantity === 0 || addingToCart}
                      size="small"
                    >
                      {product.stockQuantity === 0
                        ? 'Out of Stock'
                        : addingToCart
                        ? 'Adding...'
                        : 'Add to Cart'}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
};