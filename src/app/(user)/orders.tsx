import StatusBadge from '@/components/ui/StatusBadge';
import { Colors } from '@/constants/colors';
import Theme from '@/constants/theme';
import { restaurants } from '@/services/mockData';
import { useCartStore } from '@/store/cartStore';
import { OrderStatus } from '@/types';
import * as storage from '@/utils/storage';
import { useRouter } from 'expo-router';
import { Clock, MapPin, RefreshCw, Star } from 'lucide-react-native';
import React, { useEffect, useMemo, useState } from 'react';
import {
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface OrderItem {
    id: string;
    name: string;
    qty: number;
    price: number;
}

interface Order {
    id: string;
    restaurantId: string;
    restaurantName: string;
    items: OrderItem[];
    total: number;
    status: OrderStatus;
    createdAt: string;
    estimatedTime?: string;
}

const STORAGE_KEY = 'foodie_orders_v1';

const initialOrders: Order[] = [
    {
        id: 'o1',
        restaurantId: restaurants[0].id,
        restaurantName: restaurants[0].name,
        items: [
            { id: 'r1m1', name: 'Jollof Rice + Chicken', qty: 1, price: 2500 },
        ],
        total: 2500,
        status: 'processing',
        createdAt: new Date().toISOString(),
        estimatedTime: '15 mins',
    },
    {
        id: 'o2',
        restaurantId: restaurants[1].id,
        restaurantName: restaurants[1].name,
        items: [
            { id: 'r2m1', name: 'Chicken Shawarma (Spicy)', qty: 2, price: 1200 },
        ],
        total: 2400,
        status: 'completed',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    },
    {
        id: 'o3',
        restaurantId: restaurants[2].id,
        restaurantName: restaurants[2].name,
        items: [
            { id: 'r3m1', name: 'Amala + Abula', qty: 1, price: 2000 },
        ],
        total: 2000,
        status: 'pending',
        createdAt: new Date().toISOString(),
        estimatedTime: '25 mins',
    },
    {
        id: 'o4',
        restaurantId: restaurants[3].id,
        restaurantName: restaurants[3].name,
        items: [
            { id: 'r4m1', name: 'Jollof & Grilled Turkey', qty: 1, price: 3200 },
        ],
        total: 3200,
        status: 'completed',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    },
];

export default function OrdersScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { addItem } = useCartStore();
    const [orders, setOrders] = useState<Order[]>(initialOrders);
    const [activeTab, setActiveTab] = useState<'active' | 'past'>('active');

    // load persisted orders (if any)
    useEffect(() => {
        (async () => {
            try {
                const raw = await storage.getItem(STORAGE_KEY);
                if (raw) {
                    const parsed = JSON.parse(raw) as Order[];
                    setOrders(parsed);
                }
            } catch (e) {
                // ignore
            }
        })();
    }, []);

    // persist when orders change
    useEffect(() => {
        (async () => {
            try {
                await storage.setItem(STORAGE_KEY, JSON.stringify(orders));
            } catch (e) {
                // ignore
            }
        })();
    }, [orders]);

    const activeOrders = useMemo(() => {
        return orders.filter((o) => o.status === 'pending' || o.status === 'processing');
    }, [orders]);

    const pastOrders = useMemo(() => {
        return orders.filter((o) => o.status === 'completed' || o.status === 'cancelled');
    }, [orders]);

    const displayOrders = activeTab === 'active' ? activeOrders : pastOrders;

    function handleReorder(order: Order) {
        Alert.alert('Reorder', `Add ${order.items.length} item(s) to cart?`, [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Add to Cart',
                onPress: () => {
                    order.items.forEach((item) => {
                        addItem({
                            id: item.id,
                            name: item.name,
                            price: item.price,
                            quantity: item.qty,
                            image: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=800&q=80',
                            restaurantId: order.restaurantId,
                        });
                    });
                    Alert.alert('Success', 'Items added to cart!');
                },
            },
        ]);
    }

    function handleRateOrder(orderId: string) {
        Alert.alert('Rate Order', 'Rating feature coming soon!');
    }

    function handleTrackOrder(orderId: string) {
        router.push('/(user)/track-order' as any);
    }

    function renderOrder({ item }: { item: Order }) {
        const isActive = item.status === 'pending' || item.status === 'processing';

        return (
            <View style={styles.orderCard}>
                <View style={styles.orderHeader}>
                    <View style={styles.orderHeaderLeft}>
                        <Text style={styles.restaurantName}>{item.restaurantName}</Text>
                        <Text style={styles.orderDate}>
                            {new Date(item.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                            })}
                        </Text>
                    </View>
                    <StatusBadge status={item.status} />
                </View>

                <View style={styles.itemsList}>
                    {item.items.map((it) => (
                        <View key={it.id} style={styles.itemRow}>
                            <Text style={styles.itemName}>
                                {it.name} x{it.qty}
                            </Text>
                            <Text style={styles.itemPrice}>₦{(it.price * it.qty).toLocaleString()}</Text>
                        </View>
                    ))}
                </View>

                {isActive && item.estimatedTime && (
                    <View style={styles.estimatedTimeContainer}>
                        <Clock size={14} color={Colors.light.primary} />
                        <Text style={styles.estimatedTime}>Estimated delivery: {item.estimatedTime}</Text>
                    </View>
                )}

                <View style={styles.orderFooter}>
                    <Text style={styles.totalAmount}>Total: ₦{item.total.toLocaleString()}</Text>

                    <View style={styles.orderActions}>
                        {isActive && (
                            <TouchableOpacity
                                style={[styles.actionButton, styles.trackButton]}
                                onPress={() => handleTrackOrder(item.id)}
                            >
                                <MapPin size={16} color="#FFFFFF" />
                                <Text style={styles.actionButtonText}>Track</Text>
                            </TouchableOpacity>
                        )}
                        {!isActive && item.status === 'completed' && (
                            <>
                                <TouchableOpacity
                                    style={[styles.actionButton, styles.rateButton]}
                                    onPress={() => handleRateOrder(item.id)}
                                >
                                    <Star size={16} color={Colors.light.rating} />
                                    <Text style={[styles.actionButtonText, { color: Colors.light.rating }]}>
                                        Rate
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.actionButton, styles.reorderButton]}
                                    onPress={() => handleReorder(item)}
                                >
                                    <RefreshCw size={16} color={Colors.light.primary} />
                                    <Text style={[styles.actionButtonText, { color: Colors.light.primary }]}>
                                        Reorder
                                    </Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={[styles.headerWrapper, { paddingTop: insets.top + 16 }]}>
                <Text style={styles.header}>Your Orders</Text>

                {/* Tab Switcher */}
                <View style={styles.tabContainer}>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'active' && styles.activeTab]}
                        onPress={() => setActiveTab('active')}
                        activeOpacity={0.7}
                    >
                        <Text style={[styles.tabText, activeTab === 'active' && styles.activeTabText]}>
                            Active ({activeOrders.length})
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'past' && styles.activeTab]}
                        onPress={() => setActiveTab('past')}
                        activeOpacity={0.7}
                    >
                        <Text style={[styles.tabText, activeTab === 'past' && styles.activeTabText]}>
                            Past ({pastOrders.length})
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            <FlatList
                data={displayOrders}
                keyExtractor={(i) => i.id}
                renderItem={renderOrder}
                contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 90 }]}
                ListEmptyComponent={() => (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyIcon}>📦</Text>
                        <Text style={styles.emptyTitle}>No {activeTab} orders</Text>
                        <Text style={styles.emptyText}>
                            {activeTab === 'active'
                                ? 'Your active orders will appear here'
                                : 'Your order history will appear here'}
                        </Text>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    headerWrapper: {
        paddingHorizontal: 20,
        paddingBottom: 16,
        backgroundColor: Colors.light.card,
        borderBottomWidth: 1,
        borderBottomColor: Colors.light.border,
    },
    header: {
        fontSize: 28,
        fontWeight: '800',
        color: Colors.light.text,
        letterSpacing: -0.5,
        marginBottom: 16,
    },
    tabContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    tab: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 10,
        backgroundColor: Colors.light.backgroundAlt,
        alignItems: 'center',
    },
    activeTab: {
        backgroundColor: Colors.light.primary,
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.light.textSecondary,
    },
    activeTabText: {
        color: '#FFFFFF',
    },
    listContent: {
        padding: 16,
    },
    orderCard: {
        backgroundColor: Colors.light.card,
        borderRadius: Theme.borderRadius.medium,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.light.border,
    },
    orderHeaderLeft: {
        flex: 1,
    },
    restaurantName: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.light.text,
        marginBottom: 4,
    },
    orderDate: {
        fontSize: 12,
        color: Colors.light.textSecondary,
    },
    itemsList: {
        marginBottom: 12,
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 6,
    },
    itemName: {
        fontSize: 14,
        color: Colors.light.text,
        fontWeight: '500',
        flex: 1,
    },
    itemPrice: {
        fontSize: 14,
        fontWeight: '700',
        color: Colors.light.text,
    },
    estimatedTimeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#FFF3E0',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        marginBottom: 12,
    },
    estimatedTime: {
        fontSize: 13,
        fontWeight: '600',
        color: '#E65100',
    },
    orderFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: Colors.light.border,
    },
    totalAmount: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.light.text,
    },
    orderActions: {
        flexDirection: 'row',
        gap: 8,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
    },
    trackButton: {
        backgroundColor: Colors.light.primary,
        borderColor: Colors.light.primary,
    },
    rateButton: {
        backgroundColor: '#FFF9E6',
        borderColor: '#FFE57F',
    },
    reorderButton: {
        backgroundColor: Colors.light.backgroundAlt,
        borderColor: Colors.light.primary,
    },
    actionButtonText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyIcon: {
        fontSize: 64,
        marginBottom: 16,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.light.text,
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 14,
        color: Colors.light.textSecondary,
        textAlign: 'center',
        paddingHorizontal: 40,
    },
});
