import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Colors from '../../constants/colors';
import Theme from '../../constants/theme';
import RoleSelectionCard from './RoleSelectionCard';
import WelcomeHeader from './WelcomeHeader';
import { useFadeIn } from './animations';

export default function LoginScreen() {
  const opacity = useFadeIn(500);
  const { width } = useWindowDimensions();
  const navigation: any = useNavigation();

  const onUser = () => {
    // TODO: Ensure React Navigation is configured. Navigate to UserLoginScreen
    navigation.navigate('UserLoginScreen');
  };

  const onVendor = () => {
    // TODO: Ensure React Navigation is configured. Navigate to VendorLoginScreen
    navigation.navigate('VendorLoginScreen');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.inner}>
          <View style={styles.headerWrap}>
            <WelcomeHeader />
          </View>

          <View style={[styles.cards, { width: Math.min(720, width - 40) }] }>
            <RoleSelectionCard
              title="Login as User"
              description="Order delicious meals"
              color={Colors.primary}
              icon={'🧑‍🎓'}
              onPress={onUser}
            />

            <RoleSelectionCard
              title="Login as Vendor"
              description="Manage your restaurant"
              color={Colors.light.secondary}
              icon={'🧑‍🍳'}
              onPress={onVendor}
            />

            <View style={styles.bottomLinks}>
              <Pressable onPress={() => navigation.navigate('SignUpScreen') }>
                <Text style={styles.link}>Don't have an account? Sign up</Text>
              </Pressable>
              <Pressable onPress={() => navigation.navigate('SupportScreen') }>
                <Text style={styles.link}>Support / Help</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1, padding: Theme.spacing.lg },
  inner: { alignItems: 'center' },
  headerWrap: { alignSelf: 'stretch', marginBottom: Theme.spacing.lg },
  cards: {
    alignSelf: 'center',
    alignItems: 'stretch',
    paddingTop: Theme.spacing.sm,
  },
  bottomLinks: { marginTop: Theme.spacing.md, alignItems: 'center' },
  link: { color: Colors.text.secondary, marginTop: 8 }
});
