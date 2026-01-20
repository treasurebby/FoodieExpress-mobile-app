import { Colors } from '@/constants/colors';
import { VendorDashboardOrder } from '@/types';
import { AlertCircle, CheckCircle, Clock, Package, Phone, Search, Truck, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const allOrders: VendorDashboardOrder[] = [
  { id: 'o1', customer: 'Tunde A.', items: ['Jollof Rice', 'Suya'], amount: 3200, status: 'incoming', time: new Date(Date.now() - 5 * 60000), createdAt: new Date(Date.now() - 5 * 60000).toISOString() },
  { id: 'o2', customer: 'Amaka N.', items: ['Shawarma'], amount: 1500, status: 'preparing', time: new Date(Date.now() - 12 * 60000), createdAt: new Date(Date.now() - 12 * 60000).toISOString() },
  { id: 'o3', customer: 'Ibrahim K.', items: ['Amala & Ewedu'], amount: 2500, status: 'ready', time: new Date(Date.now() - 2 * 60000), createdAt: new Date(Date.now() - 2 * 60000).toISOString() },
  { id: 'o4', customer: 'Chioma E.', items: ['Pepper Soup'], amount: 2000, status: 'completed', time: new Date(Date.now() - 60 * 60000), createdAt: new Date(Date.now() - 60 * 60000).toISOString() },
  { id: 'o5', customer: 'Musa D.', items: ['Fried Rice', 'Chicken'], amount: 3500, status: 'out_for_delivery', time: new Date(Date.now() - 8 * 60000), createdAt: new Date(Date.now() - 8 * 60000).toISOString() },
  { id: 'o6', customer: 'Blessing O.', items: ['Suya Combo'], amount: 1800, status: 'incoming', time: new Date(Date.now() - 1 * 60000), createdAt: new Date(Date.now() - 1 * 60000).toISOString() },
];

type FilterType = 'all' | 'incoming' | 'preparing' | 'ready' | 'out_for_delivery' | 'completed';

const getStatusColor = (status: string) => {
  switch(status) {
    case 'incoming': return { bg: '#FEF3C7', text: '#92400E' };
    case 'preparing': return { bg: '#DBEAFE', text: '#0C4A6E' };
    case 'ready': return { bg: '#D1FAE5', text: '#065F46' };
    case 'out_for_delivery': return { bg: '#E0E7FF', text: '#3730A3' };
    case 'completed': return { bg: '#F3F4F6', text: '#374151' };
    default: return { bg: Colors.light.border, text: Colors.light.text };
  }
};

const getStatusIcon = (status: string) => {
  switch(status) {
    case 'incoming': return <AlertCircle size={16} color="#92400E" />;
    case 'preparing': return <Clock size={16} color="#0C4A6E" />;
    case 'ready': return <Package size={16} color="#065F46" />;
    case 'out_for_delivery': return <Truck size={16} color="#3730A3" />;
    case 'completed': return <CheckCircle size={16} color="#374151" />;
    default: return null;
  }
};

const getStatusLabel = (status: string) => {
  switch(status) {
    case 'incoming': return 'New';
    case 'preparing': return 'Preparing';
    case 'ready': return 'Ready';
    case 'out_for_delivery': return 'Out for Delivery';
    case 'completed': return 'Completed';
    default: return status;
  }
};

export default function VendorOrders() {
  const [orders, setOrders] = useState<VendorDashboardOrder[]>(allOrders);
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<VendorDashboardOrder | null>(null);
  const [detailsVisible, setDetailsVisible] = useState(false);

  // Filter orders based on selected filter and search
  const filteredOrders = orders.filter((order) => {
    const matchesFilter = filter === 'all' || order.status === filter;
    const matchesSearch =
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some(item => item.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const getOrderCount = (status: FilterType) => {
    if (status === 'all') return orders.length;
    return orders.filter(o => o.status === status).length;
  };

  const handleOrderPress = (order: VendorDashboardOrder) => {
    setSelectedOrder(order);
    setDetailsVisible(true);
  };

  const handleUpdateStatus = (orderId: string, newStatus: VendorDashboardOrder['status']) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  const handleCallCustomer = () => {
    Alert.alert('Call Customer', 'Calling feature coming soon!');
  };

  const handleCancelOrder = (orderId: string) => {
    Alert.alert('Cancel Order', 'Are you sure you want to cancel this order?', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Yes, Cancel',
        style: 'destructive',
        onPress: () => {
          setOrders(orders.filter(o => o.id !== orderId));
          setDetailsVisible(false);
          Alert.alert('Order Cancelled', 'Order has been cancelled');
        }
      }
    ]);
  };

  const renderFilterButton = (label: string, value: FilterType) => {
    const isActive = filter === value;
    const count = getOrderCount(value);

    return (
      <TouchableOpacity
        style={[styles.filterButton, isActive && styles.filterButtonActive]}
        onPress={() => setFilter(value)}
      >
        <Text style={[styles.filterButtonText, isActive && styles.filterButtonTextActive]}>
          {label}
        </Text>
        <View style={[styles.filterBadge, isActive && styles.filterBadgeActive]}>
          <Text style={[styles.filterBadgeText, isActive && styles.filterBadgeTextActive]}>
            {count}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderOrderCard = ({ item }: { item: VendorDashboardOrder }) => {
    const statusColor = getStatusColor(item.status);
    const timeAgo = Math.floor((Date.now() - item.time.getTime()) / 60000);

    return (
      <TouchableOpacity style={styles.card} onPress={() => handleOrderPress(item)}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.customerName}>{item.customer}</Text>
            <Text style={styles.orderId}>Order #{item.id.toUpperCase()}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusColor.bg }]}>
            {getStatusIcon(item.status)}
            <Text style={[styles.statusText, { color: statusColor.text }]}>
              {getStatusLabel(item.status)}
            </Text>
          </View>
        </View>
        <Text style={styles.items}>{item.items.join(', ')}</Text>
        <View style={styles.cardFooter}>
          <Text style={styles.amount}>₦{item.amount.toLocaleString()}</Text>
          <Text style={styles.time}>{timeAgo < 1 ? 'Just now' : `${timeAgo} min ago`}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Orders</Text>
          <Text style={styles.subtitle}>{filteredOrders.length} {filter === 'all' ? 'total' : filter} orders</Text>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color={Colors.light.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by customer, order ID, or item..."
            placeholderTextColor={Colors.light.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={20} color={Colors.light.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        {renderFilterButton('All', 'all')}
        {renderFilterButton('New', 'incoming')}
        {renderFilterButton('Preparing', 'preparing')}
        {renderFilterButton('Ready', 'ready')}
        {renderFilterButton('Delivery', 'out_for_delivery')}
      </View>

      {/* Orders List */}
      <FlatList
        data={filteredOrders}
        keyExtractor={(i) => i.id}
        renderItem={renderOrderCard}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Package size={48} color={Colors.light.textSecondary} />
            <Text style={styles.emptyText}>No orders found</Text>
            <Text style={styles.emptySubtext}>
              {searchQuery ? 'Try a different search term' : 'New orders will appear here'}
            </Text>
          </View>
        }
      />

      {/* Order Details Modal */}
      <Modal
        visible={detailsVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setDetailsVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedOrder && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Order Details</Text>
                  <TouchableOpacity onPress={() => setDetailsVisible(false)}>
                    <X size={24} color={Colors.light.text} />
                  </TouchableOpacity>
                </View>

                <View style={styles.modalBody}>
                  {/* Order Info */}
                  <View style={styles.detailSection}>
                    <Text style={styles.detailLabel}>Order ID</Text>
                    <Text style={styles.detailValue}>#{selectedOrder.id.toUpperCase()}</Text>
                  </View>

                  <View style={styles.detailSection}>
                    <Text style={styles.detailLabel}>Customer</Text>
                    <Text style={styles.detailValue}>{selectedOrder.customer}</Text>
                  </View>

                  <View style={styles.detailSection}>
                    <Text style={styles.detailLabel}>Status</Text>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(selectedOrder.status).bg }]}>
                      {getStatusIcon(selectedOrder.status)}
                      <Text style={[styles.statusText, { color: getStatusColor(selectedOrder.status).text }]}>
                        {getStatusLabel(selectedOrder.status)}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.detailSection}>
                    <Text style={styles.detailLabel}>Items</Text>
                    {selectedOrder.items.map((item, idx) => (
                      <View key={idx} style={styles.itemRow}>
                        <Text style={styles.itemBullet}>•</Text>
                        <Text style={styles.itemText}>{item}</Text>
                      </View>
                    ))}
                  </View>

                  <View style={styles.detailSection}>
                    <Text style={styles.detailLabel}>Total Amount</Text>
                    <Text style={styles.detailAmount}>₦{selectedOrder.amount.toLocaleString()}</Text>
                  </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.modalActions}>
                  {selectedOrder.status !== 'completed' && (
                    <TouchableOpacity
                      style={styles.callButton}
                      onPress={handleCallCustomer}
                    >
                      <Phone size={18} color={Colors.light.primary} />
                      <Text style={styles.callButtonText}>Call Customer</Text>
                    </TouchableOpacity>
                  )}

                  {selectedOrder.status === 'incoming' && (
                    <TouchableOpacity
                      style={styles.statusButton}
                      onPress={() => handleUpdateStatus(selectedOrder.id, 'preparing')}
                    >
                      <Text style={styles.statusButtonText}>Accept & Start Preparing</Text>
                    </TouchableOpacity>
                  )}

                  {selectedOrder.status === 'preparing' && (
                    <TouchableOpacity
                      style={styles.statusButton}
                      onPress={() => handleUpdateStatus(selectedOrder.id, 'ready')}
                    >
                      <Text style={styles.statusButtonText}>Mark as Ready</Text>
                    </TouchableOpacity>
                  )}

                  {selectedOrder.status === 'ready' && (
                    <TouchableOpacity
                      style={styles.statusButton}
                      onPress={() => handleUpdateStatus(selectedOrder.id, 'out_for_delivery')}
                    >
                      <Text style={styles.statusButtonText}>Out for Delivery</Text>
                    </TouchableOpacity>
                  )}

                  {selectedOrder.status === 'out_for_delivery' && (
                    <TouchableOpacity
                      style={styles.statusButton}
                      onPress={() => handleUpdateStatus(selectedOrder.id, 'completed')}
                    >
                      <Text style={styles.statusButtonText}>Mark as Completed</Text>
                    </TouchableOpacity>
                  )}

                  {selectedOrder.status !== 'completed' && (
                    <TouchableOpacity
                      style={styles.cancelButton}
                      onPress={() => handleCancelOrder(selectedOrder.id)}
                    >
                      <Text style={styles.cancelButtonText}>Cancel Order</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, paddingTop: 20, borderBottomWidth: 1, borderBottomColor: Colors.light.border },
  title: { fontSize: 24, fontWeight: '800', color: Colors.light.text },
  subtitle: { fontSize: 14, color: Colors.light.textSecondary, marginTop: 4 },
  searchContainer: { paddingHorizontal: 16, paddingVertical: 12 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.light.card, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, gap: 8 },
  searchInput: { flex: 1, fontSize: 14, color: Colors.light.text },
  filtersContainer: { flexDirection: 'row', paddingHorizontal: 16, gap: 8, paddingBottom: 12 },
  filterButton: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, backgroundColor: Colors.light.card, flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderColor: Colors.light.border },
  filterButtonActive: { backgroundColor: Colors.light.primary, borderColor: Colors.light.primary },
  filterButtonText: { fontSize: 13, fontWeight: '600', color: Colors.light.text },
  filterButtonTextActive: { color: 'white' },
  filterBadge: { backgroundColor: Colors.light.border, borderRadius: 10, paddingHorizontal: 6, paddingVertical: 2, minWidth: 20, alignItems: 'center' },
  filterBadgeActive: { backgroundColor: 'rgba(255,255,255,0.3)' },
  filterBadgeText: { fontSize: 11, fontWeight: '700', color: Colors.light.text },
  filterBadgeTextActive: { color: 'white' },
  list: { padding: 12, paddingBottom: 48 },
  card: { backgroundColor: Colors.light.card, borderRadius: 12, padding: 14, marginBottom: 10, borderLeftWidth: 4, borderLeftColor: Colors.light.primary, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  customerName: { fontSize: 16, fontWeight: '700', color: Colors.light.text },
  orderId: { fontSize: 12, color: Colors.light.textSecondary, marginTop: 3 },
  statusBadge: { flexDirection: 'row', gap: 6, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6, alignItems: 'center' },
  statusText: { fontSize: 12, fontWeight: '600' },
  items: { fontSize: 13, color: Colors.light.text, marginBottom: 10, lineHeight: 18 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTopWidth: 1, borderTopColor: Colors.light.border },
  amount: { fontSize: 17, fontWeight: '800', color: Colors.light.primary },
  time: { fontSize: 12, color: Colors.light.textSecondary, fontWeight: '600' },
  emptyState: { alignItems: 'center', paddingVertical: 60 },
  emptyText: { fontSize: 18, fontWeight: '700', color: Colors.light.text, marginTop: 16 },
  emptySubtext: { fontSize: 14, color: Colors.light.textSecondary, marginTop: 6 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: Colors.light.background, borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '85%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: Colors.light.border },
  modalTitle: { fontSize: 20, fontWeight: '800', color: Colors.light.text },
  modalBody: { padding: 20, maxHeight: 400 },
  detailSection: { marginBottom: 20 },
  detailLabel: { fontSize: 12, fontWeight: '700', color: Colors.light.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 },
  detailValue: { fontSize: 16, fontWeight: '600', color: Colors.light.text },
  detailAmount: { fontSize: 24, fontWeight: '800', color: Colors.light.primary },
  itemRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 6 },
  itemBullet: { fontSize: 16, color: Colors.light.primary, marginRight: 8, marginTop: 2 },
  itemText: { fontSize: 15, color: Colors.light.text, fontWeight: '500', flex: 1 },
  modalActions: { padding: 20, gap: 10, borderTopWidth: 1, borderTopColor: Colors.light.border },
  callButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.light.card, padding: 14, borderRadius: 10, gap: 8, borderWidth: 1.5, borderColor: Colors.light.primary },
  callButtonText: { fontSize: 15, fontWeight: '700', color: Colors.light.primary },
  statusButton: { backgroundColor: Colors.light.primary, padding: 16, borderRadius: 10, alignItems: 'center' },
  statusButtonText: { fontSize: 15, fontWeight: '800', color: 'white' },
  cancelButton: { backgroundColor: Colors.light.card, padding: 14, borderRadius: 10, alignItems: 'center', borderWidth: 1, borderColor: Colors.light.error },
  cancelButtonText: { fontSize: 14, fontWeight: '700', color: Colors.light.error },
});
