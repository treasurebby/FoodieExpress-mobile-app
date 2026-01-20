import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  MessageSquare,
  Search,
  Clock,
  CheckCheck,
  Package,
} from 'lucide-react-native';
import { generateMockOrders } from '@/services/riderMockData';

export default function ChatScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const activeOrders = generateMockOrders(5, 'accepted');

  const filteredOrders = activeOrders.filter(order =>
    order.customer.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTimeAgo = (date: Date) => {
    const minutes = Math.floor((new Date().getTime() - date.getTime()) / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        <Text style={styles.headerSubtitle}>Chat with customers</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search conversations..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Chat List */}
      <ScrollView style={styles.chatList} showsVerticalScrollIndicator={false}>
        {filteredOrders.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <MessageSquare size={48} color="#999" />
            </View>
            <Text style={styles.emptyTitle}>No conversations yet</Text>
            <Text style={styles.emptyText}>
              {searchQuery ? 'No results found' : 'Start accepting orders to chat with customers'}
            </Text>
          </View>
        ) : (
          filteredOrders.map((order) => {
            const lastMessageTime = new Date(order.acceptedAt!.getTime() + Math.random() * 600000);
            const messages = [
              "I'm on my way!",
              "Traffic is a bit heavy, will be there in 10 minutes",
              "I've arrived at the restaurant",
              "Your order is ready, heading to you now",
              "Almost there!",
            ];
            const lastMessage = messages[Math.floor(Math.random() * messages.length)];
            const isUnread = Math.random() > 0.6;

            return (
              <TouchableOpacity
                key={order.id}
                style={styles.chatCard}
                onPress={() => router.push({
                  pathname: '/(rider)/chat/[orderId]',
                  params: { 
                    orderId: order.id,
                    customerName: order.customer.name,
                  }
                })}
              >
                <View style={styles.chatAvatar}>
                  <Text style={styles.chatAvatarText}>
                    {order.customer.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </Text>
                </View>

                <View style={styles.chatContent}>
                  <View style={styles.chatHeader}>
                    <Text style={styles.chatName}>
                      {order.customer.name}
                      {isUnread && <View style={styles.unreadDot} />}
                    </Text>
                    <Text style={styles.chatTime}>{getTimeAgo(lastMessageTime)}</Text>
                  </View>

                  <View style={styles.chatPreview}>
                    <View style={styles.orderIdBadge}>
                      <Package size={10} color="#1B5E20" />
                      <Text style={styles.orderIdText}>#{order.id.slice(0, 8)}</Text>
                    </View>
                    <Text style={styles.chatMessage} numberOfLines={1}>
                      {lastMessage}
                    </Text>
                  </View>

                  <View style={styles.chatMeta}>
                    <Text style={styles.restaurantName}>{order.vendor.name}</Text>
                    <View style={styles.statusBadge}>
                      <Text style={styles.statusText}>
                        {order.status === 'accepted' ? 'Picking up' : 'Delivering'}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.quickActionButton}>
          <Text style={styles.quickActionText}>📍 Share Location</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickActionButton}>
          <Text style={styles.quickActionText}>📞 Call Support</Text>
        </TouchableOpacity>
      </View>
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
  searchContainer: {
    padding: 16,
    backgroundColor: '#fff',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#1A1A1A',
  },
  chatList: {
    flex: 1,
  },
  chatCard: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  chatAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#1B5E20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  chatAvatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  chatContent: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  chatName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    flexDirection: 'row',
    alignItems: 'center',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#1B5E20',
    marginLeft: 6,
  },
  chatTime: {
    fontSize: 12,
    color: '#999',
  },
  chatPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 8,
  },
  orderIdBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    gap: 3,
  },
  orderIdText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1B5E20',
  },
  chatMessage: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  chatMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  restaurantName: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  statusBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#2E7D32',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
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
  quickActions: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  quickActionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  quickActionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A1A',
  },
});
