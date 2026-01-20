import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  MapPin,
  ChevronRight,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { generateMockOrders, MockOrder } from '@/services/riderMockData';

type TabType = 'pending' | 'active' | 'history';

export default function OrdersScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('active');

  // Generate mock data
  const pendingOrders = generateMockOrders(3, 'pending');
  const activeOrders = generateMockOrders(2, 'accepted');
  const historyOrders = generateMockOrders(10, 'completed');

  const getOrders = () => {
    switch (activeTab) {
      case 'pending':
        return pendingOrders;
      case 'active':
        return activeOrders;
      case 'history':
        return historyOrders;
    }
  };

  const renderOrderCard = ({ item }: { item: MockOrder }) => {
    const isHistory = item.status === 'completed';
    
    return (
      <TouchableOpacity
        style={styles.orderCard}
        activeOpacity={0.7}
      >
        <View style={styles.orderHeader}>
          <View>
            <Text style={styles.orderId}>#{item.id.substring(0, 8)}</Text>
            <Text style={styles.orderTime}>
              {item.createdAt.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </Text>
          </View>
          
          {item.status === 'pending' && (
            <View style={[styles.statusBadge, styles.pendingBadge]}>
              <Clock size={14} color="#FF6B35" />
              <Text style={styles.pendingText}>New Request</Text>
            </View>
          )}
          
          {item.status === 'accepted' && (
            <View style={[styles.statusBadge, styles.activeBadge]}>
              <Package size={14} color="#1B5E20" />
              <Text style={styles.activeText}>In Progress</Text>
            </View>
          )}
          
          {item.status === 'completed' && (
            <View style={[styles.statusBadge, styles.completedBadge]}>
              <CheckCircle2 size={14} color="#1B5E20" />
              <Text style={styles.completedText}>Completed</Text>
            </View>
          )}
        </View>

        <View style={styles.orderRoute}>
          <View style={styles.routeItem}>
            <View style={[styles.routeDot, { backgroundColor: '#FF6B35' }]} />
            <View style={styles.routeDetails}>
              <Text style={styles.routeLabel}>Pickup</Text>
              <Text style={styles.routeText}>{item.vendor.name}</Text>
            </View>
          </View>
          
          <View style={styles.routeLine} />
          
          <View style={styles.routeItem}>
            <View style={[styles.routeDot, { backgroundColor: '#1B5E20' }]} />
            <View style={styles.routeDetails}>
              <Text style={styles.routeLabel}>Delivery</Text>
              <Text style={styles.routeText}>{item.customer.name}</Text>
            </View>
          </View>
        </View>

        <View style={styles.orderFooter}>
          <View style={styles.orderMeta}>
            <MapPin size={14} color="#666" />
            <Text style={styles.metaText}>{item.distance}km</Text>
            <View style={styles.metaSeparator} />
            <Clock size={14} color="#666" />
            <Text style={styles.metaText}>~{item.estimatedTime}min</Text>
          </View>
          
          <View style={styles.feeContainer}>
            <Text style={styles.feeLabel}>Fee</Text>
            <Text style={styles.feeAmount}>₦{item.deliveryFee}</Text>
          </View>
        </View>

        {isHistory && item.rating && (
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingText}>⭐ {item.rating}.0</Text>
            {item.tip && item.tip > 0 && (
              <Text style={styles.tipText}>+₦{item.tip} tip</Text>
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Orders</Text>
        <Text style={styles.headerSubtitle}>Manage your deliveries</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'pending' && styles.activeTab]}
          onPress={() => setActiveTab('pending')}
        >
          <Text style={[styles.tabText, activeTab === 'pending' && styles.activeTabText]}>
            Pending
          </Text>
          {pendingOrders.length > 0 && (
            <View style={styles.tabBadge}>
              <Text style={styles.tabBadgeText}>{pendingOrders.length}</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'active' && styles.activeTab]}
          onPress={() => setActiveTab('active')}
        >
          <Text style={[styles.tabText, activeTab === 'active' && styles.activeTabText]}>
            Active
          </Text>
          {activeOrders.length > 0 && (
            <View style={styles.tabBadge}>
              <Text style={styles.tabBadgeText}>{activeOrders.length}</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'history' && styles.activeTab]}
          onPress={() => setActiveTab('history')}
        >
          <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>
            History
          </Text>
        </TouchableOpacity>
      </View>

      {/* Orders List */}
      <FlatList
        data={getOrders()}
        renderItem={renderOrderCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Package size={64} color="#ccc" />
            <Text style={styles.emptyTitle}>No {activeTab} orders</Text>
            <Text style={styles.emptyText}>
              {activeTab === 'pending' && 'New requests will appear here'}
              {activeTab === 'active' && 'Go online to start receiving orders'}
              {activeTab === 'history' && 'Completed deliveries will show here'}
            </Text>
          </View>
        }
      />
    </View>
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
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  activeTab: {
    backgroundColor: '#E8F5E9',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
  },
  activeTabText: {
    color: '#1B5E20',
  },
  tabBadge: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: 'center',
  },
  tabBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
  },
  listContent: {
    padding: 16,
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
    alignItems: 'center',
    marginBottom: 16,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  orderTime: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  pendingBadge: {
    backgroundColor: '#FFF3E0',
  },
  activeBadge: {
    backgroundColor: '#E8F5E9',
  },
  completedBadge: {
    backgroundColor: '#E8F5E9',
  },
  pendingText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FF6B35',
  },
  activeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1B5E20',
  },
  completedText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1B5E20',
  },
  orderRoute: {
    marginBottom: 16,
  },
  routeItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  routeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 4,
  },
  routeDetails: {
    flex: 1,
    marginLeft: 12,
  },
  routeLabel: {
    fontSize: 11,
    color: '#999',
    fontWeight: '600',
    marginBottom: 2,
  },
  routeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  routeLine: {
    width: 2,
    height: 16,
    backgroundColor: '#E0E0E0',
    marginLeft: 4,
    marginVertical: 4,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  metaSeparator: {
    width: 1,
    height: 12,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 4,
  },
  feeContainer: {
    alignItems: 'flex-end',
  },
  feeLabel: {
    fontSize: 11,
    color: '#999',
    marginBottom: 2,
  },
  feeAmount: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1B5E20',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    gap: 12,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },
  tipText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1B5E20',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#666',
    marginTop: 16,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
});
