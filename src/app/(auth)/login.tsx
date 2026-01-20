import AppColors from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';
import { LoginCredentials } from '@/types';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Eye, EyeOff } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function LoginScreen() {
    const router = useRouter();
    const { role = 'user' } = useLocalSearchParams<{ role?: string }>();
    const { login, error } = useAuth();

    const [formData, setFormData] = useState<LoginCredentials>({
        email: '',
        password: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleInputChange = (field: keyof LoginCredentials, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const validateForm = (): boolean => {
        if (!formData.email.trim()) {
            Alert.alert('Validation Error', 'Email is required');
            return false;
        }
        if (!formData.email.includes('@')) {
            Alert.alert('Validation Error', 'Please enter a valid email');
            return false;
        }
        if (!formData.password) {
            Alert.alert('Validation Error', 'Password is required');
            return false;
        }
        return true;
    };

    const handleLogin = async () => {
        if (!validateForm()) return;

        try {
            setLoading(true);
            await login(formData, role as 'user' | 'vendor' | 'rider');
            // Routing is handled in the index.tsx based on user role
            router.replace('/');
        } catch (err) {
            Alert.alert('Login Failed', error || 'Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
                <Image
                    source={require('@/assets/images/image.png')}
                    style={styles.logoImage}
                    resizeMode="cover"
                />
                <Text style={styles.title}>FoodExpress</Text>
                <Text style={styles.subtitle}>Welcome back</Text>
            </View>

            <View style={styles.form}>
                {/* Email */}
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Email Address</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your email"
                        placeholderTextColor={AppColors.text.disabled}
                        value={formData.email}
                        onChangeText={(text) => handleInputChange('email', text)}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        editable={!loading}
                    />
                </View>

                {/* Password */}
                <View style={styles.formGroup}>
                    <View style={styles.passwordHeader}>
                        <Text style={styles.label}>Password</Text>
                        <TouchableOpacity disabled={loading}>
                            <Text style={styles.forgotPassword}>Forgot?</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.passwordInputContainer}>
                        <TextInput
                            style={styles.passwordInput}
                            placeholder="Enter your password"
                            placeholderTextColor={AppColors.text.disabled}
                            value={formData.password}
                            onChangeText={(text) => handleInputChange('password', text)}
                            secureTextEntry={!showPassword}
                            editable={!loading}
                        />
                        <TouchableOpacity
                            onPress={() => setShowPassword(!showPassword)}
                            disabled={loading}
                            style={styles.eyeIcon}
                        >
                            {showPassword ? (
                                <EyeOff size={20} color={AppColors.text.secondary} />
                            ) : (
                                <Eye size={20} color={AppColors.text.secondary} />
                            )}
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Error Message */}
                {error && (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                )}

                {/* Login Button */}
                <TouchableOpacity
                    style={[styles.loginButton, loading && styles.loginButtonDisabled]}
                    onPress={handleLogin}
                    disabled={loading}
                >
                    <Text style={styles.loginButtonText}>
                        {loading ? 'Logging in...' : 'Login'}
                    </Text>
                </TouchableOpacity>

                {/* Signup Link */}
                <View style={styles.signupLinkContainer}>
                    <Text style={styles.signupLinkText}>Don't have an account? </Text>
                    <TouchableOpacity 
                        onPress={() => {
                            if (role === 'rider') {
                                router.push('/(auth)/rider-signup');
                            } else if (role === 'vendor') {
                                router.push('/(auth)/vendor-signup');
                            } else {
                                router.push('/(auth)/signup');
                            }
                        }} 
                        disabled={loading}
                    >
                        <Text style={styles.signupLink}>Sign up</Text>
                    </TouchableOpacity>
                </View>
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
    logoImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 16,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.9)',
    },
    form: {
        paddingHorizontal: 20,
        paddingVertical: 30,
    },
    formGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: AppColors.text.primary,
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: AppColors.border,
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
        fontSize: 14,
        color: AppColors.text.primary,
        backgroundColor: AppColors.backgroundAlt,
    },
    passwordHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    forgotPassword: {
        fontSize: 12,
        fontWeight: '600',
        color: '#1B5E20',
    },
    passwordInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: AppColors.border,
        borderRadius: 8,
        backgroundColor: AppColors.backgroundAlt,
    },
    passwordInput: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 16,
        fontSize: 14,
        color: AppColors.text.primary,
    },
    eyeIcon: {
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    errorContainer: {
        backgroundColor: '#FFE5E5',
        borderWidth: 1,
        borderColor: AppColors.error,
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    errorText: {
        color: AppColors.error,
        fontSize: 14,
        fontWeight: '500',
    },
    loginButton: {
        backgroundColor: '#1B5E20',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 16,
    },
    loginButtonDisabled: {
        opacity: 0.6,
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
    signupLinkContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    signupLinkText: {
        fontSize: 14,
        color: AppColors.text.secondary,
    },
    signupLink: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1B5E20',
    },
    button: {
        backgroundColor: '#FFA726', // warm light orange to pop on dark green
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 25,
        marginBottom: 15,
        width: '100%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
        elevation: 3,
    },
    secondaryButton: {
        backgroundColor: '#80E27E', // soft mint green harmonious with background
        borderWidth: 0,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    logoWrap: {
        width: 110,
        height: 110,
        borderRadius: 60,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.14,
        shadowRadius: 12,
        elevation: 6,
    },
});
