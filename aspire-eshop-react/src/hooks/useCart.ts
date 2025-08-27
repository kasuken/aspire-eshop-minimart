import { useState, useEffect } from 'react';
import { cartService } from '../services/cartService';
import { CartItem } from '../types';

export const useCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCartItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const items = await cartService.getCartItems();
      setCartItems(items);
    } catch (err) {
      setError('Failed to load cart items');
      console.error('Error loading cart:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCartItems();

    // Subscribe to cart changes
    const unsubscribe = cartService.subscribe(() => {
      loadCartItems();
    });

    return unsubscribe;
  }, []);

  const addToCart = async (productId: number, quantity: number = 1) => {
    try {
      setError(null);
      await cartService.addToCart(productId, quantity);
    } catch (err) {
      setError('Failed to add item to cart');
      throw err;
    }
  };

  const updateQuantity = async (itemId: number, quantity: number) => {
    try {
      setError(null);
      await cartService.updateCartItem(itemId, quantity);
    } catch (err) {
      setError('Failed to update item quantity');
      throw err;
    }
  };

  const removeItem = async (itemId: number) => {
    try {
      setError(null);
      await cartService.removeFromCart(itemId);
    } catch (err) {
      setError('Failed to remove item from cart');
      throw err;
    }
  };

  const clearCart = async () => {
    try {
      setError(null);
      await cartService.clearCart();
    } catch (err) {
      setError('Failed to clear cart');
      throw err;
    }
  };

  const subtotal = cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;
  const itemCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return {
    cartItems,
    loading,
    error,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    subtotal,
    tax,
    total,
    itemCount,
    refetch: loadCartItems,
  };
};