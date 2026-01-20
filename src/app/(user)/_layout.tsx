import CartBadge from '@/components/ui/CartBadge';
import { Colors } from '@/constants/colors';
import Theme from '@/constants/theme';
import { useCartStore } from '@/store/cartStore';
import { Tabs, useRouter } from 'expo-router';
import { Home, MessageCircle, Search, ShoppingBag, User } from 'lucide-react-native';
import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';

export default function UserLayout() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { user } = useAuth();
    const cartItems = useCartStore((state) => state.items);
    const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    // Only render if user has correct role
    if (user && user.role !== 'user') {
        return null;
    }

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: Colors.light.primary,
                tabBarInactiveTintColor: '#999999',
                tabBarStyle: {
                    position: 'absolute',
                    left: 12,
                    right: 12,
                    bottom: Math.max(12, insets.bottom ? insets.bottom : 12),
                    height: 64 + (insets.bottom ?? 0),
                    borderRadius: 16,
                    backgroundColor: Colors.light.card,
                    borderTopWidth: 0,
                    paddingBottom: 8 + (insets.bottom ?? 0),
                    paddingTop: 8,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: -2 },
                    shadowOpacity: 0.08,
                    shadowRadius: 8,
                    elevation: 6,
                },
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: Theme.typography.fontWeight.semibold,
                    marginTop: 4,
                },
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, size }) => <Home size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="search"
                options={{
                    title: 'Search',
                    tabBarIcon: ({ color, size }) => <Search size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="chat"
                options={{
                    title: 'Chat',
                    tabBarIcon: ({ color, size }) => <MessageCircle size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="orders"
                options={{
                    title: 'Order',
                    tabBarIcon: ({ color, size }) => (
                        <View>
                            <ShoppingBag size={24} color={color} />
                            <CartBadge count={cartCount} />
                        </View>
                    ),
                }}
                listeners={{
                    tabPress: (e) => {
                        e.preventDefault();
                        router.push('/(user)/cart');
                    },
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color, size }) => <User size={24} color={color} />,
                }}
            />

            {/* Hidden Screens */}
            <Tabs.Screen
                name="restaurant/[id]"
                options={{
                    href: null,
                }}
            />
            <Tabs.Screen
                name="cart"
                options={{
                    href: null,
                }}
            />
            <Tabs.Screen
                name="checkout"
                options={{
                    href: null,
                }}
            />
            <Tabs.Screen
                name="payment"
                options={{
                    href: null,
                }}
            />
            <Tabs.Screen
                name="order-confirmation"
                options={{
                    href: null,
                }}
            />
            <Tabs.Screen
                name="wallet"
                options={{
                    href: null,
                }}
            />
            <Tabs.Screen
                name="track-order"
                options={{
                    href: null,
                }}
            />
            <Tabs.Screen
                name="logout"
                options={{
                    tabBarButton: () => null, // hide logout from bottom tab
                }}
            />
        </Tabs>
    );
}
