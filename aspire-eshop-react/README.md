# Aspire eShop Minimart - React Frontend

A modern React frontend for the Aspire eShop Minimart e-commerce application, built with TypeScript, Material-UI, and Vite.

## ?? Features

- **Modern React Application** - Built with React 18, TypeScript, and Vite
- **Material-UI Design System** - Professional UI components with Material Design
- **Responsive Layout** - Works seamlessly on desktop, tablet, and mobile devices
- **Shopping Cart Management** - Add, update, remove items with session persistence
- **Product Catalog** - Browse products with category filtering and search
- **Real-time Updates** - Cart updates reflected across the application
- **API Integration** - Full integration with the .NET Aspire backend API

## ??? Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Library**: Material-UI (MUI)
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **State Management**: React Hooks + Context
- **Icons**: Material Icons

## ?? Project Structure

```
src/
??? components/          # Reusable UI components
?   ??? Layout.tsx       # Main application layout
?   ??? Navigation.tsx   # Side navigation menu
?   ??? CartButton.tsx   # Cart button with badge
?   ??? LoadingSpinner.tsx
?   ??? ErrorDisplay.tsx
??? pages/              # Page components
?   ??? HomePage.tsx    # Landing page with hero and featured products
?   ??? ProductsPage.tsx # Product catalog with filtering
?   ??? CartPage.tsx    # Shopping cart management
?   ??? CounterPage.tsx # Simple counter demo
?   ??? WeatherPage.tsx # Weather data display
??? services/           # API and business logic
?   ??? api.ts          # API client functions
?   ??? cartService.ts  # Cart state management
??? hooks/              # Custom React hooks
?   ??? useApi.ts       # Generic API hook
?   ??? useCart.ts      # Cart management hook
??? types/              # TypeScript type definitions
?   ??? index.ts        # API response types
??? App.tsx             # Main app component with routing
??? main.tsx           # Application entry point
```

## ????? Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn package manager
- .NET Aspire backend running (see main project README)

### Installation

1. **Navigate to the React frontend directory:**
   ```bash
   cd aspire-eshop-react
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser and navigate to:**
   ```
   http://localhost:3000
   ```

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## ?? Configuration

### API Proxy

The Vite configuration includes a proxy setup to route API calls to the backend:

```typescript
// vite.config.ts
server: {
  proxy: {
    '/api': {
      target: 'https://localhost:7443', // Your API service URL
      changeOrigin: true,
      secure: false,
      rewrite: (path) => path.replace(/^\/api/, '')
    }
  }
}
```

### Environment Variables

Create a `.env.local` file in the project root to customize settings:

```env
VITE_API_BASE_URL=https://localhost:7443
```

## ?? Pages & Features

### ?? Home Page
- Hero section with call-to-action
- Interactive category grid
- Featured products showcase
- Add to cart functionality

### ??? Products Page
- Complete product catalog
- Category-based filtering
- Product cards with details
- Stock status indicators
- Add to cart with loading states

### ?? Shopping Cart
- View all cart items
- Update quantities with +/- buttons or text input
- Remove individual items
- Clear entire cart
- Order summary with tax calculation
- Persistent cart using localStorage

### ?? Additional Pages
- **Counter**: Simple state management demo
- **Weather**: API data fetching example

## ?? UI Components

### Material-UI Components Used
- `AppBar` & `Toolbar` - Top navigation
- `Drawer` - Side navigation panel
- `Card` & `CardMedia` - Product and category displays
- `Grid` - Responsive layout system
- `Button` & `IconButton` - Interactive elements
- `TextField` - Form inputs
- `Chip` - Category tags and labels
- `Badge` - Cart item count
- `Alert` - Error and success messages
- `CircularProgress` - Loading indicators

### Custom Components
- **Layout**: Main application shell with responsive navigation
- **LoadingSpinner**: Consistent loading states
- **ErrorDisplay**: Error message handling
- **CartButton**: Cart icon with item count badge

## ?? State Management

### Cart Management
- Session-based cart using localStorage
- Real-time updates across components
- Optimistic UI updates
- Error handling with rollback

### API Integration
- Axios-based HTTP client
- Request/response interceptors
- Error handling and retries
- Loading state management

## ?? Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues

## ?? API Integration

The React frontend integrates with the following API endpoints:

### Products API
- `GET /products` - Get all products with optional filtering
- `GET /products/{id}` - Get product by ID
- `GET /products/featured` - Get featured products
- `GET /products/category/{categoryId}` - Get products by category

### Categories API
- `GET /categories` - Get all categories
- `GET /categories/{id}` - Get category by ID

### Cart API
- `GET /cart/{sessionId}` - Get cart items
- `POST /cart/{sessionId}/add` - Add item to cart
- `PUT /cart/{sessionId}/update/{itemId}` - Update cart item
- `DELETE /cart/{sessionId}/remove/{itemId}` - Remove cart item
- `DELETE /cart/{sessionId}/clear` - Clear cart

### Weather API
- `GET /weatherforecast` - Get weather forecast data

## ?? Key Features Implemented

? **Complete E-commerce Frontend**
- Product browsing and filtering
- Shopping cart management
- Session persistence
- Responsive design

? **Modern React Patterns**
- Functional components with hooks
- Custom hooks for reusable logic
- Context-free state management
- Error boundaries and loading states

? **Material Design UI**
- Consistent design system
- Responsive grid layout
- Interactive components
- Smooth animations and transitions

? **API Integration**
- RESTful API consumption
- Error handling and retries
- Loading states and optimistic updates
- Type-safe TypeScript interfaces

## ?? Future Enhancements

- **User Authentication** - Login/register functionality
- **Payment Integration** - Checkout process
- **Search Functionality** - Product search with filters
- **Wishlist Feature** - Save favorite products
- **Order History** - Track past purchases
- **Progressive Web App** - Offline support and installability

## ?? Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## ?? License

This project is part of the Aspire eShop Minimart application and follows the same licensing terms.

---

**Happy Shopping! ???**