import { Colors } from '@/constants/colors';
import Theme from '@/constants/theme';
import { X, MapPin, Check } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  TextInput,
} from 'react-native';

interface LocationSelectorProps {
  visible: boolean;
  onClose: () => void;
  currentLocation: string;
  onSelectLocation: (location: string) => void;
}

const NIGERIAN_UNIVERSITIES = [
  'Covenant University',
  'University of Lagos (UNILAG)',
  'University of Ibadan (UI)',
  'Obafemi Awolowo University (OAU)',
  'University of Nigeria, Nsukka (UNN)',
  'Ahmadu Bello University (ABU)',
  'University of Benin (UNIBEN)',
  'Lagos State University (LASU)',
  'Federal University of Technology, Akure (FUTA)',
  'University of Ilorin (UNILORIN)',
  'Babcock University',
  'Redeemer\'s University',
  'Pan-Atlantic University',
  'Bowen University',
  'Landmark University',
  'Federal University of Technology, Minna (FUTMINNA)',
  'University of Port Harcourt (UNIPORT)',
  'Nnamdi Azikiwe University (UNIZIK)',
  'University of Jos (UNIJOS)',
  'Bayero University, Kano (BUK)',
];

export default function LocationSelector({
  visible,
  onClose,
  currentLocation,
  onSelectLocation,
}: LocationSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLocations = NIGERIAN_UNIVERSITIES.filter((location) =>
    location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectLocation = (location: string) => {
    onSelectLocation(location);
    setSearchQuery('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Select Location</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={Colors.light.text} />
            </TouchableOpacity>
          </View>

          {/* Search Input */}
          <View style={styles.searchContainer}>
            <MapPin size={20} color={Colors.light.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search universities..."
              placeholderTextColor={Colors.light.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Location List */}
          <ScrollView
            style={styles.list}
            showsVerticalScrollIndicator={false}
          >
            {filteredLocations.map((location, index) => {
              const isSelected = location === currentLocation;
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.locationItem,
                    isSelected && styles.selectedItem,
                  ]}
                  onPress={() => handleSelectLocation(location)}
                >
                  <MapPin
                    size={20}
                    color={isSelected ? Colors.light.primary : Colors.light.textSecondary}
                  />
                  <Text
                    style={[
                      styles.locationText,
                      isSelected && styles.selectedText,
                    ]}
                  >
                    {location}
                  </Text>
                  {isSelected && (
                    <Check size={20} color={Colors.light.primary} />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
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
    paddingBottom: 20,
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Theme.spacing.xl,
    marginTop: Theme.spacing.lg,
    marginBottom: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    backgroundColor: Colors.light.backgroundAlt,
    borderRadius: Theme.borderRadius.medium,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: Theme.typography.fontSize.base,
    color: Colors.light.text,
    paddingVertical: 8,
  },
  list: {
    flex: 1,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.xl,
    paddingVertical: Theme.spacing.md,
    gap: 12,
  },
  selectedItem: {
    backgroundColor: Colors.light.primary + '10',
  },
  locationText: {
    flex: 1,
    fontSize: Theme.typography.fontSize.base,
    color: Colors.light.text,
    fontWeight: '500',
  },
  selectedText: {
    color: Colors.light.primary,
    fontWeight: '600',
  },
});
