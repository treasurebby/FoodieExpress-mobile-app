import { useRouter } from 'expo-router';
import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function RoleSelectionScreen() {
  const router = useRouter();

  const roles = [
    {
      id: 'user',
      title: 'Customer',
      description: 'Order delicious food from restaurants',
      icon: '🍽️',
      color: '#4CAF50',
    },
    {
      id: 'vendor',
      title: 'Vendor',
      description: 'Manage your vendor and orders',
      icon: '🍳',
      color: '#2E7D32',
    },
    {
      id: 'rider',
      title: 'Riders',
      description: 'Deliver orders and earn money',
      icon: '🏍️',
      color: '#1B5E20',
    },
  ];

  const handleRoleSelect = (role: string) => {
    router.push({
      pathname: '/(auth)/login',
      params: { role },
    });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Image
          source={require('@/assets/images/image.png')}
          style={styles.logo}
          resizeMode="cover"
        />
        <Text style={styles.title}>FoodieExpress</Text>
        <Text style={styles.subtitle}>Choose your role to continue</Text>
      </View>

      <View style={styles.rolesContainer}>
        {roles.map((role) => (
          <TouchableOpacity
            key={role.id}
            style={[styles.roleCard, { borderTopColor: role.color }]}
            onPress={() => handleRoleSelect(role.id)}
            activeOpacity={0.7}
          >
            <View style={styles.roleIconContainer}>
              <Text style={styles.roleIcon}>{role.icon}</Text>
            </View>
            <View style={styles.roleContent}>
              <Text style={styles.roleTitle}>{role.title}</Text>
              <Text style={styles.roleDescription}>{role.description}</Text>
            </View>
            <Text style={styles.arrow}>→</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          You can change your role anytime after signing up
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F8F4',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 16,
    backgroundColor: '#4CAF50',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  logo: {
    width: 140,
    height: 140,
    borderRadius: 70,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 12,
    backgroundColor: '#fff',
    borderWidth: 5,
    borderColor: '#4CAF50',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1B5E20',
    marginBottom: 8,
    letterSpacing: -0.5,
    textShadowColor: 'rgba(255, 255, 255, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  rolesContainer: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    gap: 16,
  },
  roleCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    borderLeftWidth: 6,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  roleIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: '#F1F8F4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  roleIcon: {
    fontSize: 32,
  },
  roleContent: {
    flex: 1,
  },
  roleTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1B5E20',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  roleDescription: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
  arrow: {
    fontSize: 28,
    color: '#4CAF50',
    marginLeft: 12,
    fontWeight: 'bold',
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#558B2F',
    textAlign: 'center',
    fontStyle: 'italic',
    fontWeight: '500',
  },
});
