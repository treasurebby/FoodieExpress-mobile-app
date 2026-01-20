import { useAuth } from '@/contexts/AuthContext';
import AppColors from '@/constants/colors';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { CheckCircle2 } from 'lucide-react-native';

export default function VendorOnboardingScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const onboardingSteps = [
    {
      id: 1,
      title: 'Welcome!',
      description: 'Your vendor account has been created successfully.',
      icon: '🎉',
    },
    {
      id: 2,
      title: 'Complete Your Profile',
      description: 'Add your business details and menu items.',
      icon: '🏪',
    },
    {
      id: 3,
      title: 'Business Information',
      description: 'Ensure your business details are accurate.',
      icon: '📋',
    },
    {
      id: 4,
      title: 'Payment Setup',
      description: 'Add your banking information for payouts.',
      icon: '💳',
    },
  ];

  const handleContinue = async () => {
    try {
      setLoading(true);
      // Simulate a brief delay for UX
      await new Promise(resolve => setTimeout(resolve, 500));
      router.replace('/(vendor)/dashboard');
    } catch (err) {
      Alert.alert('Error', 'Failed to proceed to dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Image
          source={require('@/assets/images/image.png')}
          style={styles.logo}
          resizeMode="cover"
        />
        <Text style={styles.welcomeText}>Welcome, {user?.name}!</Text>
        <Text style={styles.subtitle}>Let's get your business started</Text>
      </View>

      <View style={styles.content}>
        {/* Onboarding Steps */}
        <View style={styles.stepsContainer}>
          {onboardingSteps.map((step, index) => (
            <View key={step.id} style={styles.stepWrapper}>
              <View style={styles.stepItem}>
                <View style={styles.stepIconContainer}>
                  <Text style={styles.stepIcon}>{step.icon}</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>{step.title}</Text>
                  <Text style={styles.stepDescription}>{step.description}</Text>
                </View>
                <CheckCircle2 size={24} color="#1B5E20" />
              </View>
              {index < onboardingSteps.length - 1 && <View style={styles.stepDivider} />}
            </View>
          ))}
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoBoxTitle}>📋 Next Steps</Text>
          <Text style={styles.infoBoxText}>
            You can complete your business profile and add menu items anytime from your dashboard settings.
          </Text>
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          style={[styles.continueButton, loading && styles.continueButtonDisabled]}
          onPress={handleContinue}
          disabled={loading}
        >
          <Text style={styles.continueButtonText}>
            {loading ? 'Starting...' : 'Go to Dashboard'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    alignItems: 'center',
    backgroundColor: '#1B5E20',
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 32,
  },
  stepsContainer: {
    marginBottom: 32,
  },
  stepWrapper: {
    marginBottom: 0,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    marginBottom: 8,
  },
  stepIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepIcon: {
    fontSize: 28,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: AppColors.text.primary,
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 13,
    color: AppColors.text.secondary,
  },
  stepDivider: {
    height: 8,
  },
  infoBox: {
    backgroundColor: '#FFF3E0',
    borderWidth: 1,
    borderColor: '#FFE0B2',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 24,
  },
  infoBoxTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: AppColors.text.primary,
    marginBottom: 8,
  },
  infoBoxText: {
    fontSize: 13,
    color: AppColors.text.secondary,
    lineHeight: 20,
  },
  continueButton: {
    backgroundColor: '#1B5E20',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  continueButtonDisabled: {
    opacity: 0.6,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
