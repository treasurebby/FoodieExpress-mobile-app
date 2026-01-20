import { Colors } from '@/constants/colors';
import Theme from '@/constants/theme';
import React from 'react';
import { StyleSheet, Text, TextInput, type TextInputProps, View } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export default function Input({ label, error, leftIcon, rightIcon, style, ...props }: InputProps) {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputContainer, error && styles.inputError]}>
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        <TextInput
          style={[styles.input, leftIcon && styles.inputWithLeftIcon, rightIcon && styles.inputWithRightIcon, style]}
          placeholderTextColor={Colors.light.textSecondary}
          {...props}
        />
        {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Theme.spacing.lg,
  },
  label: {
    fontSize: Theme.typography.fontSize.base,
    fontWeight: Theme.typography.fontWeight.medium,
    color: Colors.light.text,
    marginBottom: Theme.spacing.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: Theme.borderRadius.medium,
    overflow: 'hidden',
  },
  inputError: {
    borderColor: Colors.light.error,
  },
  input: {
    flex: 1,
    paddingVertical: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.lg,
    fontSize: Theme.typography.fontSize.lg,
    color: Colors.light.text,
  },
  inputWithLeftIcon: {
    paddingLeft: Theme.spacing.sm,
  },
  inputWithRightIcon: {
    paddingRight: Theme.spacing.sm,
  },
  leftIcon: {
    paddingLeft: Theme.spacing.lg,
  },
  rightIcon: {
    paddingRight: Theme.spacing.lg,
  },
  errorText: {
    fontSize: Theme.typography.fontSize.sm,
    color: Colors.light.error,
    marginTop: Theme.spacing.xs,
    marginLeft: Theme.spacing.xs,
  },
});
