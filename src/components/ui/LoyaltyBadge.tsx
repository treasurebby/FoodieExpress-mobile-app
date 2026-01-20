import { Colors } from '@/constants/colors';
import { Award } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface LoyaltyBadgeProps {
    points: number;
    onPress?: () => void;
    compact?: boolean;
}

export default function LoyaltyBadge({ points, onPress, compact = false }: LoyaltyBadgeProps) {
    if (compact) {
        return (
            <TouchableOpacity style={styles.compactContainer} onPress={onPress} activeOpacity={0.7}>
                <Award size={16} color={Colors.light.rating} />
                <Text style={styles.compactPoints}>{points}</Text>
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
            <View style={styles.iconContainer}>
                <Award size={20} color={Colors.light.rating} fill={Colors.light.rating} />
            </View>
            <View>
                <Text style={styles.label}>Loyalty Points</Text>
                <Text style={styles.points}>{points.toLocaleString()} pts</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF9E6',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
        gap: 10,
        borderWidth: 1,
        borderColor: '#FFE57F',
    },
    compactContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF9E6',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 4,
        borderWidth: 1,
        borderColor: '#FFE57F',
    },
    iconContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    label: {
        fontSize: 11,
        color: '#8B7000',
        fontWeight: '500',
    },
    points: {
        fontSize: 14,
        fontWeight: '700',
        color: '#B8860B',
    },
    compactPoints: {
        fontSize: 13,
        fontWeight: '700',
        color: '#B8860B',
    },
});
