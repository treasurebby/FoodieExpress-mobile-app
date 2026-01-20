// Realistic mock data for Rider App

export interface MockOrder {
  id: string;
  status: 'pending' | 'accepted' | 'picking_up' | 'delivering' | 'completed' | 'cancelled';
  customer: {
    name: string;
    phone: string;
    address: string;
    location: { lat: number; lng: number };
    photo?: string;
  };
  vendor: {
    name: string;
    address: string;
    location: { lat: number; lng: number };
  };
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  deliveryFee: number;
  distance: number; // in km
  estimatedTime: number; // in minutes
  createdAt: Date;
  acceptedAt?: Date;
  completedAt?: Date;
  rating?: number;
  tip?: number;
}

export interface DailyEarnings {
  date: Date;
  totalEarnings: number;
  deliveries: number;
  tips: number;
}

const customerNames = [
  'Chioma Okafor', 'Emmanuel Adeyemi', 'Blessing Nwosu', 'David Eze',
  'Grace Oladipo', 'Michael Okoro', 'Faith Adeleke', 'John Mensah',
  'Aisha Ibrahim', 'Samuel Obi', 'Mercy Williams', 'Daniel Udeh'
];

const vendorNames = [
  'Mama Put Kitchen', 'The Shawarma Spot', 'Campus Buka', 'Rice & More',
  'Fast Bites Cafe', 'Student Meals Hub', 'Burger Palace', 'Noodles Express',
  'Chicken Republic', 'Pizza Corner', 'Smoothie Bar', 'Jollof House'
];

const foodItems = [
  { name: 'Jollof Rice & Chicken', price: 1500 },
  { name: 'Fried Rice Combo', price: 1800 },
  { name: 'Shawarma', price: 1200 },
  { name: 'Chicken & Chips', price: 2000 },
  { name: 'Indomie Special', price: 800 },
  { name: 'Amala & Ewedu', price: 1000 },
  { name: 'Burger Meal', price: 2500 },
  { name: 'Pizza (Medium)', price: 3500 },
  { name: 'Smoothie Bowl', price: 1500 },
  { name: 'Eba & Egusi', price: 1200 }
];

const addresses = [
  'Block A, Room 204, Female Hostel',
  'Block B, Room 315, Male Hostel',
  'Faculty of Engineering, Lecture Hall 2',
  'Library, Ground Floor',
  'Sports Complex, Main Gate',
  'Chapel Road, Near SUG Office',
  'Student Center, Food Court',
  'Block C, Room 108, PG Hostel'
];

// Generate random order
export const generateMockOrder = (status: MockOrder['status'] = 'pending'): MockOrder => {
  const customerName = customerNames[Math.floor(Math.random() * customerNames.length)];
  const vendorName = vendorNames[Math.floor(Math.random() * vendorNames.length)];
  const address = addresses[Math.floor(Math.random() * addresses.length)];
  
  const numItems = Math.floor(Math.random() * 3) + 1;
  const items = Array.from({ length: numItems }, () => {
    const item = foodItems[Math.floor(Math.random() * foodItems.length)];
    return {
      ...item,
      quantity: Math.floor(Math.random() * 2) + 1
    };
  });
  
  const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = Math.floor(Math.random() * 200) + 200; // 200-400
  const distance = parseFloat((Math.random() * 2 + 0.5).toFixed(1)); // 0.5-2.5km
  const estimatedTime = Math.floor(distance * 5) + Math.floor(Math.random() * 10) + 10; // 10-30 mins
  
  const createdAt = new Date();
  createdAt.setMinutes(createdAt.getMinutes() - Math.floor(Math.random() * 30));
  
  return {
    id: `ORD${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    status,
    customer: {
      name: customerName,
      phone: `+234${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      address,
      location: {
        lat: 6.6787 + (Math.random() * 0.01 - 0.005),
        lng: 3.1684 + (Math.random() * 0.01 - 0.005)
      }
    },
    vendor: {
      name: vendorName,
      address: 'Campus Food Court, Building 3',
      location: {
        lat: 6.6787,
        lng: 3.1684
      }
    },
    items,
    totalAmount,
    deliveryFee,
    distance,
    estimatedTime,
    createdAt,
    ...(status !== 'pending' && { acceptedAt: new Date(createdAt.getTime() + 60000) }),
    ...(status === 'completed' && { 
      completedAt: new Date(createdAt.getTime() + estimatedTime * 60000),
      rating: Math.floor(Math.random() * 2) + 4, // 4-5 stars
      tip: Math.random() > 0.7 ? Math.floor(Math.random() * 300) + 100 : 0
    })
  };
};

// Generate multiple orders
export const generateMockOrders = (count: number, status?: MockOrder['status']): MockOrder[] => {
  return Array.from({ length: count }, () => generateMockOrder(status));
};

// Get today's earnings
export const getTodayEarnings = (): { total: number; deliveries: number; tips: number } => {
  const deliveries = Math.floor(Math.random() * 8) + 3; // 3-10 deliveries
  const avgDeliveryFee = 300;
  const tips = Math.floor(Math.random() * 1000);
  
  return {
    total: deliveries * avgDeliveryFee + tips,
    deliveries,
    tips
  };
};

// Get weekly earnings
export const getWeeklyEarnings = (): DailyEarnings[] => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map((_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    const deliveries = Math.floor(Math.random() * 12) + 2;
    const avgFee = 300;
    const tips = Math.floor(Math.random() * 800);
    
    return {
      date,
      totalEarnings: deliveries * avgFee + tips,
      deliveries,
      tips
    };
  });
};

// Rider stats
export const getRiderStats = () => ({
  acceptanceRate: Math.floor(Math.random() * 10) + 90, // 90-100%
  averageRating: parseFloat((4.5 + Math.random() * 0.5).toFixed(1)), // 4.5-5.0
  totalDeliveries: Math.floor(Math.random() * 200) + 50, // 50-250
  totalEarnings: Math.floor(Math.random() * 50000) + 20000, // 20k-70k
  pendingPayout: Math.floor(Math.random() * 5000) + 2000 // 2k-7k
});

// Mock chat messages
export interface ChatMessage {
  id: string;
  sender: 'rider' | 'customer';
  message: string;
  timestamp: Date;
  read: boolean;
}

export const generateChatMessages = (orderId: string): ChatMessage[] => {
  const messages = [
    { sender: 'customer', message: 'Please deliver to Block A entrance', timestamp: -5 },
    { sender: 'rider', message: "I'm on my way to pick up your order", timestamp: -3 },
    { sender: 'customer', message: 'Thank you! How long?', timestamp: -2 },
    { sender: 'rider', message: 'About 10 minutes', timestamp: -1 }
  ];
  
  return messages.map((msg, index) => {
    const time = new Date();
    time.setMinutes(time.getMinutes() + (msg.timestamp as number));
    return {
      id: `MSG${index}${orderId}`,
      sender: msg.sender as 'rider' | 'customer',
      message: msg.message,
      timestamp: time,
      read: true
    };
  });
};

export const quickReplies = [
  "I'm on my way to pick up your order",
  "I've picked up your order, heading to you now",
  "I'm outside. Please come to the gate",
  "Delivered! Enjoy your meal 😊",
  "Running a bit late, sorry for the delay",
  "Could you send your exact location?"
];
