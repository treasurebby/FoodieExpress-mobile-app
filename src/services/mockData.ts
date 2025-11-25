// Mock data for restaurants and categories
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

export interface Category {
        id: string;
        name: string;
        image: string;
}

export const categories: Category[] = [
    {
        id: '1',
        name: 'Jollof',
        image: 'https://images.unsplash.com/photo-1625220194771-05ece7f8c721?w=400&h=400&fit=crop&crop=center',
    },
    {
        id: '2',
        name: 'Shawarma',
        image: 'https://images.unsplash.com/photo-1626082927389-7a0e4c1c2a5e?w=400&h=400&fit=crop&crop=center',
    },
    {
        id: '3',
        name: 'Amala & Ewedu',
        image: 'https://images.unsplash.com/photo-1631515700089-3d0c07e88f9d?w=400&h=400&fit=crop&crop=center',
    },
    {
        id: '4',
        name: 'Suya',
        image: 'https://images.unsplash.com/photo-1626645738679-5c6e5c8d5e2f?w=400&h=400&fit=crop&crop=center',
    },
    {
        id: '5',
        name: 'Swallow',
        image: 'https://images.unsplash.com/photo-1626082936356-8e0182e4e5b0?w=400&h=400&fit=crop&crop=center',
    },
    {
        id: '6',
        name: 'Rice Meals',
        image: 'https://images.unsplash.com/photo-1603133875751-8e7d1e7b8b5c?w=400&h=400&fit=crop&crop=center',
    },
    {
        id: '7',
        name: 'Snacks',
        image: 'https://images.unsplash.com/photo-1621939514642-280e4b3f2e6c?w=400&h=400&fit=crop&crop=center',
    },
    {
        id: '8',
        name: 'Pepper Soup',
        image: 'https://images.unsplash.com/photo-1631515700089-3d0c07e88f9d?w=400&h=400&fit=crop&crop=center',
    },
];

export const restaurants: Restaurant[] = [
    {
        id: 'r1',
        name: 'Bukka Republic – PG Cafeteria',
        location: 'PG Cafeteria',
        image: 'https://images.unsplash.com/photo-1603893693585-e5f94b5b13de?w=800',
        rating: 4.6,
        deliveryTime: '25-35 min',
        cuisine: ['Local Nigerian Dishes'],
        distance: '2.1 km',
        priceRange: '$',
        isBusy: false,
        prepTime: 25,
        menu: [
            { id: 'r1m1', name: 'Jollof Rice + Chicken', description: '', price: 2500, image: 'https://images.unsplash.com/photo-1603893693585-e5f94b5b13de?w=800', category: 'Local Nigerian Dishes', available: true },
            { id: 'r1m2', name: 'Fried Rice + Turkey', description: '', price: 3000, image: 'https://images.unsplash.com/photo-1603893693585-e5f94b5b13de?w=800', category: 'Local Nigerian Dishes', available: true },
            { id: 'r1m3', name: 'Ofada Rice + Ayamase', description: '', price: 2800, image: 'https://images.unsplash.com/photo-1603893693585-e5f94b5b13de?w=800', category: 'Local Nigerian Dishes', available: true },
            { id: 'r1m4', name: 'Efo Riro + Swallow', description: '', price: 2200, image: 'https://images.unsplash.com/photo-1603893693585-e5f94b5b13de?w=800', category: 'Local Nigerian Dishes', available: true },
            { id: 'r1m5', name: 'Beans & Dodo Special', description: '', price: 1800, image: 'https://images.unsplash.com/photo-1603893693585-e5f94b5b13de?w=800', category: 'Local Nigerian Dishes', available: true },
        ],
    },
    {
        id: 'r2',
        name: 'Shawarma Plug – Cafeteria 1',
        location: 'Cafeteria 1',
        image: 'https://images.unsplash.com/photo-1606755962773-d324e0a130b5?w=800',
        rating: 4.5,
        deliveryTime: '20-30 min',
        cuisine: ['Shawarma', 'Grills'],
        distance: '5.2 km',
        priceRange: '$',
        isBusy: false,
        prepTime: 20,
        menu: [
            { id: 'r2m1', name: 'Chicken Shawarma (Spicy)', description: '', price: 1200, image: 'https://images.unsplash.com/photo-1606755962773-d324e0a130b5?w=800', category: 'Shawarma', available: true },
            { id: 'r2m2', name: 'Chicken Shawarma (Mild)', description: '', price: 1200, image: 'https://images.unsplash.com/photo-1606755962773-d324e0a130b5?w=800', category: 'Shawarma', available: true },
            { id: 'r2m3', name: 'Beef Shawarma', description: '', price: 1300, image: 'https://images.unsplash.com/photo-1606755962773-d324e0a130b5?w=800', category: 'Shawarma', available: true },
            { id: 'r2m4', name: 'Mixed Shawarma', description: '', price: 1600, image: 'https://images.unsplash.com/photo-1606755962773-d324e0a130b5?w=800', category: 'Shawarma', available: true },
            { id: 'r2m5', name: 'Loaded Shawarma + Sausage', description: '', price: 2000, image: 'https://images.unsplash.com/photo-1606755962773-d324e0a130b5?w=800', category: 'Shawarma', available: true },
            { id: 'r2m6', name: 'BBQ Chicken Wings', description: '', price: 1500, image: 'https://images.unsplash.com/photo-1606755962773-d324e0a130b5?w=800', category: 'Grills', available: true },
        ],
    },
    {
        id: 'r3',
        name: 'The Amala Room – Cafeteria 2',
        location: 'Cafeteria 2',
        image: 'https://images.unsplash.com/photo-1627662057411-3b9c7a509a68?w=800',
        rating: 4.7,
        deliveryTime: '20-30 min',
        cuisine: ['Yoruba Food'],
        distance: '3.4 km',
        priceRange: '$',
        isBusy: false,
        prepTime: 22,
        menu: [
            { id: 'r3m1', name: 'Amala + Abula', description: '', price: 2000, image: 'https://images.unsplash.com/photo-1627662057411-3b9c7a509a68?w=800', category: 'Yoruba Food', available: true },
            { id: 'r3m2', name: 'Gbegiri + Ewedu', description: '', price: 1800, image: 'https://images.unsplash.com/photo-1627662057411-3b9c7a509a68?w=800', category: 'Yoruba Food', available: true },
            { id: 'r3m3', name: 'Goat Meat Pepper Soup', description: '', price: 1700, image: 'https://images.unsplash.com/photo-1627662057411-3b9c7a509a68?w=800', category: 'Yoruba Food', available: true },
            { id: 'r3m4', name: 'Pounded Yam + Egusi', description: '', price: 2300, image: 'https://images.unsplash.com/photo-1627662057411-3b9c7a509a68?w=800', category: 'Yoruba Food', available: true },
            { id: 'r3m5', name: 'Assorted Meat Tray', description: '', price: 3500, image: 'https://images.unsplash.com/photo-1627662057411-3b9c7a509a68?w=800', category: 'Yoruba Food', available: true },
        ],
    },
    {
        id: 'r4',
        name: 'Mainland Kitchen – Cafeteria 1',
        location: 'Cafeteria 1',
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
        rating: 4.4,
        deliveryTime: '25-35 min',
        cuisine: ['Rice', 'Pasta', 'Combos'],
        distance: '6.0 km',
        priceRange: '$$',
        isBusy: false,
        prepTime: 28,
        menu: [
            { id: 'r4m1', name: 'Jollof & Grilled Turkey', description: '', price: 3200, image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800', category: 'Rice & Combos', available: true },
            { id: 'r4m2', name: 'Spaghetti Jollof + Fried Chicken', description: '', price: 2800, image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800', category: 'Rice & Pasta', available: true },
            { id: 'r4m3', name: 'Coconut Rice + Fish', description: '', price: 3000, image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800', category: 'Rice & Combos', available: true },
            { id: 'r4m4', name: 'Stir Fry Pasta', description: '', price: 2200, image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800', category: 'Pasta', available: true },
            { id: 'r4m5', name: 'Beef Stir-Fry Noodles', description: '', price: 2500, image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800', category: 'Noodles', available: true },
        ],
    },
    {
        id: 'r5',
        name: 'ColdBox Smoothies – Cafeteria 2',
        location: 'Cafeteria 2',
        image: 'https://images.unsplash.com/photo-1577803645773-f96470509666?w=800',
        rating: 4.6,
        deliveryTime: '15-25 min',
        cuisine: ['Healthy', 'Smoothies'],
        distance: '7.1 km',
        priceRange: '$',
        isBusy: false,
        prepTime: 12,
        menu: [
            { id: 'r5m1', name: 'Banana Burst', description: '', price: 900, image: 'https://images.unsplash.com/photo-1577803645773-f96470509666?w=800', category: 'Smoothies', available: true },
            { id: 'r5m2', name: 'Berry Mix', description: '', price: 1000, image: 'https://images.unsplash.com/photo-1577803645773-f96470509666?w=800', category: 'Smoothies', available: true },
            { id: 'r5m3', name: 'Mango Pine Cooler', description: '', price: 950, image: 'https://images.unsplash.com/photo-1577803645773-f96470509666?w=800', category: 'Smoothies', available: true },
            { id: 'r5m4', name: 'Green Detox Smoothie', description: '', price: 1100, image: 'https://images.unsplash.com/photo-1577803645773-f96470509666?w=800', category: 'Smoothies', available: true },
            { id: 'r5m5', name: 'Parfait Bowl', description: '', price: 1400, image: 'https://images.unsplash.com/photo-1577803645773-f96470509666?w=800', category: 'Healthy', available: true },
        ],
    },
    {
        id: 'r6',
        name: 'Captain Fried Chicken – PG Cafeteria',
        location: 'PG Cafeteria',
        image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=800',
        rating: 4.3,
        deliveryTime: '20-30 min',
        cuisine: ['Fast Food'],
        distance: '12.3 km',
        priceRange: '$',
        isBusy: false,
        prepTime: 18,
        menu: [
            { id: 'r6m1', name: 'Chicken Bucket', description: '', price: 2500, image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=800', category: 'Fast Food', available: true },
            { id: 'r6m2', name: 'Fries + Chicken Strips', description: '', price: 1500, image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=800', category: 'Fast Food', available: true },
            { id: 'r6m3', name: 'Zinger Burger', description: '', price: 1300, image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=800', category: 'Burgers', available: true },
            { id: 'r6m4', name: 'BBQ Chicken Rice', description: '', price: 1800, image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=800', category: 'Rice', available: true },
            { id: 'r6m5', name: 'Crispy Chicken Wrap', description: '', price: 1400, image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=800', category: 'Wraps', available: true },
        ],
    },
    {
        id: 'r7',
        name: "Mama Nkechi’s Kitchen – PG Cafeteria",
        location: 'PG Cafeteria',
        image: 'https://images.unsplash.com/photo-1603893693585-e5f94b5b13de?w=800',
        rating: 4.5,
        deliveryTime: '30-40 min',
        cuisine: ['Igbo Food'],
        distance: '9.5 km',
        priceRange: '$',
        isBusy: false,
        prepTime: 25,
        menu: [
            { id: 'r7m1', name: 'Abacha Deluxe', description: '', price: 1200, image: 'https://images.unsplash.com/photo-1603893693585-e5f94b5b13de?w=800', category: 'Igbo Food', available: true },
            { id: 'r7m2', name: 'Ofe Akwu + Rice', description: '', price: 1500, image: 'https://images.unsplash.com/photo-1603893693585-e5f94b5b13de?w=800', category: 'Igbo Food', available: true },
            { id: 'r7m3', name: 'Fisherman Soup', description: '', price: 2000, image: 'https://images.unsplash.com/photo-1603893693585-e5f94b5b13de?w=800', category: 'Soups', available: true },
            { id: 'r7m4', name: 'Okpa Special', description: '', price: 900, image: 'https://images.unsplash.com/photo-1603893693585-e5f94b5b13de?w=800', category: 'Local', available: true },
            { id: 'r7m5', name: 'Ukwa (Breadfruit) Bowl', description: '', price: 1400, image: 'https://images.unsplash.com/photo-1603893693585-e5f94b5b13de?w=800', category: 'Local', available: true },
        ],
    },
    {
        id: 'r8',
        name: 'Chow City Pasta – Cafeteria 2',
        location: 'Cafeteria 2',
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
        rating: 4.4,
        deliveryTime: '20-30 min',
        cuisine: ['Pasta & Noodles'],
        distance: '2.2 km',
        priceRange: '$',
        isBusy: false,
        prepTime: 20,
        menu: [
            { id: 'r8m1', name: 'Alfredo Pasta', description: '', price: 1400, image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800', category: 'Pasta', available: true },
            { id: 'r8m2', name: 'Chicken Stir Fry Noodles', description: '', price: 1300, image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800', category: 'Noodles', available: true },
            { id: 'r8m3', name: 'Spaghetti Bolognese', description: '', price: 1500, image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800', category: 'Pasta', available: true },
            { id: 'r8m4', name: 'Creamy Mushroom Pasta', description: '', price: 1600, image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800', category: 'Pasta', available: true },
            { id: 'r8m5', name: 'Jumbo Shrimp Pasta', description: '', price: 2200, image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800', category: 'Pasta', available: true },
        ],
    },
    {
        id: 'r9',
        name: 'Suya Master – PG Cafeteria',
        location: 'PG Cafeteria',
        image: 'https://images.unsplash.com/photo-1606755962773-d324e0a130b5?w=800',
        rating: 4.6,
        deliveryTime: '25-35 min',
        cuisine: ['Suya', 'Grills'],
        distance: '8.0 km',
        priceRange: '$',
        isBusy: false,
        prepTime: 18,
        menu: [
            { id: 'r9m1', name: 'Beef Suya', description: '', price: 1200, image: 'https://images.unsplash.com/photo-1606755962773-d324e0a130b5?w=800', category: 'Suya', available: true },
            { id: 'r9m2', name: 'Chicken Suya', description: '', price: 1100, image: 'https://images.unsplash.com/photo-1606755962773-d324e0a130b5?w=800', category: 'Suya', available: true },
            { id: 'r9m3', name: 'Ram Suya', description: '', price: 1400, image: 'https://images.unsplash.com/photo-1606755962773-d324e0a130b5?w=800', category: 'Suya', available: true },
            { id: 'r9m4', name: 'Suya Sandwich', description: '', price: 1000, image: 'https://images.unsplash.com/photo-1606755962773-d324e0a130b5?w=800', category: 'Sandwiches', available: true },
            { id: 'r9m5', name: 'Spicy Suya Platter', description: '', price: 2500, image: 'https://images.unsplash.com/photo-1606755962773-d324e0a130b5?w=800', category: 'Suya', available: true },
        ],
    },
    {
        id: 'r10',
        name: 'Eko Bites Café – Cafeteria 2',
        location: 'Cafeteria 2',
        image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=800',
        rating: 4.3,
        deliveryTime: '18-28 min',
        cuisine: ['Café', 'Snacks', 'Breakfast'],
        distance: '5.5 km',
        priceRange: '$',
        isBusy: false,
        prepTime: 15,
        menu: [
            { id: 'r10m1', name: 'Pancakes + Syrup', description: '', price: 1200, image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=800', category: 'Breakfast', available: true },
            { id: 'r10m2', name: 'Toast + Eggs', description: '', price: 900, image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=800', category: 'Breakfast', available: true },
            { id: 'r10m3', name: 'Chicken Panini', description: '', price: 1300, image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=800', category: 'Snacks', available: true },
            { id: 'r10m4', name: 'Hot Chocolate', description: '', price: 700, image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=800', category: 'Drinks', available: true },
            { id: 'r10m5', name: 'Croissant Pack', description: '', price: 1000, image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=800', category: 'Bakery', available: true },
        ],
    },
    {
        id: 'r11',
        name: 'PepperHouse – Cafeteria 1',
        location: 'Cafeteria 1',
        image: 'https://images.unsplash.com/photo-1603893693585-e5f94b5b13de?w=800',
        rating: 4.2,
        deliveryTime: '22-32 min',
        cuisine: ['Pepper-based Nigerian Food'],
        distance: '4.0 km',
        priceRange: '$',
        isBusy: false,
        prepTime: 20,
        menu: [
            { id: 'r11m1', name: 'Asun Rice', description: '', price: 2000, image: 'https://images.unsplash.com/photo-1603893693585-e5f94b5b13de?w=800', category: 'Pepper Dishes', available: true },
            { id: 'r11m2', name: 'Gizdodo Bowl', description: '', price: 1800, image: 'https://images.unsplash.com/photo-1603893693585-e5f94b5b13de?w=800', category: 'Pepper Dishes', available: true },
            { id: 'r11m3', name: 'Pepper Rice + Turkey', description: '', price: 3000, image: 'https://images.unsplash.com/photo-1603893693585-e5f94b5b13de?w=800', category: 'Pepper Dishes', available: true },
            { id: 'r11m4', name: 'Yam Pottage', description: '', price: 1500, image: 'https://images.unsplash.com/photo-1603893693585-e5f94b5b13de?w=800', category: 'Local', available: true },
            { id: 'r11m5', name: 'Goat Meat Stew Combo', description: '', price: 3200, image: 'https://images.unsplash.com/photo-1603893693585-e5f94b5b13de?w=800', category: 'Local', available: true },
        ],
    },
    {
        id: 'r12',
        name: 'Street Bites Burger Co – PG Cafeteria',
        location: 'PG Cafeteria',
        image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=800',
        rating: 4.1,
        deliveryTime: '18-28 min',
        cuisine: ['Burgers', 'Snacks'],
        distance: '6.2 km',
        priceRange: '$',
        isBusy: false,
        prepTime: 15,
        menu: [
            { id: 'r12m1', name: 'Classic Beef Burger', description: '', price: 1500, image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=800', category: 'Burgers', available: true },
            { id: 'r12m2', name: 'Chicken Crispy Burger', description: '', price: 1400, image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=800', category: 'Burgers', available: true },
            { id: 'r12m3', name: 'Double Stack Cheeseburger', description: '', price: 2000, image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=800', category: 'Burgers', available: true },
            { id: 'r12m4', name: 'Sweet Potato Fries', description: '', price: 700, image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=800', category: 'Sides', available: true },
            { id: 'r12m5', name: 'Loaded Fries', description: '', price: 900, image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=800', category: 'Sides', available: true },
        ],
    },
    {
        id: 'r13',
        name: 'Afang & More – Cafeteria 2',
        location: 'Cafeteria 2',
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
        rating: 4.5,
        deliveryTime: '25-35 min',
        cuisine: ['Calabar Dishes'],
        distance: '3.8 km',
        priceRange: '$',
        isBusy: false,
        prepTime: 22,
        menu: [
            { id: 'r13m1', name: 'Afang Soup + Swallow', description: '', price: 2000, image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800', category: 'Calabar', available: true },
            { id: 'r13m2', name: 'Edikang Ikong', description: '', price: 2200, image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800', category: 'Calabar', available: true },
            { id: 'r13m3', name: 'Fisherman Soup', description: '', price: 2400, image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800', category: 'Seafood', available: true },
            { id: 'r13m4', name: 'Native Rice', description: '', price: 1800, image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800', category: 'Local', available: true },
            { id: 'r13m5', name: 'Palm Oil Stew', description: '', price: 1600, image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800', category: 'Local', available: true },
        ],
    },
    {
        id: 'r14',
        name: 'ChowWok Express – Cafeteria 1',
        location: 'Cafeteria 1',
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
        rating: 4.3,
        deliveryTime: '20-30 min',
        cuisine: ['Asian Fusion'],
        distance: '5.3 km',
        priceRange: '$',
        isBusy: false,
        prepTime: 20,
        menu: [
            { id: 'r14m1', name: 'Chicken Fried Rice', description: '', price: 1200, image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800', category: 'Asian', available: true },
            { id: 'r14m2', name: 'Beef Noodles', description: '', price: 1300, image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800', category: 'Asian', available: true },
            { id: 'r14m3', name: 'Kung Pao Chicken', description: '', price: 1500, image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800', category: 'Asian', available: true },
            { id: 'r14m4', name: 'Sweet & Sour Chicken', description: '', price: 1500, image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800', category: 'Asian', available: true },
            { id: 'r14m5', name: 'Asian Stir-Fry Box', description: '', price: 1400, image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800', category: 'Asian', available: true },
        ],
    },
    {
        id: 'r15',
        name: 'Tasty Bakes Pastry Hub – Cafeteria 1',
        location: 'Cafeteria 1',
        image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=800',
        rating: 4.4,
        deliveryTime: '15-25 min',
        cuisine: ['Pastries', 'Cakes'],
        distance: '2.0 km',
        priceRange: '$',
        isBusy: false,
        prepTime: 12,
        menu: [
            { id: 'r15m1', name: 'Meat Pie', description: '', price: 400, image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=800', category: 'Pastries', available: true },
            { id: 'r15m2', name: 'Chicken Pie', description: '', price: 400, image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=800', category: 'Pastries', available: true },
            { id: 'r15m3', name: 'Chocolate Donuts', description: '', price: 300, image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=800', category: 'Desserts', available: true },
            { id: 'r15m4', name: 'Mini Cakes', description: '', price: 600, image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=800', category: 'Desserts', available: true },
            { id: 'r15m5', name: 'Sausage Rolls', description: '', price: 350, image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=800', category: 'Pastries', available: true },
        ],
    },
    {
        id: 'r16',
        name: 'Zobo & Grill – Cafeteria 1',
        location: 'Cafeteria 1',
        image: 'https://images.unsplash.com/photo-1577803645773-f96470509666?w=800',
        rating: 4.2,
        deliveryTime: '20-30 min',
        cuisine: ['Drinks', 'Grills'],
        distance: '11.0 km',
        priceRange: '$',
        isBusy: false,
        prepTime: 14,
        menu: [
            { id: 'r16m1', name: 'Chilled Zobo', description: '', price: 500, image: 'https://images.unsplash.com/photo-1577803645773-f96470509666?w=800', category: 'Drinks', available: true },
            { id: 'r16m2', name: 'Pineapple Zobo', description: '', price: 500, image: 'https://images.unsplash.com/photo-1577803645773-f96470509666?w=800', category: 'Drinks', available: true },
            { id: 'r16m3', name: 'Grilled Chicken', description: '', price: 1600, image: 'https://images.unsplash.com/photo-1577803645773-f96470509666?w=800', category: 'Grills', available: true },
            { id: 'r16m4', name: 'Spicy Beef Kebab', description: '', price: 1300, image: 'https://images.unsplash.com/photo-1577803645773-f96470509666?w=800', category: 'Grills', available: true },
            { id: 'r16m5', name: 'Coconut Chin-Chin', description: '', price: 600, image: 'https://images.unsplash.com/photo-1577803645773-f96470509666?w=800', category: 'Snacks', available: true },
        ],
    },
    {
        id: 'r17',
        name: 'Lagos Bowl – Cafeteria 2',
        location: 'Cafeteria 2',
        image: 'https://images.unsplash.com/photo-1603893693585-e5f94b5b13de?w=800',
        rating: 4.5,
        deliveryTime: '20-30 min',
        cuisine: ['Bowls', 'Healthy'],
        distance: '3.2 km',
        priceRange: '$$',
        isBusy: false,
        prepTime: 18,
        menu: [
            { id: 'r17m1', name: 'Chicken Grain Bowl', description: '', price: 1800, image: 'https://images.unsplash.com/photo-1603893693585-e5f94b5b13de?w=800', category: 'Bowls', available: true },
            { id: 'r17m2', name: 'Beef Protein Bowl', description: '', price: 2000, image: 'https://images.unsplash.com/photo-1603893693585-e5f94b5b13de?w=800', category: 'Bowls', available: true },
            { id: 'r17m3', name: 'Quinoa Salad', description: '', price: 1500, image: 'https://images.unsplash.com/photo-1603893693585-e5f94b5b13de?w=800', category: 'Salads', available: true },
            { id: 'r17m4', name: 'Avocado Salad Mix', description: '', price: 1700, image: 'https://images.unsplash.com/photo-1603893693585-e5f94b5b13de?w=800', category: 'Salads', available: true },
            { id: 'r17m5', name: 'Fit-Bowl Combo', description: '', price: 2200, image: 'https://images.unsplash.com/photo-1603893693585-e5f94b5b13de?w=800', category: 'Bowls', available: true },
        ],
    },
    {
        id: 'r18',
        name: 'Spicy Route Shawarma – Cafeteria 1',
        location: 'Cafeteria 1',
        image: 'https://images.unsplash.com/photo-1606755962773-d324e0a130b5?w=800',
        rating: 4.3,
        deliveryTime: '22-32 min',
        cuisine: ['Shawarma', 'Fast Bites'],
        distance: '10.5 km',
        priceRange: '$',
        isBusy: false,
        prepTime: 20,
        menu: [
            { id: 'r18m1', name: 'Beef Shawarma', description: '', price: 1200, image: 'https://images.unsplash.com/photo-1606755962773-d324e0a130b5?w=800', category: 'Shawarma', available: true },
            { id: 'r18m2', name: 'Chicken Shawarma', description: '', price: 1200, image: 'https://images.unsplash.com/photo-1606755962773-d324e0a130b5?w=800', category: 'Shawarma', available: true },
            { id: 'r18m3', name: 'Sausage Loaded Wrap', description: '', price: 1500, image: 'https://images.unsplash.com/photo-1606755962773-d324e0a130b5?w=800', category: 'Wraps', available: true },
            { id: 'r18m4', name: 'Shawarma Rice', description: '', price: 1400, image: 'https://images.unsplash.com/photo-1606755962773-d324e0a130b5?w=800', category: 'Rice', available: true },
            { id: 'r18m5', name: 'Extra Creamy Shawarma', description: '', price: 1600, image: 'https://images.unsplash.com/photo-1606755962773-d324e0a130b5?w=800', category: 'Shawarma', available: true },
        ],
    },
    {
        id: 'r19',
        name: 'The Fisherman Spot – CMSs',
        location: 'CMSs',
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
        rating: 4.6,
        deliveryTime: '25-35 min',
        cuisine: ['Seafood'],
        distance: '4.8 km',
        priceRange: '$$',
        isBusy: false,
        prepTime: 28,
        menu: [
            { id: 'r19m1', name: 'Grilled Catfish', description: '', price: 2500, image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800', category: 'Seafood', available: true },
            { id: 'r19m2', name: 'Periwinkle Pasta', description: '', price: 2200, image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800', category: 'Seafood', available: true },
            { id: 'r19m3', name: 'Seafood Okra', description: '', price: 2000, image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800', category: 'Seafood', available: true },
            { id: 'r19m4', name: 'Fish Pepper Soup', description: '', price: 1800, image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800', category: 'Soups', available: true },
            { id: 'r19m5', name: 'Fisherman Rice', description: '', price: 2300, image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800', category: 'Seafood', available: true },
        ],
    },
    {
        id: 'r20',
        name: 'Mama Put Deluxe – Cafeteria 1',
        location: 'Cafeteria 1',
        image: 'https://images.unsplash.com/photo-1603893693585-e5f94b5b13de?w=800',
        rating: 4.0,
        deliveryTime: '30-40 min',
        cuisine: ['Local Food'],
        distance: '13.5 km',
        priceRange: '$',
        isBusy: false,
        prepTime: 30,
        menu: [
            { id: 'r20m1', name: 'White Rice + Stew', description: '', price: 1200, image: 'https://images.unsplash.com/photo-1603893693585-e5f94b5b13de?w=800', category: 'Local', available: true },
            { id: 'r20m2', name: 'Beans & Plantain', description: '', price: 900, image: 'https://images.unsplash.com/photo-1603893693585-e5f94b5b13de?w=800', category: 'Local', available: true },
            { id: 'r20m3', name: 'Moimoi + Pap', description: '', price: 700, image: 'https://images.unsplash.com/photo-1603893693585-e5f94b5b13de?w=800', category: 'Local', available: true },
            { id: 'r20m4', name: 'Yam & Egg', description: '', price: 800, image: 'https://images.unsplash.com/photo-1603893693585-e5f94b5b13de?w=800', category: 'Local', available: true },
            { id: 'r20m5', name: 'Fufu + Ogbono', description: '', price: 1200, image: 'https://images.unsplash.com/photo-1603893693585-e5f94b5b13de?w=800', category: 'Local', available: true },
        ],
    },
];

// Menu and MenuItem types
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

export const menuItems: MenuItem[] = [
    {
        id: 'm1',
        name: 'Jollof Rice + Chicken',
        description: 'Smoky party jollof served with grilled chicken.',
        price: 2500,
        image: 'https://images.unsplash.com/photo-1603893693585-e5f94b5b13de?w=800',
        category: 'Local Food',
        available: true,
    },
    {
        id: 'm2',
        name: 'Amala + Abula',
        description: 'Fresh amala served with gbegiri and ewedu.',
        price: 2000,
        image: 'https://images.unsplash.com/photo-1627662057411-3b9c7a509a68?w=800',
        category: 'Local Food',
        available: true,
    },
    {
        id: 'm3',
        name: 'Chicken Shawarma',
        description: 'Creamy shawarma with spicy grilled chicken.',
        price: 1800,
        image: 'https://images.unsplash.com/photo-1606755962773-d324e0a130b5?w=800',
        category: 'Shawarma',
        available: true,
    },
    {
        id: 'm4',
        name: 'Smoothie (Berry Mix)',
        description: 'Strawberry, blueberry, banana blend.',
        price: 1500,
        image: 'https://images.unsplash.com/photo-1577803645773-f96470509666?w=800',
        category: 'Drinks',
        available: true,
    },
    {
        id: 'm5',
        name: 'Beef Burger',
        description: 'Juicy grilled beef patty with cheese and onions.',
        price: 3000,
        image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=800',
        category: 'Burgers',
        available: true,
    },
    {
        id: 'm6',
        name: 'Seafood Okra',
        description: 'Rich seafood okra soup with prawns and fish.',
        price: 4500,
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
        category: 'Seafood',
        available: true,
    }
];
