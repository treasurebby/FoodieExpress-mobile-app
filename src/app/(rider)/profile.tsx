import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  User,
  Star,
  Shield,
  CreditCard,
  FileText,
  Bell,
  HelpCircle,
  LogOut,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Edit,
  Phone,
  Mail,
  MapPin,
  Bike,
} from 'lucide-react-native';
import { getRiderStats } from '@/services/riderMockData';
import { useAuth } from '@/contexts/AuthContext';

export default function ProfileScreen() {
  const router = useRouter();
  const { logout } = useAuth();
  const stats = getRiderStats();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationSharing, setLocationSharing] = useState(true);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/(auth)/roles');
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      {/* Profile Card */}
      <View style={styles.profileCard}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>JD</Text>
          </View>
          <TouchableOpacity style={styles.editAvatarButton}>
            <Edit size={14} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>John Doe</Text>
          <Text style={styles.profilePhone}>+234 812 345 6789</Text>
          
          <View style={styles.ratingContainer}>
            <Star size={16} color="#4CAF50" fill="#4CAF50" />
            <Text style={styles.ratingText}>{stats.averageRating.toFixed(1)}</Text>
            <Text style={styles.ratingCount}>({stats.totalDeliveries} deliveries)</Text>
          </View>
        </View>
      </View>

      {/* Verification Status */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Verification Status</Text>
        
        <View style={styles.verificationCard}>
          <View style={styles.verificationItem}>
            <CheckCircle size={20} color="#4CAF50" />
            <Text style={styles.verificationText}>Phone Verified</Text>
          </View>
          <View style={styles.verificationItem}>
            <CheckCircle size={20} color="#4CAF50" />
            <Text style={styles.verificationText}>Driver's License</Text>
          </View>
          <View style={styles.verificationItem}>
            <CheckCircle size={20} color="#4CAF50" />
            <Text style={styles.verificationText}>Vehicle Registration</Text>
          </View>
          <View style={styles.verificationItem}>
            <AlertCircle size={20} color="#FF9800" />
            <Text style={[styles.verificationText, { color: '#FF9800' }]}>Bank Account Pending</Text>
          </View>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Performance</Text>
        
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{stats.acceptanceRate}%</Text>
            <Text style={styles.statLabel}>Acceptance</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{stats.totalDeliveries}</Text>
            <Text style={styles.statLabel}>Deliveries</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>₦{stats.totalEarnings.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Earnings</Text>
          </View>
        </View>
      </View>

      {/* Vehicle Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Vehicle Information</Text>
        
        <View style={styles.vehicleCard}>
          <View style={styles.vehicleIcon}>
            <Bike size={24} color="#1B5E20" />
          </View>
          <View style={styles.vehicleInfo}>
            <Text style={styles.vehicleType}>Motorcycle</Text>
            <Text style={styles.vehiclePlate}>ABC-123-XY</Text>
          </View>
          <TouchableOpacity>
            <ChevronRight size={20} color="#999" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Menu Options */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        
        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuIcon}>
            <User size={20} color="#1B5E20" />
          </View>
          <Text style={styles.menuText}>Edit Profile</Text>
          <ChevronRight size={20} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuIcon}>
            <CreditCard size={20} color="#1B5E20" />
          </View>
          <Text style={styles.menuText}>Bank Account</Text>
          <ChevronRight size={20} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuIcon}>
            <FileText size={20} color="#1B5E20" />
          </View>
          <Text style={styles.menuText}>Documents</Text>
          <ChevronRight size={20} color="#999" />
        </TouchableOpacity>
      </View>

      {/* Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        
        <View style={styles.menuItem}>
          <View style={styles.menuIcon}>
            <Bell size={20} color="#1B5E20" />
          </View>
          <Text style={styles.menuText}>Notifications</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: '#E0E0E0', true: '#81C784' }}
            thumbColor={notificationsEnabled ? '#1B5E20' : '#f4f3f4'}
          />
        </View>

        <View style={styles.menuItem}>
          <View style={styles.menuIcon}>
            <MapPin size={20} color="#1B5E20" />
          </View>
          <Text style={styles.menuText}>Location Sharing</Text>
          <Switch
            value={locationSharing}
            onValueChange={setLocationSharing}
            trackColor={{ false: '#E0E0E0', true: '#81C784' }}
            thumbColor={locationSharing ? '#1B5E20' : '#f4f3f4'}
          />
        </View>
      </View>

      {/* Support */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        
        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuIcon}>
            <HelpCircle size={20} color="#1B5E20" />
          </View>
          <Text style={styles.menuText}>Help Center</Text>
          <ChevronRight size={20} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuIcon}>
            <Shield size={20} color="#1B5E20" />
          </View>
          <Text style={styles.menuText}>Safety</Text>
          <ChevronRight size={20} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuIcon}>
            <Phone size={20} color="#1B5E20" />
          </View>
          <Text style={styles.menuText}>Contact Support</Text>
          <ChevronRight size={20} color="#999" />
        </TouchableOpacity>
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <LogOut size={20} color="#666" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>FoodieExpress Rider v1.0.0</Text>
        <Text style={styles.footerText}>© 2024 FoodieExpress. All rights reserved.</Text>
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
  profileCard: {
    backgroundColor: '#fff',
    padding: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1B5E20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
  },
  editAvatarButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#1B5E20',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  profileInfo: {
    alignItems: 'center',
  },
  profileName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  profilePhone: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  ratingCount: {
    fontSize: 14,
    color: '#999',
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  verificationCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  verificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  verificationText: {
    fontSize: 14,
    color: '#1A1A1A',
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1B5E20',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
    fontWeight: '600',
  },
  vehicleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
  },
  vehicleIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleType: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  vehiclePlate: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
    marginHorizontal: 16,
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#666',
  },
  footer: {
    alignItems: 'center',
    marginTop: 32,
    paddingHorizontal: 16,
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
});
