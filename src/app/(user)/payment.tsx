import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Check } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppColors from '@/constants/colors';

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  lastDigits?: string;
}

export default function PaymentScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selectedMethod, setSelectedMethod] = useState<string>('card');
  const [loading, setLoading] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: '💳',
      lastDigits: '4242',
    },
    {
      id: 'wallet',
      name: 'Digital Wallet',
      icon: '📱',
    },
    {
      id: 'cash',
      name: 'Cash on Delivery',
      icon: '💵',
    },
  ];

  const handlePayNow = async () => {
    setLoading(true);

    // Simulate payment processing
    setTimeout(() => {
      setLoading(false);
      // Navigate to order confirmation
      router.replace({
        pathname: '/(user)/order-confirmation',
        params: {
          orderId: '#ABC123XYZ',
          restaurantName: 'The Green Bowl',
          items: JSON.stringify([
            { name: 'Grilled Chicken Bowl', qty: 2, price: 12.99 },
            { name: 'Fresh Salad', qty: 1, price: 8.99 },
          ]),
          total: '34.97',
          address: '123 Main St, Apt 4B',
        },
      });
    }, 2000);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Order Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Order Summary</Text>
          <View style={styles.summaryItem}>
            <Text style={styles.itemName}>2x Grilled Chicken Bowl</Text>
            <Text style={styles.itemPrice}>$25.98</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.itemName}>1x Fresh Salad</Text>
            <Text style={styles.itemPrice}>$8.99</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.summaryItem}>
            <Text style={styles.feesLabel}>Delivery Fee</Text>
            <Text style={styles.feesPrice}>$0.00</Text>
          </View>

          <View style={styles.summaryItem}>
            <Text style={styles.feesLabel}>Service Fee</Text>
            <Text style={styles.feesPrice}>$0.00</Text>
          </View>

          <View style={[styles.divider, { marginVertical: 12 }]} />

          <View style={styles.totalItem}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalPrice}>$34.97</Text>
          </View>
        </View>

        {/* Promo Code */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Have a Promo Code?</Text>
          <View style={styles.promoContainer}>
            <TextInput
              placeholder="Enter promo code"
              style={styles.promoInput}
              placeholderTextColor="#999"
            />
            <TouchableOpacity style={styles.applyButton}>
              <Text style={styles.applyButtonText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Payment Methods */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>

          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.methodCard,
                selectedMethod === method.id && styles.methodCardSelected,
              ]}
              onPress={() => setSelectedMethod(method.id)}
            >
              <View style={styles.methodLeft}>
                <Text style={styles.methodIcon}>{method.icon}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.methodName}>{method.name}</Text>
                  {method.lastDigits && (
                    <Text style={styles.methodSubtext}>Ending in {method.lastDigits}</Text>
                  )}
                </View>
              </View>
              <View
                style={[
                  styles.radioButton,
                  selectedMethod === method.id && styles.radioButtonSelected,
                ]}
              >
                {selectedMethod === method.id && (
                  <View style={styles.radioButtonInner} />
                )}
              </View>
            </TouchableOpacity>
          ))}

          {/* Add New Card */}
          <TouchableOpacity
            style={styles.addCardButton}
            onPress={() => setShowCardModal(true)}
          >
            <Text style={styles.addCardButtonText}>+ Add New Card</Text>
          </TouchableOpacity>
        </View>

        {/* Card Details Modal */}
        <Modal
          visible={showCardModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowCardModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={() => setShowCardModal(false)}>
                  <ArrowLeft size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.modalTitle}>Add Card</Text>
                <View style={{ width: 24 }} />
              </View>

              <ScrollView contentContainerStyle={styles.modalBody}>
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Cardholder Name</Text>
                  <TextInput
                    placeholder="John Doe"
                    style={styles.formInput}
                    placeholderTextColor="#999"
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Card Number</Text>
                  <TextInput
                    placeholder="4242 4242 4242 4242"
                    style={styles.formInput}
                    placeholderTextColor="#999"
                    keyboardType="number-pad"
                  />
                </View>

                <View style={styles.formRow}>
                  <View style={[styles.formGroup, { flex: 1 }]}>
                    <Text style={styles.formLabel}>Expiry</Text>
                    <TextInput
                      placeholder="MM/YY"
                      style={styles.formInput}
                      placeholderTextColor="#999"
                    />
                  </View>
                  <View style={[styles.formGroup, { flex: 1 }]}>
                    <Text style={styles.formLabel}>CVV</Text>
                    <TextInput
                      placeholder="123"
                      style={styles.formInput}
                      placeholderTextColor="#999"
                      keyboardType="number-pad"
                    />
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => setShowCardModal(false)}
                >
                  <Text style={styles.modalButtonText}>Add Card</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* Terms & Conditions */}
        <View style={styles.terms}>
          <Text style={styles.termsText}>
            By continuing, you agree to our Terms & Conditions and Privacy Policy
          </Text>
        </View>
      </ScrollView>

      {/* Pay Now Button */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <TouchableOpacity
          style={[styles.payButton, loading && styles.payButtonDisabled]}
          onPress={handlePayNow}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <Text style={styles.payButtonText}>Pay Now • $34.97</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 120,
  },
  summaryCard: {
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  itemName: {
    fontSize: 12,
    color: '#666',
  },
  itemPrice: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 8,
  },
  feesLabel: {
    fontSize: 12,
    color: '#888',
  },
  feesPrice: {
    fontSize: 12,
    fontWeight: '600',
    color: '#888',
  },
  totalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#333',
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1B5E20',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  promoContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  promoInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#333',
  },
  applyButton: {
    backgroundColor: '#F1F8F4',
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#1B5E20',
  },
  applyButtonText: {
    color: '#1B5E20',
    fontWeight: '700',
    fontSize: 12,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#F9F9F9',
  },
  methodCardSelected: {
    borderColor: '#1B5E20',
    backgroundColor: '#F1F8F4',
  },
  methodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  methodIcon: {
    fontSize: 24,
  },
  methodName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#333',
    marginBottom: 2,
  },
  methodSubtext: {
    fontSize: 11,
    color: '#888',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    borderColor: '#1B5E20',
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#1B5E20',
  },
  addCardButton: {
    borderWidth: 1,
    borderColor: '#1B5E20',
    borderStyle: 'dashed',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  addCardButtonText: {
    color: '#1B5E20',
    fontSize: 13,
    fontWeight: '700',
  },
  terms: {
    marginTop: 20,
    paddingHorizontal: 0,
  },
  termsText: {
    fontSize: 11,
    color: '#999',
    textAlign: 'center',
    lineHeight: 16,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  payButton: {
    backgroundColor: '#1B5E20',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  payButtonDisabled: {
    opacity: 0.6,
  },
  payButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  modalBody: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  formGroup: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#333',
    marginBottom: 6,
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#333',
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    backgroundColor: '#1B5E20',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
});
