import { Colors } from '@/constants/theme';
import { restaurants } from '@/services/mockData';
import { useCartStore } from '@/store/cartStore';
import * as storage from '@/utils/storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

type OrderStatus = 'draft' | 'processing' | 'completed';

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
        status: 'draft',
        createdAt: new Date().toISOString(),
    },
];

export default function OrdersScreen() {
    const router = useRouter();
    const cartItems = useCartStore((state) => state.items);
    const [orders, setOrders] = useState<Order[]>(initialOrders);
    const [filter, setFilter] = useState<OrderStatus | 'all'>('all');

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

    const visible = useMemo(() => {
        if (filter === 'all') return orders;
        return orders.filter((o) => o.status === filter);
    }, [orders, filter]);

    function changeStatus(id: string, to: OrderStatus) {
        setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: to } : o)));
    }

    function onCheckoutDraft(id: string) {
        Alert.alert('Checkout', 'Place this draft as an order?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Place Order', onPress: () => changeStatus(id, 'processing') },
        ]);
    }

    function onMarkDelivered(id: string) {
        Alert.alert('Confirm', 'Mark this order as delivered?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Yes', onPress: () => changeStatus(id, 'completed') },
        ]);
    }

    function renderOrder({ item }: { item: Order }) {
        return (
            <View style={styles.card}>
                <View style={styles.rowTop}>
                    <Text style={styles.restName}>{item.restaurantName}</Text>
                    <Text style={styles.status}>{item.status.toUpperCase()}</Text>
                </View>

                {item.items.map((it) => (
                    <View key={it.id} style={styles.itemRow}>
                        <Text style={styles.itemName}>{it.name} x{it.qty}</Text>
                        <Text style={styles.itemPrice}>₦{it.price * it.qty}</Text>
                    </View>
                ))}

                <View style={styles.rowBottom}>
                    <Text style={styles.total}>Total: ₦{item.total}</Text>
                    {item.status === 'draft' && (
                        <TouchableOpacity style={styles.actionBtn} onPress={() => onCheckoutDraft(item.id)}>
                            <Text style={styles.actionText}>Checkout</Text>
                        </TouchableOpacity>
                    )}
                    {item.status === 'processing' && (
                        <TouchableOpacity style={[styles.actionBtn, styles.secondary]} onPress={() => onMarkDelivered(item.id)}>
                            <Text style={styles.actionText}>Mark Delivered</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <Text style={styles.header}>Orders</Text>
                {cartItems.length > 0 && (
                    <TouchableOpacity
                        style={styles.cartBtn}
                        onPress={() => router.push('/(user)/checkout')}
                    >
                        <Text style={styles.cartIcon}>🛒</Text>
                        <View style={styles.cartBadge}>
                            <Text style={styles.badgeText}>{cartItems.length}</Text>
                        </View>
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.filters}>
                {(['all', 'draft', 'processing', 'completed'] as const).map((f) => (
                    <TouchableOpacity
                        key={f}
                        style={[styles.filterBtn, filter === f && styles.filterActive]}
                        onPress={() => setFilter(f as any)}
                    >
                        <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
                            {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <FlatList
                data={visible}
                keyExtractor={(i) => i.id}
                renderItem={renderOrder}
                contentContainerStyle={{ padding: 16, paddingBottom: 48 }}
                ListEmptyComponent={() => (
                    <View style={styles.empty}><Text style={styles.emptyText}>No orders in this section</Text></View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.light.background },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 24,
        paddingBottom: 12,
    },
    header: {
        fontSize: 22,
        fontWeight: '700',
        color: Colors.light.text,
    },
    cartBtn: {
        position: 'relative',
        padding: 8,
        marginRight: -8,
    },
    cartIcon: {
        fontSize: 24,
    },
    cartBadge: {
        position: 'absolute',
        top: -2,
        right: -2,
        backgroundColor: Colors.light.primary,
        borderRadius: 10,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '700',
    },
    filters: { flexDirection: 'row', paddingHorizontal: 12, gap: 8, marginBottom: 8 },
    filterBtn: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 999,
        backgroundColor: Colors.light.card,
    },
    filterActive: { backgroundColor: Colors.light.primary + '20' },
    filterText: { color: Colors.light.textSecondary },
    filterTextActive: { color: Colors.light.primary, fontWeight: '600' },
    card: {
        backgroundColor: Colors.light.card,
        padding: 12,
        borderRadius: 12,
        marginBottom: 12,
    },
    rowTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    restName: { fontSize: 16, fontWeight: '700', color: Colors.light.text },
    status: { fontSize: 12, color: Colors.light.textSecondary },
    itemRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
    itemName: { color: Colors.light.text },
    itemPrice: { color: Colors.light.textSecondary },
    rowBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
    total: { fontWeight: '700', color: Colors.light.text },
    actionBtn: { backgroundColor: Colors.light.primary, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
    actionText: { color: 'white', fontWeight: '700' },
    secondary: { backgroundColor: Colors.light.secondary },
    empty: { padding: 24, alignItems: 'center' },
    emptyText: { color: Colors.light.textSecondary },
});
