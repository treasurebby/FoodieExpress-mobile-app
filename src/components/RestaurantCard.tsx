import { Colors } from '@/constants/theme';
import { Restaurant } from '@/services/mockData';
import { Clock, MapPin, Star } from 'lucide-react-native';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface RestaurantCardProps {
    restaurant: Restaurant;
    onPress?: () => void;
    compact?: boolean;
}

export default function RestaurantCard({ restaurant, onPress, compact = false }: RestaurantCardProps) {
    const imageSource = restaurant.image ? { uri: restaurant.image } : require('../assets/images/react-logo.png');

    return (
        <TouchableOpacity style={[styles.card, compact && styles.compactCard]} onPress={onPress} activeOpacity={0.7}>
            <Image source={imageSource} style={[styles.image, compact && styles.compactImage]} />
            {restaurant.isBusy && (
                <View style={styles.busyBadge}>
                    <Text style={styles.busyText}>Busy</Text>
                </View>
            )}
            <View style={styles.content}>
                <Text style={styles.name}>{restaurant.name}</Text>
                <Text style={styles.cuisine}>{restaurant.cuisine.join(' • ')}</Text>

                <View style={styles.infoRow}>
                    <View style={styles.infoItem}>
                        <Star size={14} color={Colors.light.warning} fill={Colors.light.warning} />
                        <Text style={styles.infoText}>{restaurant.rating}</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <Clock size={14} color={Colors.light.textSecondary} />
                        <Text style={styles.infoText}>{restaurant.deliveryTime}</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <MapPin size={14} color={Colors.light.textSecondary} />
                        <Text style={styles.infoText}>{restaurant.distance}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.light.card,
        borderRadius: 16,
        marginBottom: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    compactCard: {
        width: 260,
        marginRight: 12,
    },
    image: {
        width: '100%',
        height: 180,
        backgroundColor: Colors.light.border,
    },
    compactImage: {
        height: 140,
    },
    busyBadge: {
        position: 'absolute',
        top: 12,
        right: 12,
        backgroundColor: Colors.light.error,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    busyText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    content: {
        padding: 16,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.light.text,
        marginBottom: 4,
    },
    cuisine: {
        fontSize: 14,
        color: Colors.light.textSecondary,
        marginBottom: 12,
    },
    infoRow: {
        flexDirection: 'row',
        gap: 16,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    infoText: {
        fontSize: 13,
        color: Colors.light.textSecondary,
    },
});
