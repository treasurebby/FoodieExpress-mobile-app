import { Colors } from '@/constants/colors';
import { MenuItem } from '@/types';
import { Edit2, Plus, Trash2, X } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface MenuItemWithId extends MenuItem {
  id: string;
}

const mockMenuItems: MenuItemWithId[] = [
  { id: '1', name: 'Jollof Rice + Chicken', description: 'Fragrant rice with grilled chicken', price: 2500, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300', available: true, category: 'Main Course', restaurantId: 'r1' },
  { id: '2', name: 'Chicken Shawarma', description: 'Spiced chicken in pita bread', price: 1200, image: 'https://images.unsplash.com/photo-1599599810694-a5c5b0c0c5e0?w=300', available: true, category: 'Sandwiches', restaurantId: 'r1' },
];

export default function VendorMenu() {
  const [items, setItems] = useState<MenuItemWithId[]>(mockMenuItems);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
  });

  const resetForm = () => {
    setFormData({ name: '', description: '', price: '', category: '' });
    setEditingId(null);
  };

  const openModal = (item?: MenuItemWithId) => {
    if (item) {
      setFormData({
        name: item.name,
        description: item.description,
        price: item.price.toString(),
        category: item.category,
      });
      setEditingId(item.id);
    } else {
      resetForm();
    }
    setModalVisible(true);
  };

  const saveItem = () => {
    if (!formData.name.trim() || !formData.price.trim()) {
      Alert.alert('Validation', 'Name and price are required');
      return;
    }

    if (editingId) {
      setItems(items.map(i => 
        i.id === editingId 
          ? { ...i, ...formData, price: parseFloat(formData.price) }
          : i
      ));
    } else {
      const newId = (Math.max(...items.map(i => parseInt(i.id)), 0) + 1).toString();
      setItems([...items, {
        id: newId,
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300',
        available: true,
        restaurantId: 'r1',
      }]);
    }

    setModalVisible(false);
    resetForm();
    Alert.alert('Success', editingId ? 'Item updated' : 'Item added');
  };

  const deleteItem = (id: string) => {
    Alert.alert('Delete Item', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Delete', 
        onPress: () => {
          setItems(items.filter(i => i.id !== id));
          Alert.alert('Success', 'Item deleted');
        },
        style: 'destructive'
      },
    ]);
  };

  const toggleAvailability = (id: string) => {
    setItems(items.map(i => i.id === id ? { ...i, available: !i.available } : i));
  };

  const renderItem = ({ item }: { item: MenuItemWithId }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.price}>₦{item.price}</Text>
          <Text style={[styles.availabilityBadge, item.available ? styles.available : styles.unavailable]}>
            {item.available ? 'Available' : 'Out of Stock'}
          </Text>
        </View>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => toggleAvailability(item.id)} style={styles.iconBtn}>
          <Text style={styles.toggleText}>{item.available ? '✓' : '×'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => openModal(item)} style={styles.iconBtn}>
          <Edit2 size={18} color={Colors.light.primary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => deleteItem(item.id)} style={styles.iconBtn}>
          <Trash2 size={18} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Menu Management</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => openModal()}>
          <Plus size={20} color="white" />
          <Text style={styles.addBtnText}>Add Item</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(i) => i.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>No items yet. Add one to get started!</Text>}
      />

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{editingId ? 'Edit Item' : 'Add New Item'}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={24} color={Colors.light.text} />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Item Name"
              placeholderTextColor={Colors.light.textSecondary}
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Description"
              placeholderTextColor={Colors.light.textSecondary}
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
              multiline
              numberOfLines={2}
            />
            <TextInput
              style={styles.input}
              placeholder="Price (₦)"
              placeholderTextColor={Colors.light.textSecondary}
              keyboardType="decimal-pad"
              value={formData.price}
              onChangeText={(text) => setFormData({ ...formData, price: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Category"
              placeholderTextColor={Colors.light.textSecondary}
              value={formData.category}
              onChangeText={(text) => setFormData({ ...formData, category: text })}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={saveItem}>
                <Text style={styles.saveBtnText}>{editingId ? 'Update' : 'Add'} Item</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: Colors.light.border },
  title: { fontSize: 22, fontWeight: '700', color: Colors.light.text },
  addBtn: { flexDirection: 'row', backgroundColor: Colors.light.primary, padding: 10, borderRadius: 8, gap: 6, alignItems: 'center' },
  addBtnText: { color: 'white', fontWeight: '600' },
  list: { padding: 12, paddingBottom: 48 },
  empty: { textAlign: 'center', color: Colors.light.textSecondary, padding: 32 },
  card: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: Colors.light.card, padding: 12, borderRadius: 8, marginBottom: 10 },
  cardContent: { flex: 1 },
  itemName: { fontSize: 16, fontWeight: '700', color: Colors.light.text, marginBottom: 4 },
  description: { fontSize: 13, color: Colors.light.textSecondary, marginBottom: 6 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  price: { fontSize: 14, fontWeight: '700', color: Colors.light.primary },
  availabilityBadge: { fontSize: 11, fontWeight: '600', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  available: { backgroundColor: '#D1FAE5', color: '#065F46' },
  unavailable: { backgroundColor: '#FEE2E2', color: '#991B1B' },
  actions: { flexDirection: 'row', gap: 8 },
  iconBtn: { padding: 8 },
  toggleText: { fontSize: 18, fontWeight: '700', color: Colors.light.secondary },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: Colors.light.background, padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 20, fontWeight: '700', color: Colors.light.text },
  input: { backgroundColor: Colors.light.card, borderWidth: 1, borderColor: Colors.light.border, borderRadius: 8, padding: 12, marginBottom: 12, color: Colors.light.text, fontSize: 14 },
  modalActions: { flexDirection: 'row', gap: 12, marginTop: 16 },
  cancelBtn: { flex: 1, backgroundColor: Colors.light.card, padding: 12, borderRadius: 8, alignItems: 'center' },
  cancelBtnText: { color: Colors.light.text, fontWeight: '600' },
  saveBtn: { flex: 1, backgroundColor: Colors.light.primary, padding: 12, borderRadius: 8, alignItems: 'center' },
  saveBtnText: { color: 'white', fontWeight: '700' },
});
