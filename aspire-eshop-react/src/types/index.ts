export interface Category {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string;
  createdAt: string;
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  stockQuantity: number;
  imageUrl?: string;
  isFeatured: boolean;
  categoryId: number;
  createdAt: string;
  category: Category;
}

export interface CartItem {
  id: number;
  sessionId: string;
  productId: number;
  quantity: number;
  createdAt: string;
  product: Product;
}

export interface CartItemRequest {
  productId: number;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

export interface WeatherForecast {
  date: string;
  temperatureC: number;
  temperatureF: number;
  summary?: string;
}