import { Colors } from '@/constants/theme';
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

const sample = [
  { id: 'c1', name: 'Order o3', status: 'Preparing' },
  { id: 'c2', name: 'Order o4', status: 'Ready' },
];

export default function VendorOrders() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Current Orders</Text>
      <FlatList
        data={sample}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.order}>{item.name}</Text>
            <Text style={styles.status}>{item.status}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background, padding: 16 },
  title: { fontSize: 20, fontWeight: '700', color: Colors.light.text, marginBottom: 12 },
  row: { padding: 12, backgroundColor: Colors.light.card, borderRadius: 8, marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between' },
  order: { color: Colors.light.text, fontWeight: '600' },
  status: { color: Colors.light.textSecondary },
});
