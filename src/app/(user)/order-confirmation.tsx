import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { CheckCircle, Clock, MapPin, Phone, MessageCircle } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppColors from '@/constants/colors';

interface OrderDetails {
  orderId: string;
  restaurantName: string;
  restaurantImage: string;
  items: Array<{ name: string; qty: number; price: number }>;
  total: number;
  deliveryAddress: string;
  estimatedTime: number;
  riderName: string;
  riderPhone: string;
  riderImage: string;
  riderRating: number;
}

export default function OrderConfirmationScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [scaleAnim] = useState(new Animated.Value(0));
  const params = useLocalSearchParams();

  // Mock order details
  const orderDetails: OrderDetails = {
    orderId: `#${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    restaurantName: (typeof params.restaurantName === 'string' ? params.restaurantName : null) || 'The Green Bowl',
    restaurantImage: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=200&h=200&fit=crop',
    items: JSON.parse((typeof params.items === 'string' ? params.items : '[]')) || [
      { name: 'Grilled Chicken Bowl', qty: 2, price: 12.99 },
      { name: 'Fresh Salad', qty: 1, price: 8.99 },
    ],
    total: parseFloat((typeof params.total === 'string' ? params.total : '0') || '34.97'),
    deliveryAddress: (typeof params.address === 'string' ? params.address : null) || '123 Main St, Apt 4B',
    estimatedTime: 35,
    riderName: 'John Smith',
    riderPhone: '+1 (555) 123-4567',
    riderImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    riderRating: 4.9,
  };

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 40,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, [scaleAnim]);

  const handleTrackOrder = () => {
    router.push({
      pathname: '/(user)/track-order',
      params: { orderId: orderDetails.orderId, restaurantName: orderDetails.restaurantName },
    });
  };

  const handleContactRider = () => {
    router.push({
      pathname: '/(user)/chat',
      params: { type: 'rider', orderId: orderDetails.orderId },
    });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/(user)/home')}>
          <Text style={styles.closeButton}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Confirmed!</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Success Animation */}
        <Animated.View style={[styles.successIcon, { transform: [{ scale: scaleAnim }] }]}>
          <CheckCircle size={80} color="#4CAF50" strokeWidth={1.5} />
        </Animated.View>

        <Text style={styles.successTitle}>Your order is confirmed!</Text>
        <Text style={styles.successSubtitle}>We'll start preparing your food right away.</Text>

        {/* Order ID */}
        <View style={styles.orderIdCard}>
          <Text style={styles.orderIdLabel}>Order ID</Text>
          <Text style={styles.orderId}>{orderDetails.orderId}</Text>
        </View>

        {/* Restaurant Card */}
        <View style={styles.restaurantCard}>
          <Image
            source={{ uri: orderDetails.restaurantImage }}
            style={styles.restaurantImage}
          />
          <View style={styles.restaurantInfo}>
            <Text style={styles.restaurantName}>{orderDetails.restaurantName}</Text>
            <View style={styles.estimatedTimeRow}>
              <Clock size={14} color="#666" />
              <Text style={styles.estimatedTime}>~{orderDetails.estimatedTime} mins</Text>
            </View>
          </View>
        </View>

        {/* Order Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          {orderDetails.items.map((item, idx) => (
            <View key={idx} style={styles.itemRow}>
              <Text style={styles.itemName}>{item.name}</Text>
              <View style={styles.itemRight}>
                <Text style={styles.itemQty}>x{item.qty}</Text>
                <Text style={styles.itemPrice}>${(item.price * item.qty).toFixed(2)}</Text>
              </View>
            </View>
          ))}

          {/* Divider */}
          <View style={styles.divider} />

          {/* Total */}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalPrice}>${orderDetails.total.toFixed(2)}</Text>
          </View>
        </View>

        {/* Delivery Address */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Address</Text>
          <View style={styles.addressCard}>
            <MapPin size={20} color="#1B5E20" />
            <Text style={styles.addressText}>{orderDetails.deliveryAddress}</Text>
          </View>
        </View>

        {/* Assigned Rider */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Rider</Text>
          <View style={styles.riderCard}>
            <Image source={{ uri: orderDetails.riderImage }} style={styles.riderAvatar} />
            <View style={styles.riderInfo}>
              <Text style={styles.riderName}>{orderDetails.riderName}</Text>
              <View style={styles.ratingRow}>
                <Text style={styles.rating}>★ {orderDetails.riderRating}</Text>
                <Text style={styles.riderPhone}>{orderDetails.riderPhone}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.phoneButton}
              onPress={() => alert('Call feature coming soon')}
            >
              <Phone size={18} color="#1B5E20" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.trackButton}
            onPress={handleTrackOrder}
          >
            <Text style={styles.trackButtonText}>Track Order</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.chatButton}
            onPress={handleContactRider}
          >
            <MessageCircle size={18} color="#1B5E20" />
            <Text style={styles.chatButtonText}>Chat with Rider</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.continueShoppingButton}
          onPress={() => router.push('/(user)/home')}
        >
          <Text style={styles.continueShoppingText}>Continue Shopping</Text>
        </TouchableOpacity>
      </ScrollView>
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
    color: '#1B5E20',
  },
  closeButton: {
    fontSize: 24,
    color: '#666',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    paddingBottom: 40,
  },
  successIcon: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1B5E20',
    textAlign: 'center',
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  orderIdCard: {
    backgroundColor: '#F1F8F4',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    alignItems: 'center',
  },
  orderIdLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  orderId: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1B5E20',
    fontFamily: 'monospace',
  },
  restaurantCard: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 12,
    marginBottom: 24,
    alignItems: 'center',
    gap: 12,
  },
  restaurantImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  restaurantInfo: {
    flex: 1,
  },
  restaurantName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
    marginBottom: 6,
  },
  estimatedTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  estimatedTime: {
    fontSize: 12,
    color: '#666',
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
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  itemName: {
    fontSize: 13,
    color: '#333',
    fontWeight: '500',
    flex: 1,
  },
  itemRight: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  itemQty: {
    fontSize: 12,
    color: '#888',
  },
  itemPrice: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1B5E20',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1B5E20',
  },
  addressCard: {
    flexDirection: 'row',
    backgroundColor: '#F1F8F4',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    gap: 12,
  },
  addressText: {
    fontSize: 13,
    color: '#333',
    flex: 1,
    fontWeight: '500',
  },
  riderCard: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    gap: 12,
  },
  riderAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  riderInfo: {
    flex: 1,
  },
  riderName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rating: {
    fontSize: 12,
    color: '#FFB800',
    fontWeight: '600',
  },
  riderPhone: {
    fontSize: 11,
    color: '#888',
  },
  phoneButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F8F4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actions: {
    gap: 12,
    marginBottom: 16,
  },
  trackButton: {
    backgroundColor: '#1B5E20',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  trackButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  chatButton: {
    flexDirection: 'row',
    backgroundColor: '#F1F8F4',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  chatButtonText: {
    color: '#1B5E20',
    fontSize: 14,
    fontWeight: '700',
  },
  continueShoppingButton: {
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
  },
  continueShoppingText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '600',
  },
});
