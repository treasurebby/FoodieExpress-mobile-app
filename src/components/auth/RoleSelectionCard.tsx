import React from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import Colors from '../../constants/colors';
import Theme from '../../constants/theme';
import { useScaleOnPress } from './animations';

type Props = {
  title: string;
  description?: string;
  color?: string;
  icon?: React.ReactNode;
  onPress?: () => void;
};

export default function RoleSelectionCard({ title, description, color = Colors.primary, icon, onPress }: Props) {
  const { scale, down, up } = useScaleOnPress();

  return (
    <Pressable
      onPressIn={down}
      onPressOut={up}
      onPress={onPress}
      style={({ pressed }) => [styles.wrapper, pressed && styles.pressed]}
    >
      <Animated.View style={[styles.card, { transform: [{ scale }] }] }>
        <View style={[styles.iconWrap, { backgroundColor: `${color}15` }] }>
          {/* TODO: Replace emoji with vector icon (react-native-vector-icons or SVG) */}
          <Text style={[styles.iconText, { color }]}>{icon ?? '🍔'}</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          {description ? <Text style={styles.description}>{description}</Text> : null}
        </View>

        <View style={styles.chevWrap}>
          <Text style={styles.chev}>›</Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: { width: '100%', marginBottom: Theme.spacing.lg },
  pressed: { opacity: 0.95 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Theme.spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Theme.borderRadius.md,
    ...Theme.shadows.soft,
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 64,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Theme.spacing.md,
  },
  iconText: { fontSize: 28 },
  content: { flex: 1 },
  title: { fontSize: 16, fontWeight: '700', color: Colors.text },
  description: { fontSize: 13, color: Colors.textSecondary, marginTop: 4 },
  chevWrap: { marginLeft: 8 },
  chev: { fontSize: 26, color: Colors.textSecondary },
});
