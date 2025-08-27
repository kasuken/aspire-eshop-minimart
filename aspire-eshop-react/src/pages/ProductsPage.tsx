import React, { useState, useEffect } from 'react';
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
  ArrowBack as ArrowBackIcon,
  AddShoppingCart as AddShoppingCartIcon,
  Star as StarIcon,
  SearchOff as SearchOffIcon,
} from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { useAsyncOperation } from '../hooks/useApi';
import { useCart } from '../hooks/useCart';
import { categoryApi, productApi } from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorDisplay } from '../components/ErrorDisplay';
import { Product, Category } from '../types';

export const ProductsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addToCart } = useCart();
  const { loading: addingToCart, execute: executeAddToCart } = useAsyncOperation();

  const categoryId = searchParams.get('category');
  const selectedCategoryId = categoryId ? parseInt(categoryId) : undefined;

  const [products, setProducts] = useState<Product[] | null>(null);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState<string | null>(null);

  const {
    data: categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useApi(() => categoryApi.getAll());

  const selectedCategory = categories?.find(c => c.id === selectedCategoryId);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setProductsLoading(true);
        setProductsError(null);
        const result = selectedCategoryId
          ? await productApi.getByCategory(selectedCategoryId)
          : await productApi.getAll();
        setProducts(result);
      } catch (error) {
        setProductsError('Failed to load products. Please try again.');
        console.error('Error loading products:', error);
      } finally {
        setProductsLoading(false);
      }
    };

    loadProducts();
  }, [selectedCategoryId]);

  const handleNavigateToCategory = (catId: number) => {
    navigate(`/products?category=${catId}`);
  };

  const handleNavigateToAllProducts = () => {
    navigate('/products');
  };

  const handleAddToCart = async (productId: number) => {
    const result = await executeAddToCart(() => addToCart(productId, 1));
    if (result) {
      console.log('Product added to cart successfully');
    }
  };

  const getPageTitle = () => {
    return selectedCategory ? `${selectedCategory.name} Products` : 'All Products';
  };

  return (
    <Box>
      {/* Header */}
      <Grid container alignItems="center" sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Typography variant="h4" component="h1">
            {getPageTitle()}
          </Typography>
        </Grid>
        <Grid item xs={12} md={6} textAlign={{ md: 'right' }}>
          {selectedCategory && (
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={handleNavigateToAllProducts}
              color="primary"
            >
              All Products
            </Button>
          )}
        </Grid>
      </Grid>

      {/* Category Filter */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Filter by Category
        </Typography>
        <Box display="flex" flexWrap="wrap" gap={1}>
          <Chip
            label="All Categories"
            variant={selectedCategoryId === undefined ? 'filled' : 'outlined'}
            color="primary"
            onClick={handleNavigateToAllProducts}
            clickable
          />
          {categoriesLoading && <LoadingSpinner size={20} message="" />}
          {categories?.map((category) => (
            <Chip
              key={category.id}
              label={category.name}
              variant={selectedCategoryId === category.id ? 'filled' : 'outlined'}
              color="primary"
              onClick={() => handleNavigateToCategory(category.id)}
              clickable
            />
          ))}
        </Box>
        {categoriesError && (
          <ErrorDisplay message="Failed to load categories" severity="warning" />
        )}
      </Paper>

      {/* Products Grid */}
      {productsLoading && (
        <LoadingSpinner message="Loading products..." />
      )}

      {productsError && (
        <ErrorDisplay message={productsError} />
      )}

      {products && products.length === 0 && (
        <Paper elevation={1} sx={{ p: 8, textAlign: 'center' }}>
          <SearchOffIcon sx={{ fontSize: '4rem', color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" color="text.secondary" gutterBottom>
            No products found
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Try selecting a different category
          </Typography>
        </Paper>
      )}

      {products && products.length > 0 && (
        <Grid container spacing={3}>
          {products.map((product) => (
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
                  <Chip
                    label={product.category.name}
                    size="small"
                    color="secondary"
                    variant="outlined"
                    sx={{ mb: 1, alignSelf: 'flex-start' }}
                  />
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
  );
};