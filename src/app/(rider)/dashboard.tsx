import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Power,
  TrendingUp,
  Package,
  Star,
  Clock,
  MapPin,
  Phone,
  CheckCircle,
  X,
  Navigation,
} from 'lucide-react-native';
import { generateMockOrders, getTodayEarnings, getRiderStats } from '@/services/riderMockData';

export default function RiderDashboard() {
  const router = useRouter();
  const [isOnline, setIsOnline] = useState(false);
  const [scaleAnim] = useState(new Animated.Value(1));
  const [orders, setOrders] = useState(generateMockOrders(3, 'pending'));
  const todayEarnings = getTodayEarnings();
  const stats = getRiderStats();

  const toggleOnline = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();

    setIsOnline(!isOnline);
    if (!isOnline) {
      Alert.alert('You are now online', 'You will start receiving orders');
    }
  };

  const acceptOrder = (orderId: string) => {
    setOrders(orders.filter(o => o.id !== orderId));
    Alert.alert('Order Accepted', 'Navigate to Orders tab to see details', [
      { text: 'OK' },
      { text: 'Go to Orders', onPress: () => router.push('/(rider)/orders') },
    ]);
  };

  const rejectOrder = (orderId: string) => {
    setOrders(orders.filter(o => o.id !== orderId));
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, Rider!</Text>
          <Text style={styles.subGreeting}>
            {isOnline ? 'You are online and ready' : 'Go online to receive orders'}
          </Text>
        </View>
      </View>

      {/* Online Status Toggle */}
      <Animated.View style={[styles.statusCard, { transform: [{ scale: scaleAnim }] }]}>
        <View style={styles.statusLeft}>
          <View style={[styles.statusDot, isOnline && styles.statusDotOnline]} />
          <View>
            <Text style={styles.statusTitle}>
              {isOnline ? 'You are Online' : 'You are Offline'}
            </Text>
            <Text style={styles.statusSubtitle}>
              {isOnline ? 'Receiving orders' : 'Tap to go online'}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={[styles.toggleButton, isOnline && styles.toggleButtonActive]}
          onPress={toggleOnline}
        >
          <Power size={20} color={isOnline ? '#fff' : '#999'} />
        </TouchableOpacity>
      </Animated.View>

      {/* Earnings Card */}
      <View style={styles.earningsCard}>
        <View style={styles.earningsHeader}>
          <TrendingUp size={20} color="#fff" />
          <Text style={styles.earningsLabel}>Today's Earnings</Text>
        </View>
        <Text style={styles.earningsAmount}>₦{todayEarnings.total.toLocaleString()}</Text>
        <View style={styles.earningsMeta}>
          <Text style={styles.earningsMetaText}>{todayEarnings.deliveries} deliveries completed</Text>
          <Text style={styles.earningsMetaText}>₦{todayEarnings.tips} in tips</Text>
        </View>
      </View>

      {/* Quick Stats */}
      <View style={styles.quickStats}>
        <View style={styles.statCard}>
          <View style={styles.statIcon}>
            <Star size={18} color="#4CAF50" fill="#4CAF50" />
          </View>
          <Text style={styles.statValue}>{stats.averageRating.toFixed(1)}</Text>
          <Text style={styles.statLabel}>Rating</Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statIcon}>
            <Package size={18} color="#1B5E20" />
          </View>
          <Text style={styles.statValue}>{stats.acceptanceRate}%</Text>
          <Text style={styles.statLabel}>Acceptance</Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statIcon}>
            <Clock size={18} color="#2E7D32" />
          </View>
          <Text style={styles.statValue}>{stats.totalDeliveries}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
      </View>

      {/* Pending Orders */}
      {isOnline && orders.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>New Orders ({orders.length})</Text>
          {orders.map((order) => (
            <View key={order.id} style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <View>
                  <Text style={styles.orderVendor}>{order.vendor.name}</Text>
                  <Text style={styles.orderCustomer}>To: {order.customer.name}</Text>
                </View>
                <View style={styles.orderFee}>
                  <Text style={styles.orderFeeLabel}>Delivery Fee</Text>
                  <Text style={styles.orderFeeAmount}>₦{order.deliveryFee}</Text>
                </View>
              </View>

              <View style={styles.orderRoute}>
                <View style={styles.routePoint}>
                  <View style={styles.pickupDot} />
                  <View>
                    <Text style={styles.routeLabel}>Pickup</Text>
                    <Text style={styles.routeAddress}>{order.vendor.address}</Text>
                  </View>
                </View>
                <View style={styles.routeLine} />
                <View style={styles.routePoint}>
                  <View style={styles.deliveryDot} />
                  <View>
                    <Text style={styles.routeLabel}>Delivery</Text>
                    <Text style={styles.routeAddress}>{order.customer.address}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.orderMeta}>
                <View style={styles.metaItem}>
                  <MapPin size={14} color="#999" />
                  <Text style={styles.metaText}>{order.distance.toFixed(1)} km</Text>
                </View>
                <View style={styles.metaItem}>
                  <Clock size={14} color="#999" />
                  <Text style={styles.metaText}>~{order.estimatedTime} mins</Text>
                </View>
                <View style={styles.metaItem}>
                  <Package size={14} color="#999" />
                  <Text style={styles.metaText}>{order.items.length} items</Text>
                </View>
              </View>

              <View style={styles.orderActions}>
                <TouchableOpacity
                  style={styles.rejectButton}
                  onPress={() => rejectOrder(order.id)}
                >
                  <X size={18} color="#666" />
                  <Text style={styles.rejectButtonText}>Reject</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.acceptButton}
                  onPress={() => acceptOrder(order.id)}
                >
                  <CheckCircle size={18} color="#fff" />
                  <Text style={styles.acceptButtonText}>Accept</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Empty State */}
      {isOnline && orders.length === 0 && (
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Package size={48} color="#999" />
          </View>
          <Text style={styles.emptyTitle}>No pending orders</Text>
          <Text style={styles.emptyText}>
            You're all caught up! New orders will appear here.
          </Text>
        </View>
      )}

      {/* Offline State */}
      {!isOnline && (
        <View style={styles.offlineState}>
          <View style={styles.offlineIcon}>
            <Power size={48} color="#999" />
          </View>
          <Text style={styles.offlineTitle}>You are offline</Text>
          <Text style={styles.offlineText}>
            Go online to start receiving delivery requests
          </Text>
          <TouchableOpacity style={styles.goOnlineButton} onPress={toggleOnline}>
            <Text style={styles.goOnlineButtonText}>Go Online</Text>
          </TouchableOpacity>
        </View>
      )}

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
  greeting: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  subGreeting: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  statusCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#E0E0E0',
  },
  statusDotOnline: {
    backgroundColor: '#4CAF50',
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  statusSubtitle: {
    fontSize: 13,
    color: '#999',
    marginTop: 2,
  },
  toggleButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  toggleButtonActive: {
    backgroundColor: '#1B5E20',
    borderColor: '#1B5E20',
  },
  earningsCard: {
    backgroundColor: '#1B5E20',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 24,
    borderRadius: 16,
    shadowColor: '#1B5E20',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  earningsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  earningsLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginLeft: 8,
    fontWeight: '600',
  },
  earningsAmount: {
    fontSize: 36,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 12,
  },
  earningsMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  earningsMetaText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '600',
  },
  quickStats: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 16,
    gap: 12,
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
    width: 36,
    height: 36,
    borderRadius: 18,
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
  section: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  orderVendor: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  orderCustomer: {
    fontSize: 13,
    color: '#999',
    marginTop: 4,
  },
  orderFee: {
    alignItems: 'flex-end',
  },
  orderFeeLabel: {
    fontSize: 11,
    color: '#999',
    marginBottom: 2,
  },
  orderFeeAmount: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1B5E20',
  },
  orderRoute: {
    marginBottom: 16,
  },
  routePoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  pickupDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#1B5E20',
    marginTop: 4,
  },
  deliveryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#F44336',
    marginTop: 4,
  },
  routeLine: {
    width: 2,
    height: 16,
    backgroundColor: '#E0E0E0',
    marginLeft: 5,
    marginVertical: 4,
  },
  routeLabel: {
    fontSize: 11,
    color: '#999',
    fontWeight: '600',
    marginBottom: 2,
  },
  routeAddress: {
    fontSize: 13,
    color: '#1A1A1A',
    fontWeight: '600',
  },
  orderMeta: {
    flexDirection: 'row',
    gap: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F0F0F0',
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  orderActions: {
    flexDirection: 'row',
    gap: 12,
  },
  rejectButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: '#F5F5F5',
    gap: 6,
  },
  rejectButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#666',
  },
  acceptButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: '#1B5E20',
    gap: 6,
  },
  acceptButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
  },
  offlineState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  offlineIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  offlineTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  offlineText: {
    fontSize: 15,
    color: '#999',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  goOnlineButton: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: '#1B5E20',
  },
  goOnlineButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
});
