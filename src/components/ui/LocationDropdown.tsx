import Colors from '@/constants/colors';
import Theme from '@/constants/theme';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  value?: string;
  onChange?: (v: string) => void;
  options?: string[];
};

export default function LocationDropdown({ value, onChange, options = ['Covenant University', 'University of Lagos (UNILAG)', 'University of Ilorin (Unilorin)', 'Other Nigerian University'] }: Props) {
  const [open, setOpen] = useState(false);
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, { toValue: open ? 1 : 0, duration: 180, useNativeDriver: true }).start();
  }, [open, anim]);

  const scale = anim.interpolate({ inputRange: [0, 1], outputRange: [0.95, 1] });
  const opacity = anim;

  const handleSelect = (v: string) => {
    onChange?.(v);
    setOpen(false);
  };

  return (
    <View style={styles.wrapper}>
      <Pressable onPress={() => setOpen((s) => !s)} style={styles.trigger}>
        <Text style={styles.triggerText}>{value ?? options[0]}</Text>
        <Text style={styles.chev}>{open ? '˄' : '˅'}</Text>
      </Pressable>

      {open && (
        <Animated.View style={[styles.menu, { opacity, transform: [{ scale }] }]}>
          <FlatList
            data={options}
            keyExtractor={(i) => i}
            renderItem={({ item }) => (
              <Pressable style={styles.option} onPress={() => handleSelect(item)}>
                <Text style={styles.optionText}>{item}</Text>
              </Pressable>
            )}
          />
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { position: 'relative' },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.md,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  triggerText: { color: Colors.text, fontWeight: '600', marginRight: 8 },
  chev: { color: Colors.textSecondary },
  menu: {
    position: 'absolute',
    right: 0,
    marginTop: 8,
    width: 180,
    backgroundColor: Colors.surface,
    borderRadius: Theme.borderRadius.md,
    ...Theme.shadows.card,
    overflow: 'hidden',
  },
  option: { padding: Theme.spacing.md },
  optionText: { color: Colors.text },
});
