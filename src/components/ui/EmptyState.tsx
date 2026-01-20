import { Colors } from '@/constants/colors';
import Theme from '@/constants/theme';
import { Search, ShoppingBag, MessageCircle, AlertCircle } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface EmptyStateProps {
  icon?: 'search' | 'bag' | 'message' | 'alert' | React.ReactNode;
  title: string;
  description?: string;
}

export default function EmptyState({ icon = 'alert', title, description }: EmptyStateProps) {
  const renderIcon = () => {
    if (React.isValidElement(icon)) {
      return icon;
    }

    const iconProps = {
      size: 64,
      color: Colors.light.textSecondary,
      strokeWidth: 1.5,
    };

    switch (icon) {
      case 'search':
        return <Search {...iconProps} />;
      case 'bag':
        return <ShoppingBag {...iconProps} />;
      case 'message':
        return <MessageCircle {...iconProps} />;
      case 'alert':
      default:
        return <AlertCircle {...iconProps} />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>{renderIcon()}</View>
      <Text style={styles.title}>{title}</Text>
      {description && <Text style={styles.description}>{description}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.xxl,
    paddingVertical: Theme.spacing.huge,
  },
  iconContainer: {
    marginBottom: Theme.spacing.lg,
    opacity: 0.6,
  },
  title: {
    fontSize: Theme.typography.fontSize.xl,
    fontWeight: Theme.typography.fontWeight.semibold,
    color: Colors.light.text,
    textAlign: 'center',
    marginBottom: Theme.spacing.sm,
  },
  description: {
    fontSize: Theme.typography.fontSize.base,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});
