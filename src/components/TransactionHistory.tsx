import { Colors } from '@/constants/theme';
import * as storage from '@/utils/storage';
import React, { useEffect, useState } from 'react';
import {
    FlatList,
    StyleSheet,
    Text,
    View,
} from 'react-native';

interface Transaction {
    id: string;
    amount: number;
    paymentMethod: 'card' | 'transfer' | 'cash';
    status: 'pending' | 'completed' | 'failed';
    timestamp: string;
}

export const TransactionHistory = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
        loadTransactions();
    }, []);

    const loadTransactions = async () => {
        try {
            const key = 'foodie_transactions_v1';
            const data = await storage.getItem(key);
            if (data) {
                const parsed = JSON.parse(data) as Transaction[];
                setTransactions(parsed.sort((a, b) => 
                    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
                ));
            }
        } catch (e) {
            console.error('Failed to load transactions', e);
        }
    };

    const formatDate = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString('en-NG', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getPaymentMethodLabel = (method: string) => {
        switch (method) {
            case 'card':
                return 'Debit/Credit Card';
            case 'transfer':
                return 'Bank Transfer';
            case 'cash':
                return 'Cash on Delivery';
            default:
                return method;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return Colors.light.secondary;
            case 'pending':
                return Colors.light.warning;
            case 'failed':
                return Colors.light.error;
            default:
                return Colors.light.textSecondary;
        }
    };

    const renderTransaction = ({ item }: { item: Transaction }) => (
        <View style={styles.transactionCard}>
            <View style={styles.transactionHeader}>
                <View>
                    <Text style={styles.methodText}>{getPaymentMethodLabel(item.paymentMethod)}</Text>
                    <Text style={styles.dateText}>{formatDate(item.timestamp)}</Text>
                </View>
                <View style={styles.amountContainer}>
                    <Text style={styles.amountText}>₦{item.amount.toLocaleString()}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
                        <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </Text>
                    </View>
                </View>
            </View>
            <Text style={styles.transactionId}>ID: {item.id}</Text>
        </View>
    );

    if (transactions.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No transactions yet</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Transaction History</Text>
            <FlatList
                data={transactions}
                keyExtractor={(item) => item.id}
                renderItem={renderTransaction}
                scrollEnabled={false}
                contentContainerStyle={styles.listContent}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.light.text,
        marginBottom: 12,
    },
    listContent: {
        gap: 12,
    },
    transactionCard: {
        backgroundColor: Colors.light.card,
        borderRadius: 12,
        padding: 12,
        borderLeftWidth: 4,
        borderLeftColor: Colors.light.primary,
    },
    transactionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    methodText: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.light.text,
    },
    dateText: {
        fontSize: 12,
        color: Colors.light.textSecondary,
        marginTop: 4,
    },
    amountContainer: {
        alignItems: 'flex-end',
    },
    amountText: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.light.primary,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        marginTop: 6,
    },
    statusText: {
        fontSize: 11,
        fontWeight: '600',
    },
    transactionId: {
        fontSize: 11,
        color: Colors.light.textSecondary,
        fontFamily: 'monospace',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.light.background,
    },
    emptyText: {
        fontSize: 16,
        color: Colors.light.textSecondary,
        fontWeight: '500',
    },
});
