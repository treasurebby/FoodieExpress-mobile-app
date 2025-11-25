import { Colors } from '@/constants/theme';
import { Tabs } from 'expo-router';
import { BarChart2, List, LogOut, ShoppingBag, User } from 'lucide-react-native';
import React from 'react';

export default function VendorLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.light.primary,
        tabBarInactiveTintColor: Colors.light.textSecondary,
        tabBarStyle: { height: 64, paddingBottom: 8, paddingTop: 8 },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{ title: 'Dashboard', tabBarIcon: ({ color, size }) => <ShoppingBag size={size} color={color} /> }}
      />
      <Tabs.Screen
        name="orders"
        options={{ title: 'Orders', tabBarIcon: ({ color, size }) => <List size={size} color={color} /> }}
      />
      <Tabs.Screen
        name="menu"
        options={{ title: 'Menu', tabBarIcon: ({ color, size }) => <BarChart2 size={size} color={color} /> }}
      />
      <Tabs.Screen
        name="analytics"
        options={{ title: 'Analytics', tabBarIcon: ({ color, size }) => <BarChart2 size={size} color={color} /> }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: 'Profile', tabBarIcon: ({ color, size }) => <User size={size} color={color} /> }}
      />
      <Tabs.Screen
        name="logout"
        options={{ title: 'Logout', tabBarIcon: ({ color, size }) => <LogOut size={size} color={color} /> }}
      />
    </Tabs>
  );
}

