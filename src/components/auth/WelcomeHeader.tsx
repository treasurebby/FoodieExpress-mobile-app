import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Colors from '../../constants/colors';
import Theme from '../../constants/theme';

export default function WelcomeHeader() {
  return (
    <View style={styles.container}>
      <View style={styles.brandRow}>
        <View style={styles.logo}>
          <Text style={styles.logoWheel}>🛵</Text>
        </View>
        <View>
          <Text style={styles.title}>FoodieExpress</Text>
          <Text style={styles.tagline}>Campus Cravings, Delivered Fast</Text>
        </View>
      </View>

      <Text style={styles.welcome}>Welcome — pick how you want to sign in</Text>

      {/* Optional: small decorative illustration placeholder */}
      <View style={styles.illustrationWrap}>
        <Text style={styles.illustration}>🍔 🍕 🥤</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: Theme.spacing.lg },
  brandRow: { flexDirection: 'row', alignItems: 'center' },
  logo: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Theme.spacing.md,
  },
  logoWheel: { color: '#fff', fontSize: 22 },
  title: { color: Colors.primary, fontSize: 20, fontWeight: '800' },
  tagline: { color: Colors.textSecondary, fontSize: 12 },
  welcome: { marginTop: Theme.spacing.sm, color: Colors.text, fontSize: 15 },
  illustrationWrap: { marginTop: Theme.spacing.md, alignItems: 'flex-start' },
  illustration: { fontSize: 30 },
});
