import { Colors } from '@/constants/theme';
import React, { useState } from 'react';
import {
    Alert,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface CardDetails {
    cardNumber: string;
    cardName: string;
    expiryDate: string;
    cvv: string;
}

interface PaymentModalProps {
    visible: boolean;
    amount: number;
    onClose: () => void;
    onPaymentSuccess: (transactionId: string) => void;
    paymentMethod: 'card' | 'transfer' | 'cash';
}

export const PaymentModal = ({
    visible,
    amount,
    onClose,
    onPaymentSuccess,
    paymentMethod,
}: PaymentModalProps) => {
    const [cardDetails, setCardDetails] = useState<CardDetails>({
        cardNumber: '',
        cardName: '',
        expiryDate: '',
        cvv: '',
    });
    const [isProcessing, setIsProcessing] = useState(false);

    const handleCardNumberChange = (value: string) => {
        // Format as XXXX XXXX XXXX XXXX
        const cleaned = value.replace(/\D/g, '');
        const formatted = cleaned.replace(/(\d{4})/g, '$1 ').trim();
        setCardDetails({ ...cardDetails, cardNumber: formatted.slice(0, 19) });
    };

    const handleExpiryChange = (value: string) => {
        // Format as MM/YY
        const cleaned = value.replace(/\D/g, '');
        if (cleaned.length >= 2) {
            const formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
            setCardDetails({ ...cardDetails, expiryDate: formatted });
        } else {
            setCardDetails({ ...cardDetails, expiryDate: cleaned });
        }
    };

    const handleCVVChange = (value: string) => {
        const cleaned = value.replace(/\D/g, '').slice(0, 4);
        setCardDetails({ ...cardDetails, cvv: cleaned });
    };

    const validateCardDetails = (): boolean => {
        if (!cardDetails.cardNumber || cardDetails.cardNumber.replace(/\s/g, '').length !== 16) {
            Alert.alert('Invalid', 'Please enter a valid 16-digit card number');
            return false;
        }
        if (!cardDetails.cardName) {
            Alert.alert('Invalid', 'Please enter cardholder name');
            return false;
        }
        if (!cardDetails.expiryDate || !/^\d{2}\/\d{2}$/.test(cardDetails.expiryDate)) {
            Alert.alert('Invalid', 'Please enter expiry date as MM/YY');
            return false;
        }
        if (!cardDetails.cvv || cardDetails.cvv.length < 3) {
            Alert.alert('Invalid', 'Please enter a valid CVV');
            return false;
        }
        return true;
    };

    const processCardPayment = async () => {
        if (!validateCardDetails()) return;

        setIsProcessing(true);
        try {
            // Simulate API call to payment gateway
            await new Promise((resolve) => setTimeout(resolve, 2500));

            // Generate transaction ID
            const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            onPaymentSuccess(transactionId);
            onClose();
        } catch (error) {
            Alert.alert('Payment Failed', 'Failed to process payment. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    const processBankTransfer = async () => {
        setIsProcessing(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 1500));
            const transactionId = `BANK_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            onPaymentSuccess(transactionId);
            onClose();
        } catch (error) {
            Alert.alert('Error', 'Failed to process transfer');
        } finally {
            setIsProcessing(false);
        }
    };

    const processCashPayment = async () => {
        Alert.alert(
            'Cash on Delivery',
            'Payment will be collected at delivery. Confirm this order?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Confirm',
                    onPress: async () => {
                        setIsProcessing(true);
                        try {
                            await new Promise((resolve) => setTimeout(resolve, 1000));
                            const transactionId = `CASH_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                            onPaymentSuccess(transactionId);
                            onClose();
                        } finally {
                            setIsProcessing(false);
                        }
                    },
                },
            ]
        );
    };

    return (
        <Modal visible={visible} animationType="slide" transparent={true}>
            <View style={styles.overlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>
                            {paymentMethod === 'card'
                                ? 'Card Payment'
                                : paymentMethod === 'transfer'
                                  ? 'Bank Transfer'
                                  : 'Cash on Delivery'}
                        </Text>
                        <TouchableOpacity
                            onPress={onClose}
                            disabled={isProcessing}
                        >
                            <Text style={styles.closeBtn}>✕</Text>
                        </TouchableOpacity>
                    </View>

                    {paymentMethod === 'card' && (
                        <View style={styles.formContainer}>
                            <View style={styles.amountBox}>
                                <Text style={styles.amountLabel}>Amount to Pay</Text>
                                <Text style={styles.amountValue}>₦{amount.toLocaleString()}</Text>
                            </View>

                            <Text style={styles.inputLabel}>Card Number</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="XXXX XXXX XXXX XXXX"
                                placeholderTextColor={Colors.light.textSecondary}
                                value={cardDetails.cardNumber}
                                onChangeText={handleCardNumberChange}
                                editable={!isProcessing}
                                keyboardType="numeric"
                            />

                            <Text style={styles.inputLabel}>Cardholder Name</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Full name on card"
                                placeholderTextColor={Colors.light.textSecondary}
                                value={cardDetails.cardName}
                                onChangeText={(text) =>
                                    setCardDetails({ ...cardDetails, cardName: text })
                                }
                                editable={!isProcessing}
                            />

                            <View style={styles.rowInputs}>
                                <View style={styles.flexInput}>
                                    <Text style={styles.inputLabel}>Expiry (MM/YY)</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="MM/YY"
                                        placeholderTextColor={Colors.light.textSecondary}
                                        value={cardDetails.expiryDate}
                                        onChangeText={handleExpiryChange}
                                        editable={!isProcessing}
                                        keyboardType="numeric"
                                    />
                                </View>
                                <View style={styles.flexInput}>
                                    <Text style={styles.inputLabel}>CVV</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="123"
                                        placeholderTextColor={Colors.light.textSecondary}
                                        value={cardDetails.cvv}
                                        onChangeText={handleCVVChange}
                                        editable={!isProcessing}
                                        keyboardType="numeric"
                                        secureTextEntry
                                    />
                                </View>
                            </View>

                            <TouchableOpacity
                                style={[styles.payBtn, isProcessing && styles.payBtnDisabled]}
                                onPress={processCardPayment}
                                disabled={isProcessing}
                            >
                                <Text style={styles.payBtnText}>
                                    {isProcessing ? 'Processing...' : `Pay ₦${amount.toLocaleString()}`}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {paymentMethod === 'transfer' && (
                        <View style={styles.formContainer}>
                            <View style={styles.infoBox}>
                                <Text style={styles.infoLabel}>Bank Details</Text>
                                <View style={styles.bankDetail}>
                                    <Text style={styles.bankDetailLabel}>Bank Name:</Text>
                                    <Text style={styles.bankDetailValue}>FoodieBank Ltd</Text>
                                </View>
                                <View style={styles.bankDetail}>
                                    <Text style={styles.bankDetailLabel}>Account Number:</Text>
                                    <Text style={styles.bankDetailValue}>1234567890</Text>
                                </View>
                                <View style={styles.bankDetail}>
                                    <Text style={styles.bankDetailLabel}>Amount:</Text>
                                    <Text style={styles.amountHighlight}>₦{amount.toLocaleString()}</Text>
                                </View>
                            </View>

                            <Text style={styles.instructionText}>
                                Please transfer the exact amount to the account above. You will receive a confirmation
                                message once the payment is verified.
                            </Text>

                            <TouchableOpacity
                                style={[styles.payBtn, isProcessing && styles.payBtnDisabled]}
                                onPress={processBankTransfer}
                                disabled={isProcessing}
                            >
                                <Text style={styles.payBtnText}>
                                    {isProcessing ? 'Processing...' : 'I have transferred the money'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {paymentMethod === 'cash' && (
                        <View style={styles.formContainer}>
                            <View style={styles.infoBox}>
                                <Text style={styles.infoLabel}>Cash on Delivery</Text>
                                <Text style={styles.infoText}>
                                    You will pay ₦{amount.toLocaleString()} when the order is delivered.
                                </Text>
                            </View>

                            <TouchableOpacity
                                style={[styles.payBtn, isProcessing && styles.payBtnDisabled]}
                                onPress={processCashPayment}
                                disabled={isProcessing}
                            >
                                <Text style={styles.payBtnText}>
                                    {isProcessing ? 'Processing...' : 'Confirm Order'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    <TouchableOpacity
                        style={styles.cancelBtn}
                        onPress={onClose}
                        disabled={isProcessing}
                    >
                        <Text style={styles.cancelBtnText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: Colors.light.card,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 32,
        maxHeight: '90%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: Colors.light.text,
    },
    closeBtn: {
        fontSize: 24,
        color: Colors.light.textSecondary,
        width: 32,
        height: 32,
        textAlign: 'center',
        lineHeight: 32,
    },
    formContainer: {
        marginBottom: 16,
    },
    amountBox: {
        backgroundColor: Colors.light.background,
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
        alignItems: 'center',
    },
    amountLabel: {
        fontSize: 12,
        color: Colors.light.textSecondary,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    amountValue: {
        fontSize: 32,
        fontWeight: '800',
        color: Colors.light.primary,
        marginTop: 8,
    },
    inputLabel: {
        fontSize: 12,
        color: Colors.light.text,
        fontWeight: '600',
        marginBottom: 8,
        textTransform: 'uppercase',
    },
    input: {
        borderWidth: 1,
        borderColor: Colors.light.border,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 12,
        fontSize: 14,
        color: Colors.light.text,
        marginBottom: 16,
        backgroundColor: Colors.light.background,
    },
    rowInputs: {
        flexDirection: 'row',
        gap: 12,
    },
    flexInput: {
        flex: 1,
    },
    infoBox: {
        backgroundColor: Colors.light.background,
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
    },
    infoLabel: {
        fontSize: 14,
        fontWeight: '700',
        color: Colors.light.text,
        marginBottom: 12,
    },
    bankDetail: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: Colors.light.border,
    },
    bankDetailLabel: {
        fontSize: 12,
        color: Colors.light.textSecondary,
        fontWeight: '600',
    },
    bankDetailValue: {
        fontSize: 14,
        fontWeight: '700',
        color: Colors.light.text,
    },
    amountHighlight: {
        fontSize: 16,
        fontWeight: '800',
        color: Colors.light.primary,
    },
    instructionText: {
        fontSize: 13,
        color: Colors.light.textSecondary,
        lineHeight: 20,
        marginBottom: 20,
        backgroundColor: Colors.light.background,
        padding: 12,
        borderRadius: 8,
    },
    infoText: {
        fontSize: 14,
        color: Colors.light.text,
        lineHeight: 22,
        marginTop: 12,
    },
    payBtn: {
        backgroundColor: Colors.light.primary,
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 12,
        shadowColor: Colors.light.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    payBtnDisabled: {
        opacity: 0.6,
    },
    payBtnText: {
        fontSize: 16,
        fontWeight: '700',
        color: 'white',
    },
    cancelBtn: {
        borderTopWidth: 1,
        borderTopColor: Colors.light.border,
        paddingTop: 16,
        alignItems: 'center',
    },
    cancelBtnText: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.light.textSecondary,
    },
});
