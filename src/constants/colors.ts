const AppColors = {
  // FoodieExpress color scheme: White, Orange, Dark Green
  primary: '#FF6B35', // Vibrant orange
  secondary: '#1B5E20', // Dark green

  background: '#FFFFFF',
  backgroundAlt: '#F8F8F8',
  white: '#FFFFFF',

  text: {
    primary: '#1A1A1A', // Dark text
    secondary: '#666666', // Medium text
    disabled: '#CCCCCC', // Disabled text
    light: '#FFFFFF', // Light text for dark backgrounds
  },

  border: '#EEEEEE',
  borderLight: '#E0E0E0',

  success: '#1B5E20', // Dark green
  error: '#D32F2F', // Red
  warning: '#FF6B35', // Orange (reuse primary)
  rating: '#FFB800',
  info: '#1976D2',

  shadow: 'rgba(0, 0, 0, 0.1)',
  overlay: 'rgba(0, 0, 0, 0.5)',
};

// Full Colors object with light/dark theme support
export const Colors = {
  light: {
    text: '#1A1A1A',
    textSecondary: '#666666',
    background: '#FFFFFF',
    backgroundAlt: '#F8F8F8',
    card: '#FFFFFF',
    cardAlt: '#F8F8F8',
    border: '#EEEEEE',
    primary: '#FF6B35', // Orange
    secondary: '#1B5E20', // Dark green
    success: '#1B5E20', // Dark green
    error: '#D32F2F',
    warning: '#FF6B35', // Orange
    info: '#1976D2',
    rating: '#FFB800',
    tint: '#FF6B35',
    shadow: 'rgba(0, 0, 0, 0.1)',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
  dark: {
    text: '#FFFFFF',
    textSecondary: '#B0B0B0',
    background: '#121212',
    backgroundAlt: '#1A1A1A',
    card: '#1E1E1E',
    cardAlt: '#242424',
    border: '#2C2C2C',
    primary: '#FF8A65', // Lighter orange for dark mode
    secondary: '#4CAF50', // Medium green for dark mode
    success: '#66BB6A', // Light green
    error: '#EF5350',
    warning: '#FFB74D', // Lighter orange
    info: '#42A5F5',
    rating: '#FFD54F',
    tint: '#FF8A65',
    shadow: 'rgba(0, 0, 0, 0.3)',
    overlay: 'rgba(0, 0, 0, 0.7)',
  },
};

export default AppColors;