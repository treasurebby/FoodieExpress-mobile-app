/**
 * User-related types
 */
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'user' | 'vendor' | 'rider';
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials extends LoginCredentials {
  name: string;
  phone?: string;
  role: 'user' | 'vendor' | 'rider';
  confirmPassword: string;
}

export interface VendorSignupCredentials extends LoginCredentials {
  name: string;
  businessName?: string;
  businessAddress?: string;
  cuisineType?: string;
  businessLicense?: string;
  phone?: string;
  bankDetails?: string;
  role: 'vendor';
  confirmPassword: string;
}

export interface RiderSignupCredentials extends LoginCredentials {
  name: string;
  phone?: string;
  vehicleType?: string;
  vehicleRegistration?: string;
  driverLicense?: string;
  bankDetails?: string;
  role: 'rider';
  confirmPassword: string;
}

/**
 * Restaurant and Menu types
 */
export interface Restaurant {
  id: string;
  name: string;
  location?: string;
  image: string;
  rating: number;
  deliveryTime: string;
  cuisine: string[];
  distance: string;
  priceRange: string;
  isBusy: boolean;
  prepTime?: number;
  menu?: MenuItem[];
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  available: boolean;
  customizations?: Customization[];
}

export interface Customization {
  id: string;
  name: string;
  required: boolean;
  options: CustomizationOption[];
}

export interface CustomizationOption {
  id: string;
  name: string;
  price: number;
}

export interface Category {
  id: string;
  name: string;
  image: string;
}

/**
 * Cart and Order types
 */
export interface CartItem extends MenuItem {
  quantity: number;
  selectedCustomizations?: Record<string, string>;
}

export interface Cart {
  items: CartItem[];
  restaurantId?: string;
}

export type OrderStatus = 'draft' | 'pending' | 'processing' | 'ready' | 'out_for_delivery' | 'completed' | 'cancelled';

export interface OrderItem {
  id: string;
  name: string;
  qty: number;
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  restaurantId: string;
  restaurantName: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  deliveryAddress?: string;
  paymentMethod?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Chat and Messaging types
 */
export type ChatMessageType = 'text' | 'quick_reply' | 'suggested_response' | 'order_summary' | 'typing';

export interface ChatMessage {
  id: string;
  from: 'user' | 'bot' | 'restaurant';
  text: string;
  timestamp: string;
  messageType?: ChatMessageType;
  isRead?: boolean;
  avatar?: string;
  senderName?: string;
  relatedOrderId?: string;
  quickReplyOptions?: QuickReplyOption[];
  suggestedResponses?: string[];
}

export interface QuickReplyOption {
  id: string;
  label: string;
  action: 'track_order' | 'view_menu' | 'report_issue' | 'escalate' | 'custom';
  orderId?: string;
  payload?: Record<string, any>;
}

export interface ChatSession {
  id: string;
  restaurantId: string;
  restaurantName: string;
  restaurantLogo?: string;
  messages: ChatMessage[];
  createdAt: string;
  lastMessageAt: string;
  unreadCount?: number;
  isResolved?: boolean;
  escalatedToHuman?: boolean;
  rating?: number;
  feedback?: string;
  context?: ChatContext;
}

export interface ChatContext {
  lastOrderId?: string;
  userPreferences?: string[];
  issueType?: 'order_status' | 'wrong_order' | 'missing_item' | 'quality' | 'other';
  issueResolved?: boolean;
}

/**
 * Vendor types
 */
export interface VendorDashboardOrder {
  id: string;
  customer: string;
  items: string[];
  amount: number;
  status: 'incoming' | 'preparing' | 'ready' | 'out_for_delivery' | 'completed';
  createdAt: string;
}

export interface VendorMenuManagement extends MenuItem {
  vendor_id: string;
  isEditing?: boolean;
}

/**
 * Rider types
 */
export interface RiderOrder extends Order {
  riderAssigned?: string;
  pickupLocation?: string;
  deliveryLocation?: string;
  estimatedDeliveryTime?: string;
}

/**
 * API Response types
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

/**
 * Validation types
 */
export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}
