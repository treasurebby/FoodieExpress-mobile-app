import { Colors } from '@/constants/colors';
import Theme from '@/constants/theme';
import { MenuItem } from '@/types';
import { Minus, Plus, X } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';

interface QuantitySelectorProps {
  visible: boolean;
  onClose: () => void;
  menuItem: MenuItem | null;
  onAddToCart: (item: MenuItem, quantity: number) => void;
}

export default function QuantitySelector({
  visible,
  onClose,
  menuItem,
  onAddToCart,
}: QuantitySelectorProps) {
  const [quantity, setQuantity] = useState(1);

  const handleClose = () => {
    setQuantity(1);
    onClose();
  };

  const handleConfirm = () => {
    if (menuItem) {
      onAddToCart(menuItem, quantity);
      handleClose();
    }
  };

  const incrementQuantity = () => {
    setQuantity((prev) => Math.min(prev + 1, 99));
  };

  const decrementQuantity = () => {
    setQuantity((prev) => Math.max(prev - 1, 1));
  };

  if (!menuItem) return null;

  const totalPrice = menuItem.price * quantity;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Add to Cart</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <X size={24} color={Colors.light.text} />
            </TouchableOpacity>
          </View>

          {/* Item Details */}
          <View style={styles.content}>
            <Image
              source={{ uri: menuItem.image }}
              style={styles.itemImage}
              resizeMode="cover"
            />
            <Text style={styles.itemName}>{menuItem.name}</Text>
            {menuItem.description && (
              <Text style={styles.itemDescription}>{menuItem.description}</Text>
            )}
            <Text style={styles.itemPrice}>₦{menuItem.price.toLocaleString()}</Text>

            {/* Quantity Controls */}
            <View style={styles.quantitySection}>
              <Text style={styles.quantityLabel}>Quantity</Text>
              <View style={styles.quantityControls}>
                <TouchableOpacity
                  style={[styles.quantityButton, quantity === 1 && styles.quantityButtonDisabled]}
                  onPress={decrementQuantity}
                  disabled={quantity === 1}
                >
                  <Minus size={20} color={quantity === 1 ? Colors.light.textSecondary : Colors.light.primary} />
                </TouchableOpacity>
                <Text style={styles.quantityValue}>{quantity}</Text>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={incrementQuantity}
                >
                  <Plus size={20} color={Colors.light.primary} />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <View style={styles.totalSection}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalPrice}>₦{totalPrice.toLocaleString()}</Text>
            </View>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleConfirm}
            >
              <Text style={styles.confirmButtonText}>Add to Cart</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: Colors.light.background,
    borderTopLeftRadius: Theme.borderRadius.xl,
    borderTopRightRadius: Theme.borderRadius.xl,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.xl,
    paddingTop: Theme.spacing.xl,
    paddingBottom: Theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  title: {
    fontSize: Theme.typography.fontSize.xl,
    fontWeight: Theme.typography.fontWeight.bold,
    color: Colors.light.text,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    paddingHorizontal: Theme.spacing.xl,
    paddingVertical: Theme.spacing.lg,
  },
  itemImage: {
    width: '100%',
    height: 200,
    borderRadius: Theme.borderRadius.medium,
    backgroundColor: Colors.light.border,
    marginBottom: Theme.spacing.md,
  },
  itemName: {
    fontSize: Theme.typography.fontSize.xl,
    fontWeight: Theme.typography.fontWeight.bold,
    color: Colors.light.text,
    marginBottom: Theme.spacing.xs,
  },
  itemDescription: {
    fontSize: Theme.typography.fontSize.base,
    color: Colors.light.textSecondary,
    lineHeight: 22,
    marginBottom: Theme.spacing.md,
  },
  itemPrice: {
    fontSize: Theme.typography.fontSize.lg,
    fontWeight: Theme.typography.fontWeight.semibold,
    color: Colors.light.primary,
    marginBottom: Theme.spacing.xl,
  },
  quantitySection: {
    marginTop: Theme.spacing.lg,
  },
  quantityLabel: {
    fontSize: Theme.typography.fontSize.base,
    fontWeight: Theme.typography.fontWeight.semibold,
    color: Colors.light.text,
    marginBottom: Theme.spacing.md,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.backgroundAlt,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.light.primary,
  },
  quantityButtonDisabled: {
    borderColor: Colors.light.border,
    backgroundColor: Colors.light.border,
  },
  quantityValue: {
    fontSize: Theme.typography.fontSize['2xl'],
    fontWeight: Theme.typography.fontWeight.bold,
    color: Colors.light.text,
    minWidth: 40,
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: Theme.spacing.xl,
    paddingVertical: Theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
  },
  totalLabel: {
    fontSize: Theme.typography.fontSize.lg,
    fontWeight: Theme.typography.fontWeight.semibold,
    color: Colors.light.text,
  },
  totalPrice: {
    fontSize: Theme.typography.fontSize['2xl'],
    fontWeight: Theme.typography.fontWeight.bold,
    color: Colors.light.primary,
  },
  confirmButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: Theme.spacing.md,
    borderRadius: Theme.borderRadius.medium,
    alignItems: 'center',
    minHeight: 48,
    justifyContent: 'center',
  },
  confirmButtonText: {
    fontSize: Theme.typography.fontSize.lg,
    fontWeight: Theme.typography.fontWeight.bold,
    color: Colors.light.background,
  },
});
