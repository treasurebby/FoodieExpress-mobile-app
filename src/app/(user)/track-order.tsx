import StatusTimeline from '@/components/ui/StatusTimeline';
import { Colors } from '@/constants/colors';
import Theme from '@/constants/theme';
import { mockOrderTracking } from '@/services/mockData';
import { useRouter } from 'expo-router';
import { MessageCircle, Phone, X, MapPin, Navigation } from 'lucide-react-native';
import React from 'react';
import {
    Alert,
    Dimensions,
    Linking,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { height } = Dimensions.get('window');

export default function TrackOrderScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const tracking = mockOrderTracking;

    const handleCallRider = () => {
        if (tracking.rider) {
            Linking.openURL(`tel:${tracking.rider.phone}`);
        }
    };

    const handleChatRider = () => {
        Alert.alert('Chat', 'Chat feature coming soon!');
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <X size={24} color={Colors.light.text} />
                </TouchableOpacity>
                <View style={styles.headerContent}>
                    <Text style={styles.headerTitle}>Track Order</Text>
                    <Text style={styles.headerSubtitle}>Order #{tracking.orderId}</Text>
                </View>
                <View style={{ width: 40 }} />
            </View>

            {/* Map Placeholder */}
            <View style={styles.mapPlaceholder}>
                {/* ETA Badge */}
                <View style={styles.etaBadge}>
                    <Text style={styles.etaText}>Arriving in</Text>
                    <Text style={styles.etaTime}>{tracking.estimatedDeliveryTime}</Text>
                </View>

                {/* Location Info */}
                <View style={styles.locationInfo}>
                    <View style={styles.locationItem}>
                        <View style={[styles.locationDot, { backgroundColor: Colors.light.primary }]} />
                        <View style={{ flex: 1 }}>
                            <Text style={styles.locationLabel}>Restaurant</Text>
                            <Text style={styles.locationText}>{tracking.restaurant.name}</Text>
                        </View>
                    </View>

                    {tracking.rider && (
                        <View style={styles.locationItem}>
                            <View style={[styles.locationDot, { backgroundColor: Colors.light.secondary }]}>
                                <Text style={styles.riderEmoji}>🏍️</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.locationLabel}>Rider Location</Text>
                                <Text style={styles.locationText}>On the way to you</Text>
                            </View>
                        </View>
                    )}

                    <View style={styles.locationItem}>
                        <View style={[styles.locationDot, { backgroundColor: Colors.light.error }]} />
                        <View style={{ flex: 1 }}>
                            <Text style={styles.locationLabel}>Your Location</Text>
                            <Text style={styles.locationText}>{tracking.customer.address}</Text>
                        </View>
                    </View>
                </View>

                {/* Map Note */}
                <View style={styles.mapNote}>
                    <MapPin size={16} color={Colors.light.textSecondary} />
                    <Text style={styles.mapNoteText}>
                        Live map tracking coming soon. Install full app for real-time GPS tracking.
                    </Text>
                </View>
            </View>

            {/* Bottom Sheet */}
            <View style={[styles.bottomSheet, { paddingBottom: insets.bottom + 20 }]}>
                {/* Rider Info */}
                {tracking.rider && (
                    <View style={styles.riderSection}>
                        <View style={styles.riderInfo}>
                            <View style={styles.riderAvatar}>
                                <Text style={styles.riderAvatarText}>{tracking.rider.name.charAt(0)}</Text>
                            </View>
                            <View style={styles.riderDetails}>
                                <Text style={styles.riderName}>{tracking.rider.name}</Text>
                                <View style={styles.riderRating}>
                                    <Text style={styles.riderRatingText}>⭐ {tracking.rider.rating}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.riderActions}>
                            <TouchableOpacity style={styles.actionButton} onPress={handleCallRider}>
                                <Phone size={20} color={Colors.light.primary} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.actionButton} onPress={handleChatRider}>
                                <MessageCircle size={20} color={Colors.light.primary} />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                {/* Status Timeline */}
                <View style={styles.timelineSection}>
                    <Text style={styles.sectionTitle}>Order Status</Text>
                    <StatusTimeline steps={tracking.timeline} />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: 12,
        backgroundColor: Colors.light.card,
        borderBottomWidth: 1,
        borderBottomColor: Colors.light.border,
        zIndex: 10,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.light.backgroundAlt,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerContent: {
        flex: 1,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: Theme.typography.fontWeight.bold,
        color: Colors.light.text,
    },
    headerSubtitle: {
        fontSize: 12,
        color: Colors.light.textSecondary,
        marginTop: 2,
    },
    mapPlaceholder: {
        height: height * 0.4,
        backgroundColor: Colors.light.backgroundAlt,
        position: 'relative',
        justifyContent: 'center',
        padding: 20,
    },
    etaBadge: {
        position: 'absolute',
        top: 20,
        left: 20,
        right: 20,
        backgroundColor: Colors.light.primary,
        padding: 16,
        borderRadius: Theme.borderRadius.medium,
        alignItems: 'center',
        shadowColor: Colors.light.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
        zIndex: 10,
    },
    etaText: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.9)',
        fontWeight: '500',
    },
    etaTime: {
        fontSize: 24,
        fontWeight: '800',
        color: '#FFFFFF',
        marginTop: 4,
    },
    locationInfo: {
        marginTop: 80,
        gap: 16,
    },
    locationItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: Colors.light.card,
        padding: 12,
        borderRadius: Theme.borderRadius.small,
    },
    locationDot: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    riderEmoji: {
        fontSize: 20,
    },
    locationLabel: {
        fontSize: 11,
        fontWeight: '600',
        color: Colors.light.textSecondary,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 2,
    },
    locationText: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.light.text,
    },
    mapNote: {
        position: 'absolute',
        bottom: 12,
        left: 20,
        right: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: Colors.light.card,
        padding: 10,
        borderRadius: 8,
    },
    mapNoteText: {
        flex: 1,
        fontSize: 11,
        color: Colors.light.textSecondary,
        lineHeight: 16,
    },
    bottomSheet: {
        flex: 1,
        backgroundColor: Colors.light.card,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingTop: 24,
        paddingHorizontal: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 10,
    },
    riderSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: Colors.light.border,
        marginBottom: 20,
    },
    riderInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    riderAvatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: Colors.light.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    riderAvatarText: {
        fontSize: 24,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    riderDetails: {
        flex: 1,
    },
    riderName: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.light.text,
        marginBottom: 4,
    },
    riderRating: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    riderRatingText: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.light.textSecondary,
    },
    riderActions: {
        flexDirection: 'row',
        gap: 12,
    },
    actionButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: Colors.light.backgroundAlt,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.light.border,
    },
    timelineSection: {
        flex: 1,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: Theme.typography.fontWeight.bold,
        color: Colors.light.text,
        marginBottom: 16,
    },
});
