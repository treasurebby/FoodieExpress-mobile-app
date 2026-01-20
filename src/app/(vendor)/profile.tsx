import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Colors } from '@/constants/colors';
import AppColors from '@/constants/colors';
import Theme from '@/constants/theme';
import { useRouter } from 'expo-router';
import { LogOut, ShieldCheck, HelpCircle, Moon, Sun } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

export default function VendorProfile() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { colorScheme, toggleTheme } = useTheme();
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          try {
            setLoading(true);
            await logout();
            router.replace('/(auth)/roles');
          } catch (err) {
            console.error('Logout error:', err);
            Alert.alert('Error', 'Failed to logout');
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Vendor Profile</Text>
      <Text style={styles.subtitle}>{user?.name || 'Vendor'}</Text>

      {/* Preferences */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>

        <View style={styles.settingRow}>
          <View style={styles.settingLeft}>
            {colorScheme === 'dark' ? (
              <Moon size={20} color={Colors.light.textSecondary} />
            ) : (
              <Sun size={20} color={Colors.light.textSecondary} />
            )}
            <Text style={styles.settingLabel}>Dark Mode</Text>
          </View>
          <Switch
            value={colorScheme === 'dark'}
            onValueChange={toggleTheme}
            trackColor={{ false: Colors.light.border, true: Colors.light.secondary }}
            thumbColor={Colors.light.background}
          />
        </View>
      </View>

      {/* Account Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>

        <TouchableOpacity style={styles.settingRow} disabled={loading}>
          <View style={styles.settingLeft}>
            <ShieldCheck size={20} color={Colors.light.textSecondary} />
            <Text style={styles.settingLabel}>Privacy Policy</Text>
          </View>
          <Text style={styles.settingArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingRow} disabled={loading}>
          <View style={styles.settingLeft}>
            <HelpCircle size={20} color={Colors.light.textSecondary} />
            <Text style={styles.settingLabel}>Help & Support</Text>
          </View>
          <Text style={styles.settingArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.settingRow, styles.logoutRow]} 
          onPress={handleLogout}
          disabled={loading}
        >
          <View style={styles.settingLeft}>
            <LogOut size={20} color={Colors.light.error} />
            <Text style={[styles.settingLabel, styles.logoutLabel]}>Sign Out</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    padding: Theme.spacing.lg,
  },
  title: {
    fontSize: Theme.typography.fontSize['3xl'],
    fontWeight: Theme.typography.fontWeight.bold,
    color: Colors.light.text,
    marginBottom: Theme.spacing.xs,
  },
  subtitle: {
    fontSize: Theme.typography.fontSize.lg,
    color: Colors.light.textSecondary,
    marginBottom: Theme.spacing.xl,
  },
  section: {
    marginBottom: Theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: Theme.typography.fontSize.lg,
    fontWeight: Theme.typography.fontWeight.semibold,
    color: Colors.light.text,
    marginBottom: Theme.spacing.md,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Theme.spacing.lg,
    paddingHorizontal: Theme.spacing.md,
    backgroundColor: Colors.light.card,
    borderRadius: Theme.borderRadius.medium,
    marginBottom: Theme.spacing.sm,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.md,
  },
  settingLabel: {
    fontSize: Theme.typography.fontSize.lg,
    color: Colors.light.text,
    fontWeight: Theme.typography.fontWeight.medium,
  },
  settingArrow: {
    fontSize: 24,
    color: Colors.light.textSecondary,
  },
  logoutRow: {
    backgroundColor: '#FFEBEE',
  },
  logoutLabel: {
    color: Colors.light.error,
  },
});
