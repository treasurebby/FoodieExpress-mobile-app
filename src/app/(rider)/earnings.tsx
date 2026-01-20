import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {
  TrendingUp,
  DollarSign,
  Calendar,
  Package,
  ArrowUpRight,
  Download,
} from 'lucide-react-native';
import { getWeeklyEarnings, getRiderStats, generateMockOrders } from '@/services/riderMockData';

const { width } = Dimensions.get('window');

type PeriodType = 'daily' | 'weekly' | 'monthly';

export default function EarningsScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('weekly');
  const weeklyEarnings = getWeeklyEarnings();
  const stats = getRiderStats();
  const completedOrders = generateMockOrders(5, 'completed');

  const getTotalForPeriod = () => {
    if (selectedPeriod === 'weekly') {
      return weeklyEarnings.reduce((sum, day) => sum + day.totalEarnings, 0);
    }
    return stats.totalEarnings;
  };

  const getDeliveriesForPeriod = () => {
    if (selectedPeriod === 'weekly') {
      return weeklyEarnings.reduce((sum, day) => sum + day.deliveries, 0);
    }
    return stats.totalDeliveries;
  };

  const maxEarning = Math.max(...weeklyEarnings.map(d => d.totalEarnings));

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Earnings</Text>
        <Text style={styles.headerSubtitle}>Track your income</Text>
      </View>

      {/* Period Selector */}
      <View style={styles.periodSelector}>
        <TouchableOpacity
          style={[styles.periodButton, selectedPeriod === 'daily' && styles.activePeriod]}
          onPress={() => setSelectedPeriod('daily')}
        >
          <Text style={[styles.periodText, selectedPeriod === 'daily' && styles.activePeriodText]}>
            Daily
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.periodButton, selectedPeriod === 'weekly' && styles.activePeriod]}
          onPress={() => setSelectedPeriod('weekly')}
        >
          <Text style={[styles.periodText, selectedPeriod === 'weekly' && styles.activePeriodText]}>
            Weekly
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.periodButton, selectedPeriod === 'monthly' && styles.activePeriod]}
          onPress={() => setSelectedPeriod('monthly')}
        >
          <Text style={[styles.periodText, selectedPeriod === 'monthly' && styles.activePeriodText]}>
            Monthly
          </Text>
        </TouchableOpacity>
      </View>

      {/* Total Earnings Card */}
      <View style={styles.totalCard}>
        <View style={styles.totalHeader}>
          <DollarSign size={24} color="#fff" />
          <Text style={styles.totalLabel}>Total Earnings</Text>
        </View>
        <Text style={styles.totalAmount}>₦{getTotalForPeriod().toLocaleString()}</Text>
        <View style={styles.totalMeta}>
          <Text style={styles.totalMetaText}>{getDeliveriesForPeriod()} deliveries</Text>
          <View style={styles.growthBadge}>
            <ArrowUpRight size={12} color="#1B5E20" />
            <Text style={styles.growthText}>+12%</Text>
          </View>
        </View>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <View style={styles.statIcon}>
            <Package size={20} color="#1B5E20" />
          </View>
          <Text style={styles.statValue}>{getDeliveriesForPeriod()}</Text>
          <Text style={styles.statLabel}>Deliveries</Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statIcon}>
            <TrendingUp size={20} color="#1B5E20" />
          </View>
          <Text style={styles.statValue}>₦{Math.floor(getTotalForPeriod() / getDeliveriesForPeriod())}</Text>
          <Text style={styles.statLabel}>Avg/Order</Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statIcon}>
            <Calendar size={20} color="#4CAF50" />
          </View>
          <Text style={styles.statValue}>{weeklyEarnings.length}</Text>
          <Text style={styles.statLabel}>Days Active</Text>
        </View>
      </View>

      {/* Weekly Chart */}
      {selectedPeriod === 'weekly' && (
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Weekly Breakdown</Text>
          <View style={styles.chart}>
            {weeklyEarnings.map((day, index) => {
              const height = (day.totalEarnings / maxEarning) * 120;
              const dayName = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index];
              
              return (
                <View key={index} style={styles.chartBar}>
                  <View style={styles.barContainer}>
                    <View style={[styles.bar, { height }]} />
                  </View>
                  <Text style={styles.barLabel}>{dayName}</Text>
                  <Text style={styles.barAmount}>₦{day.totalEarnings.toLocaleString()}</Text>
                </View>
              );
            })}
          </View>
        </View>
      )}

      {/* Pending Payout */}
      <View style={styles.payoutCard}>
        <View style={styles.payoutHeader}>
          <View>
            <Text style={styles.payoutLabel}>Pending Payout</Text>
            <Text style={styles.payoutAmount}>₦{stats.pendingPayout.toLocaleString()}</Text>
          </View>
          <TouchableOpacity style={styles.withdrawButton}>
            <Download size={18} color="#fff" />
            <Text style={styles.withdrawButtonText}>Withdraw</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.payoutHint}>
          Payouts are processed every Friday at 6 PM
        </Text>
      </View>

      {/* Recent Transactions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        {completedOrders.map((order) => (
          <View key={order.id} style={styles.transactionCard}>
            <View style={styles.transactionLeft}>
              <View style={styles.transactionIcon}>
                <Package size={16} color="#1B5E20" />
              </View>
              <View>
                <Text style={styles.transactionTitle}>Delivery to {order.customer.name}</Text>
                <Text style={styles.transactionTime}>
                  {order.completedAt?.toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </Text>
              </View>
            </View>
            <View style={styles.transactionRight}>
              <Text style={styles.transactionAmount}>+₦{order.deliveryFee}</Text>
              {order.tip && order.tip > 0 && (
                <Text style={styles.transactionTip}>+₦{order.tip} tip</Text>
              )}
            </View>
          </View>
        ))}
      </View>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  periodSelector: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  activePeriod: {
    backgroundColor: '#1B5E20',
    borderColor: '#1B5E20',
  },
  periodText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  activePeriodText: {
    color: '#fff',
  },
  totalCard: {
    backgroundColor: '#1B5E20',
    marginHorizontal: 16,
    padding: 24,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#1B5E20',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  totalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginLeft: 8,
    fontWeight: '600',
  },
  totalAmount: {
    fontSize: 40,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 12,
  },
  totalMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  totalMetaText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '600',
  },
  growthBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 2,
  },
  growthText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '700',
  },
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: '#999',
    fontWeight: '600',
  },
  chartCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 20,
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 160,
  },
  chartBar: {
    flex: 1,
    alignItems: 'center',
  },
  barContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    width: '100%',
    paddingHorizontal: 2,
  },
  bar: {
    backgroundColor: '#1B5E20',
    borderRadius: 4,
    minHeight: 20,
  },
  barLabel: {
    fontSize: 10,
    color: '#999',
    marginTop: 8,
    fontWeight: '600',
  },
  barAmount: {
    fontSize: 9,
    color: '#1B5E20',
    fontWeight: '700',
    marginTop: 2,
  },
  payoutCard: {
    backgroundColor: '#E8F5E9',
    marginHorizontal: 16,
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  payoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  payoutLabel: {
    fontSize: 13,
    color: '#666',
    fontWeight: '600',
    marginBottom: 4,
  },
  payoutAmount: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  withdrawButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1B5E20',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  withdrawButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  payoutHint: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  transactionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  transactionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  transactionTime: {
    fontSize: 12,
    color: '#999',
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1B5E20',
  },
  transactionTip: {
    fontSize: 11,
    color: '#666',
    marginTop: 2,
  },
});
