import axios from 'axios';
import { Category, Product, CartItem, CartItemRequest, UpdateCartItemRequest, WeatherForecast } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/apiservice';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// Category API
export const categoryApi = {
  getAll: async (): Promise<Category[]> => {
    const response = await apiClient.get<Category[]>('/categories');
    return response.data;
  },

  getById: async (id: number): Promise<Category> => {
    const response = await apiClient.get<Category>(`/categories/${id}`);
    return response.data;
  },
};

// Product API
export const productApi = {
  getAll: async (categoryId?: number, featured?: boolean): Promise<Product[]> => {
    const params = new URLSearchParams();
    if (categoryId !== undefined) params.append('categoryId', categoryId.toString());
    if (featured !== undefined) params.append('featured', featured.toString());
    
    const response = await apiClient.get<Product[]>(`/products?${params}`);
    return response.data;
  },

  getById: async (id: number): Promise<Product> => {
    const response = await apiClient.get<Product>(`/products/${id}`);
    return response.data;
  },

  getFeatured: async (): Promise<Product[]> => {
    const response = await apiClient.get<Product[]>('/products/featured');
    return response.data;
  },

  getByCategory: async (categoryId: number): Promise<Product[]> => {
    const response = await apiClient.get<Product[]>(`/products/category/${categoryId}`);
    return response.data;
  },
};

// Cart API
export const cartApi = {
  get: async (sessionId: string): Promise<CartItem[]> => {
    const response = await apiClient.get<CartItem[]>(`/cart/${sessionId}`);
    return response.data;
  },

  add: async (sessionId: string, request: CartItemRequest): Promise<CartItem[]> => {
    const response = await apiClient.post<CartItem[]>(`/cart/${sessionId}/add`, request);
    return response.data;
  },

  update: async (sessionId: string, itemId: number, request: UpdateCartItemRequest): Promise<CartItem[]> => {
    const response = await apiClient.put<CartItem[]>(`/cart/${sessionId}/update/${itemId}`, request);
    return response.data;
  },

  remove: async (sessionId: string, itemId: number): Promise<void> => {
    await apiClient.delete(`/cart/${sessionId}/remove/${itemId}`);
  },

  clear: async (sessionId: string): Promise<void> => {
    await apiClient.delete(`/cart/${sessionId}/clear`);
  },
};

// Weather API
export const weatherApi = {
  getForecast: async (): Promise<WeatherForecast[]> => {
    const response = await apiClient.get<WeatherForecast[]>('/weatherforecast');
    return response.data;
  },
};