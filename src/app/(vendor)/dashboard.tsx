import React, { useState, useMemo } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import { DollarSign, TrendingUp, Clock, BarChart2, Package } from 'lucide-react-native';
import { getMockVendorStats, getMockVendorOrders, getMockVendorProfile } from '@/services/vendorMockData';

export default function VendorDashboard() {
  const [busy, setBusy] = useState(false);
  const [incoming, setIncoming] = useState(getMockVendorOrders('new'));
  const [current, setCurrent] = useState(getMockVendorOrders('preparing'));

  const profile = getMockVendorProfile();
  const stats = getMockVendorStats();

  const handleBusyModeToggle = (value: boolean) => {
    setBusy(value);
    if (value) {
      Alert.alert('Busy Mode Enabled', 'New orders will be queued with extended prep times.');
    }
  };

  function acceptOrder(orderId: string) {
    const order = incoming.find((o) => o.id === orderId);
    if (!order) return;
    setIncoming((prev) => prev.filter((o) => o.id !== orderId));
    setCurrent((prev) => [{ ...order, status: 'accepted' }, ...prev]);
  }

  function declineOrder(orderId: string) {
    Alert.alert('Decline Order', 'Are you sure you want to decline this order?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Decline',
        style: 'destructive',
        onPress: () => setIncoming((prev) => prev.filter((o) => o.id !== orderId)),
      },
    ]);
  }

  function advanceStatus(orderId: string) {
    setCurrent((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        if (o.status === 'accepted') return { ...o, status: 'preparing' };
        if (o.status === 'preparing') return { ...o, status: 'ready' };
        if (o.status === 'ready') return { ...o, status: 'handed_to_rider' };
        return o;
      })
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good day! 👋</Text>
          <Text style={styles.subtitle}>{profile.name}</Text>
        </View>
        <View style={styles.busyToggle}>
          <Text style={[styles.busyLabel, busy && styles.busyLabelActive]}>
            {busy ? 'Busy' : 'Available'}
          </Text>
          <Switch
            value={busy}
            onValueChange={handleBusyModeToggle}
            trackColor={{ false: '#ddd', true: '#FF6B35' }}
            thumbColor={busy ? '#1B5E20' : '#fff'}
          />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, styles.statCardLarge]}>
            <View style={[styles.statIcon, { backgroundColor: '#E8F5E9' }]}>
              <DollarSign size={24} color="#1B5E20" />
            </View>
            <Text style={styles.statLabel}>Today's Revenue</Text>
            <Text style={styles.statValue}>₦{stats.todayEarnings.toLocaleString()}</Text>
            <View style={styles.statTrend}>
              <TrendingUp size={14} color="#4CAF50" />
              <Text style={styles.statTrendText}>+12% from yesterday</Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: '#E8F5E9' }]}>
                <Package size={20} color="#1B5E20" />
              </View>
              <Text style={styles.statLabel}>Orders</Text>
              <Text style={styles.statValue}>{stats.totalOrders}</Text>
            </View>

            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: '#E8F5E9' }]}>
                <BarChart2 size={20} color="#1B5E20" />
              </View>
              <Text style={styles.statLabel}>Rating</Text>
              <Text style={styles.statValue}>{stats.averageRating.toFixed(1)}</Text>
            </View>
          </View>
        </View>

        {/* Queue Alert */}
        {profile.currentQueueSize > 0 && (
          <View style={styles.alertCard}>
            <Text style={styles.alertTitle}>⚠️ Queue Status</Text>
            <Text style={styles.alertDesc}>
              {profile.currentQueueSize} orders in queue ({profile.maxQueueCapacity} max capacity)
            </Text>
          </View>
        )}

        {/* Incoming Orders */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🔔 Incoming Orders</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{incoming.length}</Text>
            </View>
          </View>

          {incoming.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📭</Text>
              <Text style={styles.emptyText}>No incoming orders</Text>
              <Text style={styles.emptySubtext}>New orders will appear here</Text>
            </View>
          ) : (
            <View style={styles.ordersList}>
              {incoming.map((item) => (
                <View key={item.id} style={styles.orderCard}>
                  <View style={styles.orderHeader}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.customerName}>{item.customerName}</Text>
                      <View style={styles.orderTime}>
                        <Clock size={12} color="#999" />
                        <Text style={styles.orderTimeText}>{item.items.length} items</Text>
                      </View>
                    </View>
                    <Text style={styles.orderAmount}>₦{item.totalAmount.toLocaleString()}</Text>
                  </View>
                  <View style={styles.orderActions}>
                    <TouchableOpacity
                      style={[styles.actionBtn, styles.declineBtn]}
                      onPress={() => declineOrder(item.id)}
                    >
                      <Text style={styles.declineBtnText}>Decline</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionBtn, styles.acceptBtn]}
                      onPress={() => acceptOrder(item.id)}
                    >
                      <Text style={styles.acceptBtnText}>Accept</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Current Orders */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🔥 Orders in Progress</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{current.length}</Text>
            </View>
          </View>

          {current.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>✅</Text>
              <Text style={styles.emptyText}>All caught up!</Text>
              <Text style={styles.emptySubtext}>No orders being prepared</Text>
            </View>
          ) : (
            <View style={styles.ordersList}>
              {current.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.currentOrderCard}
                  onPress={() =>
                    Alert.alert('Update Status', 'Mark this order as ready for pickup?', [
                      { text: 'Cancel' },
                      { text: 'Mark Ready', onPress: () => advanceStatus(item.id) },
                    ])
                  }
                >
                  <View style={styles.orderHeader}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.customerName}>{item.customerName}</Text>
                      <Text style={styles.orderTimeText}>{item.items.length} items</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <View style={styles.statusBadge}>
                        <Text style={styles.statusBadgeText}>
                          {item.status === 'accepted' ? 'Accepting' : item.status === 'preparing' ? 'Preparing' : 'Ready'}
                        </Text>
                      </View>
                      <Text style={styles.orderAmount}>₦{item.totalAmount.toLocaleString()}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    paddingTop: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 24,
    fontWeight: '800',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  busyToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  busyLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  busyLabelActive: {
    color: '#FF6B35',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  statsContainer: {
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statCardLarge: {
    marginBottom: 12,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 13,
    color: '#666',
    marginBottom: 6,
    fontWeight: '600',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#333',
  },
  statTrend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
  },
  statTrendText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
  },
  alertCard: {
    backgroundColor: '#FFF3CD',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B35',
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  alertDesc: {
    fontSize: 12,
    color: '#666',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#333',
  },
  badge: {
    backgroundColor: '#1B5E20',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },
  ordersList: {
    gap: 12,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B35',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  currentOrderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  orderTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  orderTimeText: {
    fontSize: 12,
    color: '#999',
  },
  orderAmount: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1B5E20',
    marginTop: 4,
  },
  orderActions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  acceptBtn: {
    backgroundColor: '#4CAF50',
  },
  declineBtn: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  acceptBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  declineBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
  },
  statusBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1B5E20',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
  },
});
