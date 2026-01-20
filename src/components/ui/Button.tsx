import { Colors } from '@/constants/colors';
import Theme from '@/constants/theme';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, type TouchableOpacityProps } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  fullWidth?: boolean;
}

export default function Button({
  title,
  variant = 'primary',
  size = 'medium',
  loading = false,
  fullWidth = false,
  disabled,
  style,
  ...props
}: ButtonProps) {
  const buttonStyles = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
    style,
  ];

  const textStyles = [
    styles.text,
    styles[`${variant}Text`],
    styles[`${size}Text`],
    disabled && styles.disabledText,
  ];

  return (
    <TouchableOpacity {...props} style={buttonStyles} disabled={disabled || loading}>
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' || variant === 'ghost' ? Colors.light.primary : Colors.light.background}
          size="small"
        />
      ) : (
        <Text style={textStyles}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Theme.borderRadius.medium,
  },
  fullWidth: {
    width: '100%',
  },

  // Variants
  primary: {
    backgroundColor: Colors.light.primary,
  },
  secondary: {
    backgroundColor: Colors.light.secondary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Colors.light.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  danger: {
    backgroundColor: Colors.light.error,
  },

  // Sizes
  small: {
    paddingVertical: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.lg,
    minHeight: 44,
  },
  medium: {
    paddingVertical: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.xl,
    minHeight: 48,
  },
  large: {
    paddingVertical: Theme.spacing.lg,
    paddingHorizontal: Theme.spacing.xxl,
    minHeight: 54,
  },

  // Disabled
  disabled: {
    opacity: 0.5,
  },

  // Text styles
  text: {
    fontWeight: Theme.typography.fontWeight.semibold,
  },
  primaryText: {
    color: Colors.light.background,
    fontSize: Theme.typography.fontSize.lg,
  },
  secondaryText: {
    color: Colors.light.background,
    fontSize: Theme.typography.fontSize.lg,
  },
  outlineText: {
    color: Colors.light.primary,
    fontSize: Theme.typography.fontSize.lg,
  },
  ghostText: {
    color: Colors.light.primary,
    fontSize: Theme.typography.fontSize.lg,
  },
  dangerText: {
    color: Colors.light.background,
    fontSize: Theme.typography.fontSize.lg,
  },

  // Size text
  smallText: {
    fontSize: Theme.typography.fontSize.base,
  },
  mediumText: {
    fontSize: Theme.typography.fontSize.lg,
  },
  largeText: {
    fontSize: Theme.typography.fontSize.xl,
  },

  disabledText: {
    opacity: 1,
  },
});
