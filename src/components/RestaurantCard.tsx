import { Colors } from '@/constants/colors';
import { Restaurant } from '@/services/mockData';
import { Clock, MapPin, Star } from 'lucide-react-native';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface RestaurantCardProps {
    restaurant: Restaurant;
    onPress?: () => void;
    compact?: boolean;
}

export default function RestaurantCard({ restaurant, onPress, compact = false }: RestaurantCardProps) {
    const imageSource = restaurant.image ? { uri: restaurant.image } : { uri: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop' };

    return (
        <TouchableOpacity style={[styles.card, compact && styles.compactCard]} onPress={onPress} activeOpacity={0.85}>
            <View style={styles.imageWrapper}>
                <Image source={imageSource} style={[styles.image, compact && styles.compactImage]} />
                <View style={styles.imageOverlay} />
                {restaurant.isBusy && (
                    <View style={styles.busyBadge}>
                        <Text style={styles.busyText}>Busy</Text>
                    </View>
                )}
                <View style={styles.ratingBadge}>
                    <Star size={14} color="#FFD700" fill="#FFD700" />
                    <Text style={styles.ratingText}>{restaurant.rating}</Text>
                </View>
            </View>

            <View style={styles.content}>
                <Text style={styles.name} numberOfLines={1}>{restaurant.name}</Text>
                <Text style={styles.cuisine} numberOfLines={1}>{restaurant.cuisine.join(' • ')}</Text>

                <View style={styles.infoRow}>
                    <View style={styles.infoItem}>
                        <Clock size={13} color={Colors.light.primary} />
                        <Text style={styles.infoText}>{restaurant.deliveryTime}</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <MapPin size={13} color={Colors.light.textSecondary} />
                        <Text style={styles.infoText}>{restaurant.distance}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        marginBottom: 16,
        overflow: 'hidden',
        shadowColor: '#FF6B35',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 10,
        elevation: 4,
    },
    compactCard: {
        width: 260,
        marginRight: 0,
    },
    imageWrapper: {
        position: 'relative',
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: 180,
        backgroundColor: Colors.light.border,
    },
    compactImage: {
        height: 140,
    },
    imageOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.08)',
    },
    busyBadge: {
        position: 'absolute',
        bottom: 12,
        left: 12,
        backgroundColor: Colors.light.error,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 6,
    },
    busyText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: '700',
    },
    ratingBadge: {
        position: 'absolute',
        top: 12,
        right: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
    },
    ratingText: {
        fontSize: 12,
        fontWeight: '700',
        color: Colors.light.text,
    },
    content: {
        padding: 14,
    },
    name: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.light.text,
        marginBottom: 4,
        letterSpacing: -0.3,
    },
    cuisine: {
        fontSize: 13,
        color: Colors.light.textSecondary,
        marginBottom: 10,
        fontWeight: '500',
    },
    infoRow: {
        flexDirection: 'row',
        gap: 12,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    infoText: {
        fontSize: 12,
        color: Colors.light.textSecondary,
        fontWeight: '500',
    },
});
