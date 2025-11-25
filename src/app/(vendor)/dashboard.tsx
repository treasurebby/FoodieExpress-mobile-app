import { Colors } from '@/constants/theme';
import React, { useMemo, useState } from 'react';
import { Alert, FlatList, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

type Order = {
    id: string;
    customer: string;
    items: string[];
    amount: number;
    status: 'incoming' | 'preparing' | 'ready' | 'out_for_delivery' | 'completed';
};

export default function VendorDashboard() {
    // sample initial data
    const [busy, setBusy] = useState(false);

    const [incoming, setIncoming] = useState<Order[]>([
        { id: 'o1', customer: 'Tunde', items: ['Jollof Rice', 'Suya'], amount: 3200, status: 'incoming' },
        { id: 'o2', customer: 'Amaka', items: ['Shawarma'], amount: 1500, status: 'incoming' },
    ]);

    const [current, setCurrent] = useState<Order[]>([
        { id: 'o3', customer: 'Ibrahim', items: ['Amala & Ewedu'], amount: 2500, status: 'preparing' },
        { id: 'o4', customer: 'Chioma', items: ['Pepper Soup'], amount: 2000, status: 'ready' },
    ]);

    const earnings = useMemo(() => {
        // sum completed + ready/out_for_delivery as today's earnings demo
        const completedTotal = current
            .filter((o) => o.status === 'completed' || o.status === 'ready' || o.status === 'out_for_delivery')
            .reduce((s, o) => s + o.amount, 0);
        const incomingTotal = incoming.reduce((s, o) => s + o.amount, 0);
        return completedTotal + incomingTotal + 42500; // base to match example
    }, [current, incoming]);

    function acceptOrder(orderId: string) {
        const order = incoming.find((o) => o.id === orderId);
        if (!order) return;
        setIncoming((prev) => prev.filter((o) => o.id !== orderId));
        setCurrent((prev) => [{ ...order, status: 'preparing' }, ...prev]);
    }

    function declineOrder(orderId: string) {
        setIncoming((prev) => prev.filter((o) => o.id !== orderId));
    }

    function advanceStatus(orderId: string) {
        setCurrent((prev) =>
            prev.map((o) => {
                if (o.id !== orderId) return o;
                if (o.status === 'preparing') return { ...o, status: 'ready' };
                if (o.status === 'ready') return { ...o, status: 'out_for_delivery' };
                if (o.status === 'out_for_delivery') return { ...o, status: 'completed' };
                return o;
            })
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Today's earnings</Text>
                <Text style={styles.earnings}>₦{earnings.toLocaleString()}</Text>
            </View>

            <View style={styles.controls}>
                <Text style={styles.label}>Busy Mode</Text>
                <Switch value={busy} onValueChange={setBusy} />
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Live incoming orders</Text>
                <FlatList
                    data={incoming}
                    keyExtractor={(i) => i.id}
                    renderItem={({ item }) => (
                        <View style={styles.orderCard}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.orderCustomer}>{item.customer}</Text>
                                <Text style={styles.orderItems}>{item.items.join(', ')}</Text>
                                <Text style={styles.orderAmount}>₦{item.amount}</Text>
                            </View>
                            <View style={styles.orderActions}>
                                <TouchableOpacity style={[styles.btn, styles.accept]} onPress={() => acceptOrder(item.id)}>
                                    <Text style={styles.btnText}>Accept</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.btn, styles.decline]} onPress={() => declineOrder(item.id)}>
                                    <Text style={styles.btnText}>Decline</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                    ListEmptyComponent={<Text style={styles.empty}>No incoming orders</Text>}
                />
            </View>

            <View style={styles.section}> 
                <Text style={styles.sectionTitle}>Current orders</Text>
                <FlatList
                    data={current}
                    keyExtractor={(i) => i.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.currentCard} onPress={() => Alert.alert('Advance status', 'Advance order status?', [
                            { text: 'Cancel' },
                            { text: 'Advance', onPress: () => advanceStatus(item.id) }
                        ])}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.orderCustomer}>{item.customer}</Text>
                                <Text style={styles.orderItems}>{item.items.join(', ')}</Text>
                            </View>
                            <View style={{ alignItems: 'flex-end' }}>
                                <Text style={styles.status}>{
                                    item.status === 'preparing' ? 'Preparing' : item.status === 'ready' ? 'Ready' : item.status === 'out_for_delivery' ? 'Out for delivery' : 'Completed'
                                }</Text>
                                <Text style={styles.orderAmount}>₦{item.amount}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                    ListEmptyComponent={<Text style={styles.empty}>No current orders</Text>}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
        padding: 16,
    },
    header: {
        marginTop: 8,
        marginBottom: 12,
    },
    headerTitle: {
        fontSize: 14,
        color: Colors.light.textSecondary,
    },
    earnings: {
        fontSize: 28,
        color: Colors.light.primary,
        fontWeight: '700',
        marginTop: 6,
    },
    controls: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
        paddingHorizontal: 4,
    },
    label: {
        color: Colors.light.text,
        fontSize: 16,
    },
    section: {
        marginTop: 8,
        marginBottom: 8,
        flex: 1,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.light.text,
        marginBottom: 8,
    },
    orderCard: {
        flexDirection: 'row',
        backgroundColor: Colors.light.card,
        padding: 12,
        borderRadius: 10,
        marginBottom: 10,
        alignItems: 'center',
    },
    currentCard: {
        flexDirection: 'row',
        backgroundColor: Colors.light.card,
        padding: 12,
        borderRadius: 10,
        marginBottom: 10,
        alignItems: 'center',
    },
    orderCustomer: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.light.text,
    },
    orderItems: {
        color: Colors.light.textSecondary,
        marginTop: 4,
    },
    orderAmount: {
        color: Colors.light.text,
        marginTop: 6,
        fontWeight: '700',
    },
    orderActions: {
        marginLeft: 12,
        alignItems: 'flex-end',
    },
    btn: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 8,
        marginBottom: 6,
    },
    accept: {
        backgroundColor: '#00C853',
    },
    decline: {
        backgroundColor: '#F44336',
    },
    btnText: {
        color: '#fff',
        fontWeight: '600',
    },
    empty: {
        color: Colors.light.textSecondary,
        textAlign: 'center',
        marginTop: 12,
    },
    status: {
        color: Colors.light.primary,
        fontWeight: '700',
    },
});
