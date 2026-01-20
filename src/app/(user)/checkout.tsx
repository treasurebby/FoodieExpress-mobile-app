import { Colors } from '@/constants/colors';
import Theme from '@/constants/theme';
import { useCartStore } from '@/store/cartStore';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import {
    ArrowLeft,
    Award,
    ChevronDown,
    ChevronRight,
    Clock,
    CreditCard,
    Home,
    MapPin,
    Tag,
    Truck,
    Wallet,
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Alert,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as storage from '@/utils/storage';

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
    status: 'pending' | 'processing' | 'completed';
    createdAt: string;
    estimatedTime?: string;
}

const ORDERS_KEY = 'foodie_orders_v1';

// Mock saved addresses
const mockAddresses = [
    { id: 'addr1', label: 'Home', address: '12 Oduduwa Street, Ile-Ife, Osun State', isDefault: true },
    { id: 'addr2', label: 'Work', address: 'OAU Campus, Road 1, Ile-Ife', isDefault: false },
    { id: 'addr3', label: 'Hostel', address: 'Moremi Hall, OAU, Ile-Ife', isDefault: false },
];

// Mock delivery time slots
const deliveryTimeSlots = [
    { id: 'asap', label: 'ASAP', time: '15-25 mins' },
    { id: 'slot1', label: 'Schedule', time: '10:00 AM - 10:30 AM' },
    { id: 'slot2', label: 'Schedule', time: '11:00 AM - 11:30 AM' },
    { id: 'slot3', label: 'Schedule', time: '12:00 PM - 12:30 PM' },
    { id: 'slot4', label: 'Schedule', time: '1:00 PM - 1:30 PM' },
];

// Mock payment methods
const mockPaymentMethods = [
    { id: 'card1', type: 'card', last4: '4242', brand: 'Visa', isDefault: true },
    { id: 'card2', type: 'card', last4: '5555', brand: 'Mastercard', isDefault: false },
];

export default function CheckoutScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { user } = useAuth();
    const { items: cartItems, getTotal, clearCart } = useCartStore();
    const cartTotal = getTotal();
    const deliveryFee = 500;

    // State
    const [selectedAddress, setSelectedAddress] = useState(mockAddresses[0]);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(deliveryTimeSlots[0]);
    const [showTimeSlotModal, setShowTimeSlotModal] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(mockPaymentMethods[0]);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [loyaltyPoints] = useState(250);
    const [usePoints, setUsePoints] = useState(false);
    const [promoCode, setPromoCode] = useState('');
    const [promoApplied, setPromoApplied] = useState(false);
    const [promoDiscount, setPromoDiscount] = useState(0);
    const [specialInstructions, setSpecialInstructions] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    if (!user) {
        return (
            <View style={styles.container}>
                <Text>Please log in to checkout</Text>
            </View>
        );
    }

    const pointsDiscount = usePoints ? Math.min(loyaltyPoints * 1, cartTotal) : 0; // 1 point = ₦1
    const grandTotal = cartTotal + deliveryFee - pointsDiscount - promoDiscount;

    const handleApplyPromo = () => {
        if (promoCode.trim().toUpperCase() === 'FOODIE50') {
            setPromoApplied(true);
            setPromoDiscount(cartTotal * 0.5); // 50% off
            Alert.alert('Promo Applied!', '50% discount applied to your order');
        } else if (promoCode.trim().toUpperCase() === 'FOODIE10') {
            setPromoApplied(true);
            setPromoDiscount(cartTotal * 0.1); // 10% off
            Alert.alert('Promo Applied!', '10% discount applied to your order');
        } else {
            Alert.alert('Invalid Code', 'The promo code you entered is not valid');
        }
    };

    const handleCheckout = async () => {
        setIsProcessing(true);

        try {
            // Simulate payment processing
            await new Promise((resolve) => setTimeout(resolve, 1500));

            // Create mock order ID
            const orderId = `ORD${Date.now().toString().slice(-8)}`;

            // Clear the cart
            clearCart();

            // Navigate directly to track order with mock data
            router.replace({
                pathname: '/(user)/track-order',
                params: {
                    orderId: orderId,
                    restaurantName: cartItems[0]?.restaurantName || 'Restaurant',
                    total: grandTotal.toString(),
                },
            });
        } catch (err) {
            Alert.alert('Error', 'Something went wrong. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ArrowLeft size={24} color={Colors.light.text} />
                </TouchableOpacity>
                <Text style={styles.title}>Checkout</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]}>
                {/* Delivery Address Selector */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Delivery Address</Text>
                    <TouchableOpacity style={styles.selectorCard} onPress={() => setShowAddressModal(true)}>
                        <View style={styles.selectorLeft}>
                            <View style={styles.iconCircle}>
                                <Home size={18} color={Colors.light.primary} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.selectorLabel}>{selectedAddress.label}</Text>
                                <Text style={styles.selectorValue} numberOfLines={1}>
                                    {selectedAddress.address}
                                </Text>
                            </View>
                        </View>
                        <ChevronRight size={20} color={Colors.light.textSecondary} />
                    </TouchableOpacity>
                </View>

                {/* Delivery Time Selector */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Delivery Time</Text>
                    <TouchableOpacity style={styles.selectorCard} onPress={() => setShowTimeSlotModal(true)}>
                        <View style={styles.selectorLeft}>
                            <View style={styles.iconCircle}>
                                <Clock size={18} color={Colors.light.primary} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.selectorLabel}>{selectedTimeSlot.label}</Text>
                                <Text style={styles.selectorValue}>{selectedTimeSlot.time}</Text>
                            </View>
                        </View>
                        <ChevronRight size={20} color={Colors.light.textSecondary} />
                    </TouchableOpacity>
                </View>

                {/* Payment Method Selector */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Payment Method</Text>
                    <TouchableOpacity style={styles.selectorCard} onPress={() => setShowPaymentModal(true)}>
                        <View style={styles.selectorLeft}>
                            <View style={styles.iconCircle}>
                                <CreditCard size={18} color={Colors.light.primary} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.selectorLabel}>{selectedPayment.brand}</Text>
                                <Text style={styles.selectorValue}>•••• •••• •••• {selectedPayment.last4}</Text>
                            </View>
                        </View>
                        <ChevronRight size={20} color={Colors.light.textSecondary} />
                    </TouchableOpacity>
                </View>

                {/* Loyalty Points Redemption */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Loyalty Points</Text>
                    <TouchableOpacity
                        style={[styles.loyaltyCard, usePoints && styles.loyaltyCardActive]}
                        onPress={() => setUsePoints(!usePoints)}
                        activeOpacity={0.7}
                    >
                        <View style={styles.loyaltyLeft}>
                            <View style={[styles.iconCircle, { backgroundColor: '#FFF9E6' }]}>
                                <Award size={18} color={Colors.light.rating} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.loyaltyTitle}>Use {loyaltyPoints} Points</Text>
                                <Text style={styles.loyaltySubtitle}>Save ₦{Math.min(loyaltyPoints * 1, cartTotal)}</Text>
                            </View>
                        </View>
                        <View style={[styles.checkbox, usePoints && styles.checkboxActive]}>
                            {usePoints && <Text style={styles.checkmark}>✓</Text>}
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Promo Code */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Promo Code</Text>
                    <View style={styles.promoCard}>
                        <View style={styles.promoInputContainer}>
                            <Tag size={18} color={Colors.light.textSecondary} />
                            <TextInput
                                style={styles.promoInput}
                                placeholder="Enter promo code"
                                placeholderTextColor={Colors.light.textSecondary}
                                value={promoCode}
                                onChangeText={setPromoCode}
                                autoCapitalize="characters"
                                editable={!promoApplied}
                            />
                        </View>
                        <TouchableOpacity
                            style={[styles.applyButton, promoApplied && styles.applyButtonDisabled]}
                            onPress={handleApplyPromo}
                            disabled={promoApplied || !promoCode.trim()}
                        >
                            <Text style={styles.applyButtonText}>{promoApplied ? 'Applied' : 'Apply'}</Text>
                        </TouchableOpacity>
                    </View>
                    {promoApplied && (
                        <View style={styles.promoSuccessBanner}>
                            <Text style={styles.promoSuccessText}>
                                ✓ Promo code applied! You saved ₦{promoDiscount.toLocaleString()}
                            </Text>
                        </View>
                    )}
                </View>

                {/* Special Instructions */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Special Instructions (Optional)</Text>
                    <TextInput
                        style={styles.instructionsInput}
                        placeholder="Add delivery instructions, allergies, etc."
                        placeholderTextColor={Colors.light.textSecondary}
                        value={specialInstructions}
                        onChangeText={setSpecialInstructions}
                        multiline
                        numberOfLines={3}
                        textAlignVertical="top"
                    />
                </View>

                {/* Order Summary */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Order Summary</Text>
                    <View style={styles.summaryCard}>
                        {cartItems.map((item) => (
                            <View key={item.id} style={styles.summaryItem}>
                                <Text style={styles.itemName}>
                                    {item.name} x{item.quantity}
                                </Text>
                                <Text style={styles.itemPrice}>₦{(item.price * item.quantity).toLocaleString()}</Text>
                            </View>
                        ))}
                        <View style={styles.divider} />
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>Subtotal</Text>
                            <Text style={styles.totalPrice}>₦{cartTotal.toLocaleString()}</Text>
                        </View>
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>Delivery Fee</Text>
                            <Text style={styles.totalPrice}>₦{deliveryFee.toLocaleString()}</Text>
                        </View>
                        {usePoints && (
                            <View style={styles.totalRow}>
                                <Text style={[styles.totalLabel, { color: Colors.light.secondary }]}>
                                    Points Discount
                                </Text>
                                <Text style={[styles.totalPrice, { color: Colors.light.secondary }]}>
                                    -₦{pointsDiscount.toLocaleString()}
                                </Text>
                            </View>
                        )}
                        {promoApplied && (
                            <View style={styles.totalRow}>
                                <Text style={[styles.totalLabel, { color: Colors.light.secondary }]}>
                                    Promo Discount
                                </Text>
                                <Text style={[styles.totalPrice, { color: Colors.light.secondary }]}>
                                    -₦{promoDiscount.toLocaleString()}
                                </Text>
                            </View>
                        )}
                        <View style={styles.divider} />
                        <View style={styles.totalRow}>
                            <Text style={styles.grandTotal}>Grand Total</Text>
                            <Text style={styles.grandTotalPrice}>₦{grandTotal.toLocaleString()}</Text>
                        </View>
                    </View>
                </View>

                {/* Terms */}
                <View style={styles.termsSection}>
                    <Text style={styles.termsText}>
                        By placing this order, you agree to our terms and conditions
                    </Text>
                </View>
            </ScrollView>

            {/* Checkout Button */}
            <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
                <TouchableOpacity
                    style={[styles.checkoutButton, isProcessing && styles.checkoutButtonDisabled]}
                    onPress={handleCheckout}
                    disabled={isProcessing}
                >
                    <Text style={styles.checkoutButtonText}>
                        {isProcessing ? 'Processing...' : `Pay ₦${grandTotal.toLocaleString()}`}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Address Selector Modal */}
            <Modal visible={showAddressModal} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { paddingBottom: insets.bottom + 20 }]}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select Delivery Address</Text>
                            <TouchableOpacity onPress={() => setShowAddressModal(false)}>
                                <Text style={styles.modalClose}>✕</Text>
                            </TouchableOpacity>
                        </View>
                        <ScrollView>
                            {mockAddresses.map((addr) => (
                                <TouchableOpacity
                                    key={addr.id}
                                    style={[
                                        styles.modalOption,
                                        selectedAddress.id === addr.id && styles.modalOptionSelected,
                                    ]}
                                    onPress={() => {
                                        setSelectedAddress(addr);
                                        setShowAddressModal(false);
                                    }}
                                >
                                    <View style={styles.modalOptionLeft}>
                                        <MapPin size={18} color={Colors.light.primary} />
                                        <View style={{ flex: 1, marginLeft: 12 }}>
                                            <Text style={styles.modalOptionLabel}>{addr.label}</Text>
                                            <Text style={styles.modalOptionValue}>{addr.address}</Text>
                                        </View>
                                    </View>
                                    <View style={[styles.radioButton, selectedAddress.id === addr.id && styles.radioButtonSelected]} />
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* Time Slot Selector Modal */}
            <Modal visible={showTimeSlotModal} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { paddingBottom: insets.bottom + 20 }]}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select Delivery Time</Text>
                            <TouchableOpacity onPress={() => setShowTimeSlotModal(false)}>
                                <Text style={styles.modalClose}>✕</Text>
                            </TouchableOpacity>
                        </View>
                        <ScrollView>
                            {deliveryTimeSlots.map((slot) => (
                                <TouchableOpacity
                                    key={slot.id}
                                    style={[
                                        styles.modalOption,
                                        selectedTimeSlot.id === slot.id && styles.modalOptionSelected,
                                    ]}
                                    onPress={() => {
                                        setSelectedTimeSlot(slot);
                                        setShowTimeSlotModal(false);
                                    }}
                                >
                                    <View style={styles.modalOptionLeft}>
                                        <Clock size={18} color={Colors.light.primary} />
                                        <View style={{ flex: 1, marginLeft: 12 }}>
                                            <Text style={styles.modalOptionLabel}>{slot.label}</Text>
                                            <Text style={styles.modalOptionValue}>{slot.time}</Text>
                                        </View>
                                    </View>
                                    <View style={[styles.radioButton, selectedTimeSlot.id === slot.id && styles.radioButtonSelected]} />
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* Payment Method Selector Modal */}
            <Modal visible={showPaymentModal} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { paddingBottom: insets.bottom + 20 }]}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select Payment Method</Text>
                            <TouchableOpacity onPress={() => setShowPaymentModal(false)}>
                                <Text style={styles.modalClose}>✕</Text>
                            </TouchableOpacity>
                        </View>
                        <ScrollView>
                            {mockPaymentMethods.map((pm) => (
                                <TouchableOpacity
                                    key={pm.id}
                                    style={[
                                        styles.modalOption,
                                        selectedPayment.id === pm.id && styles.modalOptionSelected,
                                    ]}
                                    onPress={() => {
                                        setSelectedPayment(pm);
                                        setShowPaymentModal(false);
                                    }}
                                >
                                    <View style={styles.modalOptionLeft}>
                                        <CreditCard size={18} color={Colors.light.primary} />
                                        <View style={{ flex: 1, marginLeft: 12 }}>
                                            <Text style={styles.modalOptionLabel}>{pm.brand}</Text>
                                            <Text style={styles.modalOptionValue}>•••• •••• •••• {pm.last4}</Text>
                                        </View>
                                    </View>
                                    <View style={[styles.radioButton, selectedPayment.id === pm.id && styles.radioButtonSelected]} />
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 12,
        backgroundColor: Colors.light.card,
        borderBottomWidth: 1,
        borderBottomColor: Colors.light.border,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.light.backgroundAlt,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: Theme.typography.fontWeight.bold,
        color: Colors.light.text,
    },
    content: {
        padding: 20,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.light.text,
        marginBottom: 12,
    },
    selectorCard: {
        backgroundColor: Colors.light.card,
        borderRadius: Theme.borderRadius.medium,
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    selectorLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: 12,
    },
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.light.primary + '15',
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectorLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: Colors.light.textSecondary,
        marginBottom: 2,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    selectorValue: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.light.text,
    },
    loyaltyCard: {
        backgroundColor: Colors.light.card,
        borderRadius: Theme.borderRadius.medium,
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    loyaltyCardActive: {
        borderColor: Colors.light.secondary,
        backgroundColor: Colors.light.secondary + '10',
    },
    loyaltyLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: 12,
    },
    loyaltyTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: Colors.light.text,
        marginBottom: 2,
    },
    loyaltySubtitle: {
        fontSize: 13,
        color: Colors.light.secondary,
        fontWeight: '600',
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: Colors.light.border,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxActive: {
        backgroundColor: Colors.light.secondary,
        borderColor: Colors.light.secondary,
    },
    checkmark: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '700',
    },
    promoCard: {
        backgroundColor: Colors.light.card,
        borderRadius: Theme.borderRadius.medium,
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    promoInputContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    promoInput: {
        flex: 1,
        fontSize: 14,
        fontWeight: '600',
        color: Colors.light.text,
    },
    applyButton: {
        backgroundColor: Colors.light.primary,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
    },
    applyButtonDisabled: {
        backgroundColor: Colors.light.secondary,
    },
    applyButtonText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    promoSuccessBanner: {
        backgroundColor: Colors.light.secondary + '20',
        padding: 12,
        borderRadius: 8,
        marginTop: 8,
    },
    promoSuccessText: {
        fontSize: 13,
        fontWeight: '600',
        color: Colors.light.secondary,
        textAlign: 'center',
    },
    instructionsInput: {
        backgroundColor: Colors.light.card,
        borderRadius: Theme.borderRadius.medium,
        padding: 14,
        fontSize: 14,
        color: Colors.light.text,
        minHeight: 80,
        borderWidth: 1,
        borderColor: Colors.light.border,
    },
    summaryCard: {
        backgroundColor: Colors.light.card,
        borderRadius: Theme.borderRadius.medium,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    summaryItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    itemName: {
        flex: 1,
        fontSize: 14,
        color: Colors.light.text,
        fontWeight: '500',
    },
    itemPrice: {
        fontSize: 14,
        color: Colors.light.text,
        fontWeight: '700',
    },
    divider: {
        height: 1,
        backgroundColor: Colors.light.border,
        marginVertical: 12,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    totalLabel: {
        fontSize: 14,
        color: Colors.light.textSecondary,
    },
    totalPrice: {
        fontSize: 14,
        color: Colors.light.text,
        fontWeight: '600',
    },
    grandTotal: {
        fontSize: 16,
        fontWeight: '800',
        color: Colors.light.text,
    },
    grandTotalPrice: {
        fontSize: 16,
        fontWeight: '800',
        color: Colors.light.primary,
    },
    termsSection: {
        padding: 12,
        backgroundColor: Colors.light.card,
        borderRadius: 8,
    },
    termsText: {
        fontSize: 12,
        color: Colors.light.textSecondary,
        textAlign: 'center',
        lineHeight: 18,
    },
    footer: {
        position: 'absolute',
        bottom: 76,
        left: 0,
        right: 0,
        padding: 16,
        backgroundColor: Colors.light.card,
        borderTopWidth: 1,
        borderTopColor: Colors.light.border,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 10,
    },
    checkoutButton: {
        backgroundColor: Colors.light.primary,
        paddingVertical: 16,
        borderRadius: Theme.borderRadius.medium,
        alignItems: 'center',
        shadowColor: Colors.light.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    checkoutButtonDisabled: {
        opacity: 0.5,
    },
    checkoutButtonText: {
        color: '#FFFFFF',
        fontWeight: '800',
        fontSize: 16,
        letterSpacing: 0.5,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: Colors.light.card,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingTop: 20,
        paddingHorizontal: 20,
        maxHeight: '70%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: Colors.light.text,
    },
    modalClose: {
        fontSize: 24,
        color: Colors.light.textSecondary,
        fontWeight: '300',
    },
    modalOption: {
        backgroundColor: Colors.light.background,
        borderRadius: Theme.borderRadius.medium,
        padding: 14,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    modalOptionSelected: {
        borderColor: Colors.light.primary,
        backgroundColor: Colors.light.primary + '10',
    },
    modalOptionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    modalOptionLabel: {
        fontSize: 14,
        fontWeight: '700',
        color: Colors.light.text,
        marginBottom: 2,
    },
    modalOptionValue: {
        fontSize: 13,
        color: Colors.light.textSecondary,
    },
    radioButton: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: Colors.light.border,
    },
    radioButtonSelected: {
        borderColor: Colors.light.primary,
        backgroundColor: Colors.light.primary,
    },
});
