import AppColors, { Colors } from '@/constants/colors';
import Theme from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useRouter } from 'expo-router';
import {
    ArrowLeft,
    Award,
    ChevronRight,
    CreditCard,
    FileText,
    Gift,
    Heart,
    HelpCircle,
    Home,
    LogOut,
    Mail,
    Moon,
    Phone,
    Plus,
    ShieldCheck,
    ShoppingBag,
    Sun,
    Trash2,
    Wallet,
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Alert,
    Clipboard,
    Image,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Mock data for saved addresses
const mockAddresses = [
    { id: 'addr1', label: 'Home', address: '12 Oduduwa Street, Ile-Ife, Osun State', isDefault: true },
    { id: 'addr2', label: 'Work', address: 'OAU Campus, Road 1, Ile-Ife', isDefault: false },
];

// Mock data for payment methods
const mockPaymentMethods = [
    { id: 'pm1', type: 'card', last4: '4242', brand: 'Visa', isDefault: true },
    { id: 'pm2', type: 'card', last4: '5555', brand: 'Mastercard', isDefault: false },
];

// Mock dietary restrictions
const dietaryOptions = ['Vegetarian', 'Vegan', 'Halal', 'Gluten-Free', 'Dairy-Free', 'Nut Allergy'];

// Mock cuisine preferences
const cuisineOptions = ['Nigerian', 'Chinese', 'Italian', 'Fast Food', 'Breakfast', 'Shawarma', 'Local Dishes'];

export default function ProfileScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { user, logout } = useAuth();
    const { colorScheme, toggleTheme } = useTheme();
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [loading, setLoading] = useState(false);

    // Mock stats
    const [stats] = useState({
        totalOrders: 23,
        loyaltyPoints: 250,
        favorites: 8,
    });

    // Preferences state
    const [selectedDietary, setSelectedDietary] = useState<string[]>(['Halal']);
    const [selectedCuisines, setSelectedCuisines] = useState<string[]>(['Nigerian', 'Fast Food']);

    // Referral code
    const referralCode = 'FOODIE2026';

    const handleLogout = () => {
        Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
            { text: 'Cancel', onPress: () => {}, style: 'cancel' },
            {
                text: 'Sign Out',
                onPress: async () => {
                    try {
                        setLoading(true);
                        await logout();
                        router.replace('/(auth)/roles');
                    } catch (err) {
                        console.error('Logout error:', err);
                        Alert.alert('Error', 'Failed to logout');
                    } finally {
                        setLoading(false);
                    }
                },
                style: 'destructive',
            },
        ]);
    };

    const handleSaveProfile = () => {
        if (!name.trim()) {
            Alert.alert('Validation', 'Name is required');
            return;
        }
        setIsEditing(false);
        Alert.alert('Success', 'Profile updated successfully!');
    };

    const toggleDietary = (option: string) => {
        if (selectedDietary.includes(option)) {
            setSelectedDietary(selectedDietary.filter((d) => d !== option));
        } else {
            setSelectedDietary([...selectedDietary, option]);
        }
    };

    const toggleCuisine = (option: string) => {
        if (selectedCuisines.includes(option)) {
            setSelectedCuisines(selectedCuisines.filter((c) => c !== option));
        } else {
            setSelectedCuisines([...selectedCuisines, option]);
        }
    };

    const handleCopyReferral = () => {
        Clipboard.setString(referralCode);
        Alert.alert('Copied!', 'Referral code copied to clipboard');
    };

    const handleShareReferral = () => {
        Alert.alert('Share Referral', `Share code: ${referralCode}\n\nShare feature coming soon!`);
    };

    const handleAddAddress = () => {
        Alert.alert('Add Address', 'Add address feature coming soon!');
    };

    const handleDeleteAddress = (id: string) => {
        Alert.alert('Delete Address', 'Are you sure you want to delete this address?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: () => Alert.alert('Deleted', 'Address deleted!') },
        ]);
    };

    const handleAddPayment = () => {
        Alert.alert('Add Payment', 'Add payment method feature coming soon!');
    };

    const handleDeletePayment = (id: string) => {
        Alert.alert('Delete Payment', 'Are you sure you want to delete this payment method?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: () => Alert.alert('Deleted', 'Payment method deleted!') },
        ]);
    };

    return (
        <View style={styles.container}>
            {/* Header with back button */}
            <View style={[styles.topBar, { paddingTop: insets.top + 12 }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ArrowLeft size={24} color={Colors.light.text} />
                </TouchableOpacity>
                <Text style={styles.topBarTitle}>Profile</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}>
                {/* Profile Header */}
                <View style={styles.header}>
                    <View style={styles.avatarContainer}>
                        <Image
                            source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop' }}
                            style={styles.avatar}
                        />
                    </View>
                    <Text style={styles.userName}>{user?.name || 'User'}</Text>
                    <View style={styles.roleTag}>
                        <Text style={styles.userRole}>
                            {user?.role?.charAt(0).toUpperCase()}
                            {user?.role?.slice(1) || 'User'}
                        </Text>
                    </View>
                </View>

                {/* Wallet Button */}
                <View style={styles.walletButtonContainer}>
                    <TouchableOpacity
                        style={styles.walletButton}
                        onPress={() => router.push('/(user)/wallet' as any)}
                    >
                        <View style={styles.walletButtonLeft}>
                            <View style={styles.walletIconCircle}>
                                <Wallet size={24} color={Colors.light.primary} />
                            </View>
                            <View>
                                <Text style={styles.walletButtonTitle}>My Wallet</Text>
                                <Text style={styles.walletButtonSubtitle}>{stats.loyaltyPoints} points available</Text>
                            </View>
                        </View>
                        <ChevronRight size={20} color={Colors.light.textSecondary} />
                    </TouchableOpacity>
                </View>

                {/* Quick Stats */}
                <View style={styles.statsContainer}>
                    <View style={styles.statCard}>
                        <View style={styles.statIconCircle}>
                            <ShoppingBag size={20} color={Colors.light.primary} />
                        </View>
                        <Text style={styles.statValue}>{stats.totalOrders}</Text>
                        <Text style={styles.statLabel}>Total Orders</Text>
                    </View>
                    <View style={styles.statCard}>
                        <View style={[styles.statIconCircle, { backgroundColor: '#FFF9E6' }]}>
                            <Award size={20} color={Colors.light.rating} />
                        </View>
                        <Text style={styles.statValue}>{stats.loyaltyPoints}</Text>
                        <Text style={styles.statLabel}>Points</Text>
                    </View>
                    <View style={styles.statCard}>
                        <View style={[styles.statIconCircle, { backgroundColor: '#FFE5E5' }]}>
                            <Heart size={20} color={Colors.light.error} />
                        </View>
                        <Text style={styles.statValue}>{stats.favorites}</Text>
                        <Text style={styles.statLabel}>Favorites</Text>
                    </View>
                </View>

                {/* Contact Information */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Contact Information</Text>
                        <TouchableOpacity onPress={() => setIsEditing(!isEditing)} disabled={loading}>
                            <Text style={styles.editButton}>{isEditing ? 'Cancel' : 'Edit'}</Text>
                        </TouchableOpacity>
                    </View>

                    {isEditing ? (
                        <>
                            {/* Editable Fields */}
                            <View style={styles.formGroup}>
                                <Text style={styles.label}>Full Name</Text>
                                <TextInput
                                    style={styles.input}
                                    value={name}
                                    onChangeText={setName}
                                    placeholder="Enter your name"
                                    placeholderTextColor={AppColors.text.disabled}
                                    editable={!loading}
                                />
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.label}>Email</Text>
                                <TextInput
                                    style={[styles.input, { color: AppColors.text.disabled }]}
                                    value={email}
                                    editable={false}
                                    placeholder="Enter your email"
                                    placeholderTextColor={AppColors.text.disabled}
                                />
                                <Text style={styles.helperText}>Email cannot be changed</Text>
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.label}>Phone Number</Text>
                                <TextInput
                                    style={styles.input}
                                    value={phone}
                                    onChangeText={setPhone}
                                    placeholder="Enter your phone number"
                                    placeholderTextColor={AppColors.text.disabled}
                                    keyboardType="phone-pad"
                                    editable={!loading}
                                />
                            </View>

                            <TouchableOpacity
                                style={[styles.saveButton, loading && styles.buttonDisabled]}
                                onPress={handleSaveProfile}
                                disabled={loading}
                            >
                                <Text style={styles.saveButtonText}>{loading ? 'Saving...' : 'Save Changes'}</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <>
                            {/* View Only Fields */}
                            <View style={styles.infoRow}>
                                <Mail size={20} color={Colors.light.primary} />
                                <View style={{ marginLeft: 12 }}>
                                    <Text style={styles.infoLabel}>Email</Text>
                                    <Text style={styles.infoValue}>{user?.email}</Text>
                                </View>
                            </View>

                            {phone && (
                                <View style={styles.infoRow}>
                                    <Phone size={20} color={Colors.light.primary} />
                                    <View style={{ marginLeft: 12 }}>
                                        <Text style={styles.infoLabel}>Phone</Text>
                                        <Text style={styles.infoValue}>{phone}</Text>
                                    </View>
                                </View>
                            )}
                        </>
                    )}
                </View>

                {/* Saved Addresses */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Saved Addresses</Text>
                        <TouchableOpacity onPress={handleAddAddress}>
                            <Plus size={20} color={Colors.light.primary} />
                        </TouchableOpacity>
                    </View>

                    {mockAddresses.map((addr) => (
                        <View key={addr.id} style={styles.addressCard}>
                            <View style={styles.addressLeft}>
                                <Home size={18} color={Colors.light.primary} />
                                <View style={{ flex: 1, marginLeft: 12 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                                        <Text style={styles.addressLabel}>{addr.label}</Text>
                                        {addr.isDefault && (
                                            <View style={styles.defaultBadge}>
                                                <Text style={styles.defaultBadgeText}>Default</Text>
                                            </View>
                                        )}
                                    </View>
                                    <Text style={styles.addressText}>{addr.address}</Text>
                                </View>
                            </View>
                            <TouchableOpacity onPress={() => handleDeleteAddress(addr.id)}>
                                <Trash2 size={18} color={Colors.light.error} />
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>

                {/* Payment Methods */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Payment Methods</Text>
                        <TouchableOpacity onPress={handleAddPayment}>
                            <Plus size={20} color={Colors.light.primary} />
                        </TouchableOpacity>
                    </View>

                    {mockPaymentMethods.map((pm) => (
                        <View key={pm.id} style={styles.paymentCard}>
                            <View style={styles.paymentLeft}>
                                <View style={styles.cardIconCircle}>
                                    <CreditCard size={18} color={Colors.light.primary} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                                        <Text style={styles.paymentBrand}>{pm.brand}</Text>
                                        {pm.isDefault && (
                                            <View style={styles.defaultBadge}>
                                                <Text style={styles.defaultBadgeText}>Default</Text>
                                            </View>
                                        )}
                                    </View>
                                    <Text style={styles.paymentNumber}>•••• •••• •••• {pm.last4}</Text>
                                </View>
                            </View>
                            <TouchableOpacity onPress={() => handleDeletePayment(pm.id)}>
                                <Trash2 size={18} color={Colors.light.error} />
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>

                {/* Preferences */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Preferences</Text>

                    {/* Dark Mode Toggle */}
                    <View style={styles.settingRow}>
                        <View style={styles.settingLeft}>
                            {colorScheme === 'dark' ? (
                                <Moon size={20} color={Colors.light.textSecondary} />
                            ) : (
                                <Sun size={20} color={Colors.light.textSecondary} />
                            )}
                            <Text style={styles.settingLabel}>Dark Mode</Text>
                        </View>
                        <Switch
                            value={colorScheme === 'dark'}
                            onValueChange={toggleTheme}
                            trackColor={{ false: Colors.light.border, true: Colors.light.secondary }}
                            thumbColor={Colors.light.background}
                        />
                    </View>

                    {/* Dietary Restrictions */}
                    <View style={styles.preferenceSection}>
                        <Text style={styles.preferenceLabel}>Dietary Restrictions</Text>
                        <View style={styles.chipsContainer}>
                            {dietaryOptions.map((option) => (
                                <TouchableOpacity
                                    key={option}
                                    style={[
                                        styles.chip,
                                        selectedDietary.includes(option) && styles.chipSelected,
                                    ]}
                                    onPress={() => toggleDietary(option)}
                                >
                                    <Text
                                        style={[
                                            styles.chipText,
                                            selectedDietary.includes(option) && styles.chipTextSelected,
                                        ]}
                                    >
                                        {option}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Favorite Cuisines */}
                    <View style={styles.preferenceSection}>
                        <Text style={styles.preferenceLabel}>Favorite Cuisines</Text>
                        <View style={styles.chipsContainer}>
                            {cuisineOptions.map((option) => (
                                <TouchableOpacity
                                    key={option}
                                    style={[
                                        styles.chip,
                                        selectedCuisines.includes(option) && styles.chipSelected,
                                    ]}
                                    onPress={() => toggleCuisine(option)}
                                >
                                    <Text
                                        style={[
                                            styles.chipText,
                                            selectedCuisines.includes(option) && styles.chipTextSelected,
                                        ]}
                                    >
                                        {option}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </View>

                {/* Referral Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Refer & Earn</Text>
                    <View style={styles.referralCard}>
                        <View style={styles.referralIconCircle}>
                            <Gift size={28} color={Colors.light.secondary} />
                        </View>
                        <Text style={styles.referralTitle}>Invite Friends, Get 100 Points!</Text>
                        <Text style={styles.referralSubtitle}>Share your referral code and earn rewards</Text>

                        <View style={styles.referralCodeContainer}>
                            <Text style={styles.referralCode}>{referralCode}</Text>
                        </View>

                        <View style={styles.referralActions}>
                            <TouchableOpacity style={styles.referralButton} onPress={handleCopyReferral}>
                                <Text style={styles.referralButtonText}>Copy Code</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.referralButton, styles.referralButtonPrimary]}
                                onPress={handleShareReferral}
                            >
                                <Text style={[styles.referralButtonText, { color: '#FFFFFF' }]}>Share</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Account Settings */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Account</Text>

                    <TouchableOpacity style={styles.settingRow} onPress={handleLogout} disabled={loading}>
                        <View style={styles.settingLeft}>
                            <LogOut size={20} color={AppColors.error} />
                            <Text style={[styles.settingLabel, { color: AppColors.error }]}>Sign Out</Text>
                        </View>
                        <Text style={styles.settingArrow}>›</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.settingRow} disabled={loading}>
                        <View style={styles.settingLeft}>
                            <ShieldCheck size={20} color={Colors.light.textSecondary} />
                            <Text style={styles.settingLabel}>Privacy Policy</Text>
                        </View>
                        <Text style={styles.settingArrow}>›</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.settingRow} disabled={loading}>
                        <View style={styles.settingLeft}>
                            <FileText size={20} color={Colors.light.textSecondary} />
                            <Text style={styles.settingLabel}>Terms of Service</Text>
                        </View>
                        <Text style={styles.settingArrow}>›</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.settingRow, { borderBottomWidth: 0 }]} disabled={loading}>
                        <View style={styles.settingLeft}>
                            <HelpCircle size={20} color={Colors.light.textSecondary} />
                            <Text style={styles.settingLabel}>Help & Support</Text>
                        </View>
                        <Text style={styles.settingArrow}>›</Text>
                    </TouchableOpacity>
                </View>

                {/* App Version */}
                <View style={styles.footer}>
                    <Text style={styles.versionText}>FoodieExpress v1.0.0</Text>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: 12,
        backgroundColor: Colors.light.card,
        borderBottomWidth: 1,
        borderBottomColor: Colors.light.border,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.light.backgroundAlt,
        alignItems: 'center',
        justifyContent: 'center',
    },
    topBarTitle: {
        fontSize: 18,
        fontWeight: Theme.typography.fontWeight.bold,
        color: Colors.light.text,
    },
    header: {
        alignItems: 'center',
        paddingVertical: 24,
        paddingHorizontal: 20,
        backgroundColor: Colors.light.background,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 12,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: Colors.light.card,
        borderWidth: 4,
        borderColor: Colors.light.primary,
    },
    userName: {
        fontSize: 24,
        fontWeight: '800',
        color: Colors.light.text,
        marginBottom: 8,
        textAlign: 'center',
    },
    roleTag: {
        backgroundColor: Colors.light.primary + '15',
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 20,
    },
    userRole: {
        fontSize: 13,
        color: Colors.light.primary,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    walletButtonContainer: {
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    walletButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: Colors.light.card,
        borderRadius: Theme.borderRadius.medium,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 3,
    },
    walletButtonLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    walletIconCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: Colors.light.primary + '15',
        justifyContent: 'center',
        alignItems: 'center',
    },
    walletButtonTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.light.text,
        marginBottom: 2,
    },
    walletButtonSubtitle: {
        fontSize: 13,
        color: Colors.light.textSecondary,
    },
    statsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginBottom: 24,
        gap: 12,
    },
    statCard: {
        flex: 1,
        backgroundColor: Colors.light.card,
        borderRadius: Theme.borderRadius.medium,
        padding: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    statIconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.light.primary + '15',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    statValue: {
        fontSize: 20,
        fontWeight: '800',
        color: Colors.light.text,
        marginBottom: 2,
    },
    statLabel: {
        fontSize: 11,
        color: Colors.light.textSecondary,
        fontWeight: '600',
    },
    section: {
        paddingHorizontal: 20,
        paddingVertical: 20,
        marginBottom: 12,
        backgroundColor: Colors.light.card,
        marginHorizontal: 20,
        borderRadius: Theme.borderRadius.medium,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 3,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: Colors.light.text,
        letterSpacing: -0.2,
    },
    editButton: {
        color: Colors.light.primary,
        fontWeight: '700',
        fontSize: 14,
    },
    formGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 13,
        fontWeight: '700',
        color: Colors.light.text,
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        opacity: 0.8,
    },
    input: {
        borderWidth: 1.5,
        borderColor: Colors.light.primary + '25',
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 15,
        color: Colors.light.text,
        fontWeight: '500',
        backgroundColor: Colors.light.background,
    },
    helperText: {
        fontSize: 11,
        color: Colors.light.textSecondary,
        marginTop: 6,
        fontWeight: '500',
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        paddingVertical: 12,
        paddingHorizontal: 12,
        backgroundColor: Colors.light.background,
        borderRadius: 10,
    },
    infoLabel: {
        fontSize: 11,
        color: Colors.light.textSecondary,
        marginBottom: 4,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.3,
    },
    infoValue: {
        fontSize: 15,
        fontWeight: '700',
        color: Colors.light.text,
    },
    addressCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 12,
        backgroundColor: Colors.light.background,
        borderRadius: 10,
        marginBottom: 12,
    },
    addressLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    addressLabel: {
        fontSize: 14,
        fontWeight: '700',
        color: Colors.light.text,
    },
    addressText: {
        fontSize: 13,
        color: Colors.light.textSecondary,
        marginTop: 2,
        lineHeight: 18,
    },
    defaultBadge: {
        backgroundColor: Colors.light.secondary + '20',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
        marginLeft: 8,
    },
    defaultBadgeText: {
        fontSize: 10,
        fontWeight: '700',
        color: Colors.light.secondary,
    },
    paymentCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 12,
        backgroundColor: Colors.light.background,
        borderRadius: 10,
        marginBottom: 12,
    },
    paymentLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: 12,
    },
    cardIconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.light.primary + '15',
        justifyContent: 'center',
        alignItems: 'center',
    },
    paymentBrand: {
        fontSize: 14,
        fontWeight: '700',
        color: Colors.light.text,
    },
    paymentNumber: {
        fontSize: 13,
        color: Colors.light.textSecondary,
        marginTop: 2,
    },
    preferenceSection: {
        marginTop: 16,
    },
    preferenceLabel: {
        fontSize: 13,
        fontWeight: '700',
        color: Colors.light.text,
        marginBottom: 10,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        opacity: 0.8,
    },
    chipsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    chip: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: Colors.light.background,
        borderWidth: 1.5,
        borderColor: Colors.light.border,
    },
    chipSelected: {
        backgroundColor: Colors.light.primary + '15',
        borderColor: Colors.light.primary,
    },
    chipText: {
        fontSize: 13,
        fontWeight: '600',
        color: Colors.light.textSecondary,
    },
    chipTextSelected: {
        color: Colors.light.primary,
        fontWeight: '700',
    },
    referralCard: {
        alignItems: 'center',
        paddingVertical: 8,
    },
    referralIconCircle: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: Colors.light.secondary + '15',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    referralTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.light.text,
        marginBottom: 6,
        textAlign: 'center',
    },
    referralSubtitle: {
        fontSize: 13,
        color: Colors.light.textSecondary,
        marginBottom: 20,
        textAlign: 'center',
    },
    referralCodeContainer: {
        backgroundColor: Colors.light.background,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: Colors.light.primary,
        borderStyle: 'dashed',
        marginBottom: 16,
    },
    referralCode: {
        fontSize: 20,
        fontWeight: '800',
        color: Colors.light.primary,
        letterSpacing: 2,
    },
    referralActions: {
        flexDirection: 'row',
        gap: 12,
        width: '100%',
    },
    referralButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 10,
        backgroundColor: Colors.light.background,
        borderWidth: 1.5,
        borderColor: Colors.light.primary,
        alignItems: 'center',
    },
    referralButtonPrimary: {
        backgroundColor: Colors.light.primary,
        borderColor: Colors.light.primary,
    },
    referralButtonText: {
        fontSize: 14,
        fontWeight: '700',
        color: Colors.light.primary,
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: Colors.light.border,
    },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    settingLabel: {
        fontSize: 15,
        fontWeight: '600',
        color: Colors.light.text,
    },
    settingArrow: {
        fontSize: 20,
        color: Colors.light.textSecondary,
        fontWeight: '300',
    },
    saveButton: {
        backgroundColor: Colors.light.primary,
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 12,
        shadowColor: Colors.light.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 15,
        letterSpacing: 0.3,
    },
    footer: {
        paddingVertical: 24,
        alignItems: 'center',
    },
    versionText: {
        fontSize: 12,
        color: Colors.light.textSecondary,
        fontWeight: '500',
    },
});
