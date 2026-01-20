import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { DollarSign, Wallet, Download, Plus } from 'lucide-react-native';
import { getMockVendorEarnings, getMockVendorPayouts, getMockVendorBankDetails } from '@/services/vendorMockData';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    backgroundColor: '#1B5E20',
    padding: 20,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    marginBottom: 16,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 16,
  },
  earningsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  earningsCard: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  earningsLabel: {
    color: '#C8E6C9',
    fontSize: 12,
    marginBottom: 4,
  },
  earningsValue: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  mainCard: {
    width: '100%',
    marginBottom: 12,
  },
  pendingCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B35',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pendingText: {
    flex: 1,
  },
  pendingLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  pendingAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FF6B35',
  },
  withdrawBtn: {
    backgroundColor: '#1B5E20',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  withdrawBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    marginTop: 16,
  },
  payoutCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#2E7D32',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  payoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  payoutAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1B5E20',
  },
  payoutStatus: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#E8F5E9',
  },
  payoutStatusText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1B5E20',
  },
  payoutDetails: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  payoutDate: {
    fontSize: 11,
    color: '#999',
  },
  bankCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderTopWidth: 3,
    borderTopColor: '#1B5E20',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bankTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  bankDetail: {
    marginBottom: 10,
  },
  bankDetailLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 2,
  },
  bankDetailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
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
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  submitBtn: {
    backgroundColor: '#1B5E20',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  submitBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelBtn: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  cancelBtnText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default function VendorPayouts() {
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');

  const earnings = getMockVendorEarnings();
  const payouts = getMockVendorPayouts();
  const bankDetails = getMockVendorBankDetails();

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    if (!amount || amount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount');
      return;
    }
    if (amount > earnings.pendingPayout) {
      Alert.alert('Insufficient Balance', `You can only withdraw up to ₦${earnings.pendingPayout.toLocaleString()}`);
      return;
    }
    Alert.alert('Success', 'Withdrawal request submitted. It will be processed within 24-48 hours.');
    setWithdrawAmount('');
    setShowWithdrawModal(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header with Earnings Summary */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>💰 Earnings & Payouts</Text>
          <View style={styles.earningsGrid}>
            <View style={styles.earningsCard}>
              <Text style={styles.earningsLabel}>Total Earnings</Text>
              <Text style={styles.earningsValue}>₦{(earnings.totalEarnings / 1000).toFixed(0)}K</Text>
            </View>
            <View style={styles.earningsCard}>
              <Text style={styles.earningsLabel}>Today</Text>
              <Text style={styles.earningsValue}>₦{(earnings.todayEarnings / 1000).toFixed(0)}K</Text>
            </View>
            <View style={styles.earningsCard}>
              <Text style={styles.earningsLabel}>This Week</Text>
              <Text style={styles.earningsValue}>₦{(earnings.weeklyEarnings / 1000).toFixed(0)}K</Text>
            </View>
            <View style={styles.earningsCard}>
              <Text style={styles.earningsLabel}>This Month</Text>
              <Text style={styles.earningsValue}>₦{(earnings.monthlyEarnings / 1000).toFixed(0)}K</Text>
            </View>
          </View>
        </View>

        {/* Pending Payout */}
        <View style={styles.pendingCard}>
          <View style={styles.pendingText}>
            <Text style={styles.pendingLabel}>Available for Withdrawal</Text>
            <Text style={styles.pendingAmount}>₦{earnings.pendingPayout.toLocaleString()}</Text>
          </View>
          <TouchableOpacity style={styles.withdrawBtn} onPress={() => setShowWithdrawModal(true)}>
            <Text style={styles.withdrawBtnText}>Withdraw</Text>
          </TouchableOpacity>
        </View>

        {/* Fees Breakdown */}
        <View style={styles.bankCard}>
          <Text style={styles.bankTitle}>📊 Fees Breakdown</Text>
          <View style={styles.bankDetail}>
            <Text style={styles.bankDetailLabel}>Commission Rate</Text>
            <Text style={styles.bankDetailValue}>{earnings.commissionRate}% of each order</Text>
          </View>
          <View style={styles.bankDetail}>
            <Text style={styles.bankDetailLabel}>Total Commission Deducted</Text>
            <Text style={styles.bankDetailValue}>₦{earnings.totalCommission.toLocaleString()}</Text>
          </View>
          <View style={styles.bankDetail}>
            <Text style={styles.bankDetailLabel}>Next Payout Date</Text>
            <Text style={styles.bankDetailValue}>
              {new Date(earnings.nextPayoutDate).toLocaleDateString()}
            </Text>
          </View>
        </View>

        {/* Bank Account Details */}
        <View style={styles.bankCard}>
          <Text style={styles.bankTitle}>🏦 Payout Account</Text>
          <View style={styles.bankDetail}>
            <Text style={styles.bankDetailLabel}>Account Holder</Text>
            <Text style={styles.bankDetailValue}>{bankDetails.accountName}</Text>
          </View>
          <View style={styles.bankDetail}>
            <Text style={styles.bankDetailLabel}>Bank</Text>
            <Text style={styles.bankDetailValue}>{bankDetails.bankName}</Text>
          </View>
          <View style={styles.bankDetail}>
            <Text style={styles.bankDetailLabel}>Account Number</Text>
            <Text style={styles.bankDetailValue}>{bankDetails.accountNumber}</Text>
          </View>
          <View style={styles.bankDetail}>
            <Text style={styles.bankDetailLabel}>BVN</Text>
            <Text style={styles.bankDetailValue}>{bankDetails.bvn}</Text>
          </View>
          <TouchableOpacity style={{ marginTop: 12, paddingVertical: 10 }}>
            <Text style={{ color: '#1B5E20', fontWeight: '600', fontSize: 14 }}>Edit Account</Text>
          </TouchableOpacity>
        </View>

        {/* Payout History */}
        <Text style={styles.sectionTitle}>📋 Recent Payouts</Text>
        {payouts.map((payout) => (
          <View key={payout.id} style={styles.payoutCard}>
            <View style={styles.payoutHeader}>
              <Text style={styles.payoutAmount}>₦{payout.amount.toLocaleString()}</Text>
              <View style={styles.payoutStatus}>
                <Text style={styles.payoutStatusText}>
                  {payout.status === 'completed' ? '✓ Completed' : payout.status}
                </Text>
              </View>
            </View>
            <Text style={styles.payoutDetails}>
              {payout.bankAccount.bankName} • {payout.bankAccount.accountNumber}
            </Text>
            {payout.transactionRef && (
              <Text style={styles.payoutDetails}>Ref: {payout.transactionRef}</Text>
            )}
            <Text style={styles.payoutDate}>
              Requested: {new Date(payout.requestedAt).toLocaleDateString()}
              {payout.completedAt && ` • Completed: ${new Date(payout.completedAt).toLocaleDateString()}`}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* Withdraw Modal */}
      <Modal visible={showWithdrawModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Request Withdrawal</Text>

            <Text style={{ fontSize: 13, color: '#666', marginBottom: 12 }}>
              Available Balance: ₦{earnings.pendingPayout.toLocaleString()}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Enter amount (₦)"
              placeholderTextColor="#999"
              keyboardType="decimal-pad"
              value={withdrawAmount}
              onChangeText={setWithdrawAmount}
            />

            <View style={{ backgroundColor: '#E8F5E9', borderRadius: 8, padding: 12, marginBottom: 16 }}>
              <Text style={{ fontSize: 12, color: '#1B5E20' }}>
                ℹ️ Minimum withdrawal: ₦5,000
              </Text>
              <Text style={{ fontSize: 12, color: '#1B5E20', marginTop: 4 }}>
                ℹ️ Processing time: 24-48 hours
              </Text>
            </View>

            <TouchableOpacity style={styles.submitBtn} onPress={handleWithdraw}>
              <Text style={styles.submitBtnText}>Request Withdrawal</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => {
                setShowWithdrawModal(false);
                setWithdrawAmount('');
              }}
            >
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
