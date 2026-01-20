import {
  MenuItem,
  VendorOrder,
  VendorProfile,
  VendorAnalytics,
  VendorEarnings,
  VendorPayout,
  VendorStats,
  BankDetail,
} from '@/types/vendor';

// Menu Items Data - Realistic Campus Vendor
export const mockMenuItems: MenuItem[] = [
  {
    id: 'item_1',
    name: 'Jollof Rice & Chicken',
    description: 'Fragrant jollof rice with grilled chicken breast',
    price: 2500,
    category: 'Main Courses',
    available: true,
    prepTime: 15,
    soldCount: 342,
  },
  {
    id: 'item_2',
    name: 'Fried Rice & Beef',
    description: 'Egg fried rice with seasoned beef chunks',
    price: 2300,
    category: 'Main Courses',
    available: true,
    prepTime: 12,
    soldCount: 298,
  },
  {
    id: 'item_3',
    name: 'Plain White Rice & Stew',
    description: 'Fluffy white rice with rich tomato meat stew',
    price: 1800,
    category: 'Main Courses',
    available: true,
    prepTime: 10,
    soldCount: 156,
  },
  {
    id: 'item_4',
    name: 'Pepper Rice',
    description: 'Spicy pepper-infused rice with vegetables',
    price: 2200,
    category: 'Main Courses',
    available: true,
    prepTime: 13,
    soldCount: 187,
  },
  {
    id: 'item_5',
    name: 'Shawarma Wrap',
    description: 'Grilled meat in soft pita bread with sauce',
    price: 1500,
    category: 'Fast Bites',
    available: true,
    prepTime: 8,
    soldCount: 412,
  },
  {
    id: 'item_6',
    name: 'Suya Meat (500g)',
    description: 'Spicy grilled meat strips with onions',
    price: 2000,
    category: 'Fast Bites',
    available: true,
    prepTime: 12,
    soldCount: 267,
  },
  {
    id: 'item_7',
    name: 'Akara & Bread',
    description: 'Golden fried bean balls with soft bread',
    price: 800,
    category: 'Breakfast',
    available: true,
    prepTime: 6,
    soldCount: 89,
  },
  {
    id: 'item_8',
    name: 'Amala & Ewedu',
    description: 'Yam flour dish with okra soup',
    price: 1900,
    category: 'Main Courses',
    available: false,
    prepTime: 20,
    soldCount: 134,
  },
  {
    id: 'item_9',
    name: 'Fresh Pineapple Juice',
    description: 'Freshly blended pineapple juice',
    price: 500,
    category: 'Drinks',
    available: true,
    prepTime: 2,
    soldCount: 892,
  },
  {
    id: 'item_10',
    name: 'Zobo Drink',
    description: 'Hibiscus juice with spices (cold)',
    price: 400,
    category: 'Drinks',
    available: true,
    prepTime: 1,
    soldCount: 756,
  },
];

// Generate realistic orders by status
function generateVendorOrder(status: VendorOrder['status'], dayOffset = 0): VendorOrder {
  const customerNames = ['Chioma A.', 'Tunde D.', 'Amara M.', 'Lekan K.', 'Fatima H.', 'Dayo O.', 'Zainab S.', 'Emeka P.'];
  const specialInstructions = [
    'Extra pepper please',
    'No onions, no tomatoes',
    'Make it quick, late for class',
    'Very spicy',
    'Less salt',
    'Add extra meat',
  ];

  const customerName = customerNames[Math.floor(Math.random() * customerNames.length)];
  const randomItems = mockMenuItems.sort(() => Math.random() - 0.5).slice(0, Math.floor(Math.random() * 3) + 1);
  
  let totalAmount = randomItems.reduce((sum, item) => sum + item.price, 0);
  const deliveryFee = 200;
  totalAmount += deliveryFee;

  const createdAt = new Date();
  createdAt.setDate(createdAt.getDate() - dayOffset);
  createdAt.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60), 0);

  const estimatedPrepTime = Math.floor(Math.random() * 15) + 8;
  
  const acceptedAt = ['accepted', 'preparing', 'ready', 'handed_to_rider', 'completed'].includes(status)
    ? new Date(createdAt.getTime() + Math.random() * 5 * 60000)
    : undefined;

  const readyAt = ['ready', 'handed_to_rider', 'completed'].includes(status)
    ? new Date(acceptedAt!.getTime() + estimatedPrepTime * 60000 + Math.random() * 5 * 60000)
    : undefined;

  const completedAt = status === 'completed' ? new Date(readyAt!.getTime() + Math.random() * 10 * 60000) : undefined;

  return {
    id: `order_${Math.random().toString(36).substr(2, 9)}`,
    orderId: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
    customerName,
    customerPhone: `+234${Math.floor(7000000000 + Math.random() * 9000000000)}`,
    items: randomItems.map((item) => ({
      itemId: item.id,
      itemName: item.name,
      quantity: Math.floor(Math.random() * 3) + 1,
      unitPrice: item.price,
      subtotal: item.price * (Math.floor(Math.random() * 3) + 1),
    })),
    totalAmount,
    deliveryFee,
    status,
    specialInstructions: Math.random() > 0.6 ? specialInstructions[Math.floor(Math.random() * specialInstructions.length)] : undefined,
    createdAt,
    acceptedAt,
    readyAt,
    completedAt,
    estimatedPrepTime,
    actualPrepTime: completedAt ? Math.floor((completedAt.getTime() - acceptedAt!.getTime()) / 60000) : undefined,
    paymentMethod: ['card', 'wallet', 'cash'][Math.floor(Math.random() * 3)] as any,
    paymentStatus: Math.random() > 0.1 ? 'confirmed' : 'pending',
  };
}

export function getMockVendorOrders(status?: VendorOrder['status']): VendorOrder[] {
  const allOrders: VendorOrder[] = [];

  // Generate new orders
  for (let i = 0; i < 3; i++) {
    allOrders.push(generateVendorOrder('new'));
  }

  // Generate accepted
  for (let i = 0; i < 2; i++) {
    allOrders.push(generateVendorOrder('accepted'));
  }

  // Generate preparing
  for (let i = 0; i < 3; i++) {
    allOrders.push(generateVendorOrder('preparing'));
  }

  // Generate ready
  for (let i = 0; i < 2; i++) {
    allOrders.push(generateVendorOrder('ready'));
  }

  // Generate handed to rider (last 2 hours)
  for (let i = 0; i < 5; i++) {
    allOrders.push(generateVendorOrder('handed_to_rider', 0));
  }

  // Generate completed (today & yesterday)
  for (let i = 0; i < 25; i++) {
    const dayOffset = Math.random() > 0.8 ? 1 : 0;
    allOrders.push(generateVendorOrder('completed', dayOffset));
  }

  // Generate cancelled (occasional)
  for (let i = 0; i < 3; i++) {
    allOrders.push(generateVendorOrder('cancelled', Math.floor(Math.random() * 3)));
  }

  return status ? allOrders.filter((order) => order.status === status) : allOrders;
}

export function getMockVendorProfile(): VendorProfile {
  return {
    id: 'vendor_001',
    name: 'Mama Chidi\'s Kitchen',
    phone: '+2348012345678',
    email: 'mamachidi@foodieexpress.com',
    businessRegistration: 'CAC/BN 1234567',
    hygieneCertificate: 'HC/2024/001',
    governmentId: 'NIN-12345678901',
    location: 'Hostel A Close, Campus',
    campusLocation: 'Covenant University',
    businessHours: {
      startTime: '06:00',
      endTime: '22:00',
    },
    pickupPoints: [
      {
        id: 'pp_1',
        name: 'Hostel A Gate',
        coordinates: { lat: 6.6743, lng: 3.2479 },
      },
      {
        id: 'pp_2',
        name: 'Cafeteria',
        coordinates: { lat: 6.6752, lng: 3.2485 },
      },
    ],
    averageRating: 4.8,
    totalOrders: 1247,
    acceptanceRate: 98,
    kycStatus: 'verified',
    busyMode: false,
    maxQueueCapacity: 15,
    currentQueueSize: 5,
  };
}

export function getMockVendorStats(): VendorStats {
  return {
    totalOrders: 1247,
    pendingOrders: 3,
    completedOrders: 1198,
    cancelledOrders: 46,
    averageRating: 4.8,
    acceptanceRate: 98,
    totalEarnings: 2856000,
    todayEarnings: 89500,
  };
}

export function getMockVendorEarnings(): VendorEarnings {
  return {
    totalEarnings: 2856000,
    todayEarnings: 89500,
    weeklyEarnings: 542300,
    monthlyEarnings: 1876400,
    commissionRate: 10,
    totalCommission: 285600,
    pendingPayout: 125000,
    lastPayoutDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    nextPayoutDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  };
}

export function getMockVendorPayouts(): VendorPayout[] {
  return [
    {
      id: 'payout_1',
      amount: 500000,
      status: 'completed',
      requestedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      completedAt: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000),
      bankAccount: {
        accountName: 'Chidi Okafor',
        accountNumber: '1234567890',
        bankName: 'Zenith Bank',
        bankCode: '057',
      },
      transactionRef: 'TRX-2024-001',
    },
    {
      id: 'payout_2',
      amount: 450000,
      status: 'completed',
      requestedAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
      completedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
      bankAccount: {
        accountName: 'Chidi Okafor',
        accountNumber: '1234567890',
        bankName: 'Zenith Bank',
        bankCode: '057',
      },
      transactionRef: 'TRX-2024-002',
    },
    {
      id: 'payout_3',
      amount: 380000,
      status: 'completed',
      requestedAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000),
      completedAt: new Date(Date.now() - 27 * 24 * 60 * 60 * 1000),
      bankAccount: {
        accountName: 'Chidi Okafor',
        accountNumber: '1234567890',
        bankName: 'Zenith Bank',
        bankCode: '057',
      },
      transactionRef: 'TRX-2024-003',
    },
  ];
}

export function getMockVendorBankDetails(): BankDetail {
  return {
    accountName: 'Chidi Okafor',
    accountNumber: '1234567890',
    bankName: 'Zenith Bank',
    bankCode: '057',
    bvn: '11223344556',
  };
}

export function getMockAnalytics(days = 7): VendorAnalytics[] {
  const analytics: VendorAnalytics[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    const ordersCount = Math.floor(Math.random() * 40) + 30;
    const avgOrderValue = 2500;
    const totalRevenue = ordersCount * avgOrderValue;
    const completedOrders = Math.floor(ordersCount * 0.95);
    const cancelledOrders = Math.floor(ordersCount * 0.05);

    const topItems = mockMenuItems.sort(() => Math.random() - 0.5).slice(0, 5);

    const peakHours = [
      { hour: 7, orderCount: 8 },
      { hour: 12, orderCount: 22 },
      { hour: 13, orderCount: 18 },
      { hour: 18, orderCount: 15 },
      { hour: 19, orderCount: 12 },
    ];

    analytics.push({
      date: date.toISOString().split('T')[0],
      ordersCount,
      totalRevenue,
      averageOrderValue: avgOrderValue,
      completedOrders,
      cancelledOrders,
      topItems,
      peakHours,
    });
  }

  return analytics;
}
