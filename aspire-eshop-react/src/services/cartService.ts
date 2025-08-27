import { v4 as uuidv4 } from 'uuid';
import { cartApi } from './api';
import { CartItem } from '../types';

class CartService {
  private sessionId: string;
  private listeners: (() => void)[] = [];

  constructor() {
    // Get or create session ID
    this.sessionId = this.getOrCreateSessionId();
  }

  private getOrCreateSessionId(): string {
    let sessionId = localStorage.getItem('cartSessionId');
    if (!sessionId) {
      sessionId = uuidv4();
      localStorage.setItem('cartSessionId', sessionId);
    }
    return sessionId;
  }

  public getSessionId(): string {
    return this.sessionId;
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener());
  }

  public async getCartItems(): Promise<CartItem[]> {
    try {
      return await cartApi.get(this.sessionId);
    } catch (error) {
      console.error('Error getting cart items:', error);
      return [];
    }
  }

  public async addToCart(productId: number, quantity: number = 1): Promise<CartItem[]> {
    try {
      const result = await cartApi.add(this.sessionId, { productId, quantity });
      this.notifyListeners();
      return result;
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  }

  public async updateCartItem(itemId: number, quantity: number): Promise<CartItem[]> {
    try {
      const result = await cartApi.update(this.sessionId, itemId, { quantity });
      this.notifyListeners();
      return result;
    } catch (error) {
      console.error('Error updating cart item:', error);
      throw error;
    }
  }

  public async removeFromCart(itemId: number): Promise<void> {
    try {
      await cartApi.remove(this.sessionId, itemId);
      this.notifyListeners();
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  }

  public async clearCart(): Promise<void> {
    try {
      await cartApi.clear(this.sessionId);
      this.notifyListeners();
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  }

  public async getCartTotal(): Promise<number> {
    try {
      const items = await this.getCartItems();
      return items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    } catch (error) {
      console.error('Error calculating cart total:', error);
      return 0;
    }
  }

  public async getCartItemCount(): Promise<number> {
    try {
      const items = await this.getCartItems();
      return items.reduce((count, item) => count + item.quantity, 0);
    } catch (error) {
      console.error('Error getting cart item count:', error);
      return 0;
    }
  }
}

export const cartService = new CartService();