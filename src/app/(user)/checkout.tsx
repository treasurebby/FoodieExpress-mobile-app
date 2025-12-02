import { PaymentModal } from '@/components/PaymentModal';
import { Colors } from '@/constants/theme';
import { useCartStore } from '@/store/cartStore';
import * as storage from '@/utils/storage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

type PaymentMethod = 'card' | 'transfer' | 'cash';

interface DeliveryInfo {
    address: string;
    phone: string;
    notes: string;
}

interface Transaction {
    id: string;
    amount: number;
    paymentMethod: PaymentMethod;
    status: 'pending' | 'completed' | 'failed';
    timestamp: string;
}

export default function CheckoutScreen() {
    const router = useRouter();
    const { items, getTotal, clearCart } = useCartStore();
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [deliveryInfo, setDeliveryInfo] = useState<DeliveryInfo>({
        address: 'Plot 123, Lekki Phase 1, Lagos',
        phone: '+234 803 123 4567',
        notes: '',
    });
    const [isProcessing, setIsProcessing] = useState(false);
    const [lastTransaction, setLastTransaction] = useState<Transaction | null>(null);

    const total = getTotal();
    const deliveryFee = 500;
    const tax = Math.round(total * 0.05);
    const finalTotal = total + deliveryFee + tax;

    const saveTransaction = async (transaction: Transaction) => {
        try {
            const key = 'foodie_transactions_v1';
            const existing = await storage.getItem(key);
            const transactions = existing ? JSON.parse(existing) : [];
            transactions.push(transaction);
            await storage.setItem(key, JSON.stringify(transactions));
            setLastTransaction(transaction);
        } catch (e) {
            console.error('Failed to save transaction', e);
        }
    };

    const handlePaymentSuccess = async (transactionId: string) => {
        const transaction: Transaction = {
            id: transactionId,
            amount: finalTotal,
            paymentMethod,
            status: 'completed',
            timestamp: new Date().toISOString(),
        };

        await saveTransaction(transaction);
        clearCart();

        Alert.alert(
            'Payment Successful! 🎉',
            `Transaction ID: ${transactionId}\n\nAmount: ₦${finalTotal}\nPayment Method: ${paymentMethod === 'card' ? 'Card' : paymentMethod === 'transfer' ? 'Bank Transfer' : 'Cash on Delivery'}\n\nYour order has been confirmed!`,
            [
                {
                    text: 'View Orders',
                    onPress: () => router.replace('/(user)/orders'),
                },
            ]
        );
    };

    if (items.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Your cart is empty</Text>
                <TouchableOpacity
                    style={styles.backBtn}
                    onPress={() => router.back()}
                >
                    <Text style={styles.backBtnText}>Back to Orders</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const handleCheckout = () => {
        if (!deliveryInfo.address || !deliveryInfo.phone) {
            Alert.alert('Error', 'Please fill in all delivery details');
            return;
        }
        setShowPaymentModal(true);
    };

    return (
        <View style={styles.wrapper}>
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Text style={styles.backIcon}>← Back</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Checkout</Text>
                    <View style={{ width: 30 }} />
                </View>

                {/* Order Summary */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Order Summary</Text>
                    <View style={styles.itemsList}>
                        {items.map((item) => (
                            <View key={item.id} style={styles.summaryItem}>
                                <View style={styles.itemInfo}>
                                    <Text style={styles.itemName}>{item.name}</Text>
                                    <Text style={styles.itemQty}>Qty: {item.quantity}</Text>
                                </View>
                                <Text style={styles.itemTotal}>₦{item.price * item.quantity}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Delivery Address */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Delivery Address</Text>
                        <TouchableOpacity onPress={() => Alert.alert('Edit Address', 'Feature coming soon')}>
                            <Text style={styles.editLink}>Edit</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.infoBox}>
                        <Text style={styles.infoLabel}>Address</Text>
                        <Text style={styles.infoValue}>{deliveryInfo.address}</Text>
                        <Text style={[styles.infoLabel, { marginTop: 12 }]}>Phone</Text>
                        <Text style={styles.infoValue}>{deliveryInfo.phone}</Text>
                    </View>
                </View>

                {/* Delivery Notes */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Delivery Notes (Optional)</Text>
                    <View style={styles.notesInput}>
                        <Text style={styles.placeholder}>
                            {deliveryInfo.notes || 'Add special instructions for delivery...'}
                        </Text>
                    </View>
                </View>

                {/* Payment Method */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Payment Method</Text>
                    <View style={styles.paymentOptions}>
                        {(['card', 'transfer', 'cash'] as const).map((method) => (
                            <TouchableOpacity
                                key={method}
                                style={[
                                    styles.paymentOption,
                                    paymentMethod === method && styles.paymentOptionActive,
                                ]}
                                onPress={() => setPaymentMethod(method)}
                            >
                                <View
                                    style={[
                                        styles.radioButton,
                                        paymentMethod === method && styles.radioButtonActive,
                                    ]}
                                />
                                <Text style={styles.paymentText}>
                                    {method === 'card' && 'Debit/Credit Card'}
                                    {method === 'transfer' && 'Bank Transfer'}
                                    {method === 'cash' && 'Cash on Delivery'}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Price Breakdown */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Price Breakdown</Text>
                    <View style={styles.breakdownItem}>
                        <Text style={styles.breakdownLabel}>Subtotal</Text>
                        <Text style={styles.breakdownValue}>₦{total}</Text>
                    </View>
                    <View style={styles.breakdownItem}>
                        <Text style={styles.breakdownLabel}>Delivery Fee</Text>
                        <Text style={styles.breakdownValue}>₦{deliveryFee}</Text>
                    </View>
                    <View style={styles.breakdownItem}>
                        <Text style={styles.breakdownLabel}>Tax (5%)</Text>
                        <Text style={styles.breakdownValue}>₦{tax}</Text>
                    </View>
                    <View style={[styles.breakdownItem, styles.breakdownTotal]}>
                        <Text style={styles.totalLabel}>Total</Text>
                        <Text style={styles.totalValue}>₦{finalTotal}</Text>
                    </View>
                </View>

                {/* Checkout Button */}
                <TouchableOpacity
                    style={styles.checkoutBtn}
                    onPress={handleCheckout}
                >
                    <Text style={styles.checkoutBtnText}>
                        {`Continue to Payment`}
                    </Text>
                </TouchableOpacity>

                <View style={{ height: 20 }} />
            </ScrollView>

            {/* Payment Modal */}
            <PaymentModal
                visible={showPaymentModal}
                amount={finalTotal}
                paymentMethod={paymentMethod}
                onClose={() => setShowPaymentModal(false)}
                onPaymentSuccess={handlePaymentSuccess}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
    },
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 16,
        backgroundColor: Colors.light.card,
        borderBottomWidth: 1,
        borderBottomColor: Colors.light.border,
    },
    backIcon: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.light.primary,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: Colors.light.text,
    },
    section: {
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: Colors.light.border,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.light.text,
    },
    editLink: {
        fontSize: 14,
        color: Colors.light.primary,
        fontWeight: '600',
    },
    itemsList: {
        marginTop: 12,
        backgroundColor: Colors.light.background,
        borderRadius: 8,
        padding: 12,
    },
    summaryItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: Colors.light.border,
    },
    itemInfo: {
        flex: 1,
    },
    itemName: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.light.text,
    },
    itemQty: {
        fontSize: 12,
        color: Colors.light.textSecondary,
        marginTop: 4,
    },
    itemTotal: {
        fontSize: 14,
        fontWeight: '700',
        color: Colors.light.primary,
    },
    infoBox: {
        backgroundColor: Colors.light.background,
        borderRadius: 8,
        padding: 12,
        marginTop: 12,
    },
    infoLabel: {
        fontSize: 12,
        color: Colors.light.textSecondary,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    infoValue: {
        fontSize: 14,
        color: Colors.light.text,
        fontWeight: '500',
        marginTop: 4,
    },
    notesInput: {
        backgroundColor: Colors.light.background,
        borderRadius: 8,
        padding: 12,
        marginTop: 12,
        minHeight: 80,
        justifyContent: 'center',
    },
    placeholder: {
        fontSize: 14,
        color: Colors.light.textSecondary,
        fontStyle: 'italic',
    },
    paymentOptions: {
        marginTop: 12,
        gap: 10,
    },
    paymentOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.light.border,
        backgroundColor: Colors.light.background,
    },
    paymentOptionActive: {
        backgroundColor: Colors.light.primary + '10',
        borderColor: Colors.light.primary,
    },
    radioButton: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: Colors.light.textSecondary,
        marginRight: 12,
    },
    radioButtonActive: {
        borderColor: Colors.light.primary,
        backgroundColor: Colors.light.primary,
    },
    paymentText: {
        fontSize: 14,
        fontWeight: '500',
        color: Colors.light.text,
    },
    breakdownItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: Colors.light.border,
    },
    breakdownLabel: {
        fontSize: 14,
        color: Colors.light.textSecondary,
    },
    breakdownValue: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.light.text,
    },
    breakdownTotal: {
        borderBottomWidth: 0,
        paddingTop: 12,
        paddingBottom: 0,
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.light.text,
    },
    totalValue: {
        fontSize: 18,
        fontWeight: '800',
        color: Colors.light.primary,
    },
    checkoutBtn: {
        marginHorizontal: 16,
        marginTop: 20,
        marginBottom: 16,
        paddingVertical: 16,
        borderRadius: 12,
        backgroundColor: Colors.light.primary,
        alignItems: 'center',
        shadowColor: Colors.light.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    checkoutBtnDisabled: {
        opacity: 0.6,
    },
    checkoutBtnText: {
        fontSize: 16,
        fontWeight: '700',
        color: 'white',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.light.background,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.light.text,
        marginBottom: 20,
    },
    backBtn: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: Colors.light.primary,
        borderRadius: 8,
    },
    backBtnText: {
        color: 'white',
        fontWeight: '600',
    },
});
