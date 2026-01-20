import { Colors } from '@/constants/colors';
import { QuickReplyOption } from '@/types';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';

interface QuickReplyButtonsProps {
  options: QuickReplyOption[];
  onSelect: (option: QuickReplyOption) => void;
  loading?: boolean;
}

export default function QuickReplyButtons({ options, onSelect, loading = false }: QuickReplyButtonsProps) {
  if (!options || options.length === 0) {
    return null;
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {options.map((option) => (
        <TouchableOpacity
          key={option.id}
          style={styles.button}
          onPress={() => onSelect(option)}
          disabled={loading}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>{option.label}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    maxHeight: 50,
    marginVertical: 8,
  },
  contentContainer: {
    paddingHorizontal: 16,
    gap: 8,
    paddingVertical: 4,
  },
  button: {
    backgroundColor: Colors.light.primary,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    minHeight: 36,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
    textAlign: 'center',
  },
});
