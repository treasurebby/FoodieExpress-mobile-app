// Vendor Types & Interfaces
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  available: boolean;
  prepTime: number; // minutes
  soldCount?: number;
}

export interface VendorOrder {
  id: string;
  orderId: string;
  customerName: string;
  customerPhone: string;
  items: OrderItemWithQuantity[];
  totalAmount: number;
  deliveryFee: number;
  status: 'new' | 'accepted' | 'preparing' | 'ready' | 'handed_to_rider' | 'completed' | 'cancelled';
  specialInstructions?: string;
  createdAt: Date;
  acceptedAt?: Date;
  readyAt?: Date;
  completedAt?: Date;
  estimatedPrepTime: number; // minutes
  actualPrepTime?: number; // minutes
  paymentMethod: 'card' | 'wallet' | 'cash';
  paymentStatus: 'pending' | 'confirmed';
}

export interface OrderItemWithQuantity {
  itemId: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface VendorAnalytics {
  date: string;
  ordersCount: number;
  totalRevenue: number;
  averageOrderValue: number;
  completedOrders: number;
  cancelledOrders: number;
  topItems: MenuItem[];
  peakHours: { hour: number; orderCount: number }[];
}

export interface VendorEarnings {
  totalEarnings: number;
  todayEarnings: number;
  weeklyEarnings: number;
  monthlyEarnings: number;
  commissionRate: number; // percentage
  totalCommission: number;
  pendingPayout: number;
  lastPayoutDate?: Date;
  nextPayoutDate: Date;
}

export interface VendorPayout {
  id: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  requestedAt: Date;
  completedAt?: Date;
  bankAccount: {
    accountName: string;
    accountNumber: string;
    bankName: string;
    bankCode: string;
  };
  transactionRef?: string;
}

export interface VendorProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  businessRegistration: string;
  hygieneCertificate?: string;
  governmentId?: string;
  location: string;
  campusLocation: string;
  businessHours: {
    startTime: string;
    endTime: string;
  };
  pickupPoints: {
    id: string;
    name: string;
    coordinates?: { lat: number; lng: number };
  }[];
  averageRating: number;
  totalOrders: number;
  acceptanceRate: number;
  kycStatus: 'pending' | 'verified' | 'rejected';
  busyMode: boolean;
  busyModeReason?: string;
  maxQueueCapacity: number;
  currentQueueSize: number;
}

export interface BankDetail {
  accountName: string;
  accountNumber: string;
  bankName: string;
  bankCode: string;
  bvn?: string;
}

export interface VendorStats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  averageRating: number;
  acceptanceRate: number;
  totalEarnings: number;
  todayEarnings: number;
}
