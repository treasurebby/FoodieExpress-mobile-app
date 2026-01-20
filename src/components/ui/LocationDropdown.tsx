import { Colors } from '@/constants/colors';
import { MapPin, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  value?: string;
  onChange?: (v: string) => void;
  options?: string[];
};

export default function LocationDropdown({ value, onChange, options = ['Covenant University', 'University of Lagos (UNILAG)', 'University of Ilorin (Unilorin)', 'Other Nigerian University'] }: Props) {
  const [open, setOpen] = useState(false);
  const selectedValue = value ?? options[0];

  const handleSelect = (v: string) => {
    onChange?.(v);
    setOpen(false);
  };

  return (
    <>
      <Pressable onPress={() => setOpen(true)} style={styles.trigger}>
        <MapPin size={16} color={Colors.light.primary} />
        <Text style={styles.triggerText}>{selectedValue}</Text>
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
          <View style={styles.menuContainer}>
            <View style={styles.menuHeader}>
              <Text style={styles.menuTitle}>Select Location</Text>
              <Pressable onPress={() => setOpen(false)}>
                <X size={24} color={Colors.light.text} />
              </Pressable>
            </View>

            <ScrollView style={styles.menuContent}>
              {options.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={[
                    styles.option,
                    selectedValue === item && styles.optionActive,
                  ]}
                  onPress={() => handleSelect(item)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      selectedValue === item && styles.optionTextActive,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: 'transparent',
    gap: 6,
  },
  triggerText: { 
    color: Colors.light.primary, 
    fontWeight: '600', 
    fontSize: 12,
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  menuContainer: {
    backgroundColor: Colors.light.card,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '70%',
    paddingTop: 20,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.text,
  },
  menuContent: {
    paddingHorizontal: 20,
  },
  option: { 
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  optionActive: {
    backgroundColor: Colors.light.primary + '10',
    marginHorizontal: -20,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  optionText: { 
    color: Colors.light.text,
    fontWeight: '500',
    fontSize: 15,
  },
  optionTextActive: {
    color: Colors.light.primary,
    fontWeight: '700',
  },
});
