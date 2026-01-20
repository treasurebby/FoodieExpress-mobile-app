import { Colors } from '@/constants/colors';
import { Flame, Sparkles, TrendingUp } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface AIBadgeProps {
    type: 'recommended' | 'popular' | 'trending';
    size?: 'small' | 'medium';
}

export default function AIBadge({ type, size = 'small' }: AIBadgeProps) {
    const config = {
        recommended: {
            icon: Sparkles,
            label: 'Recommended',
            backgroundColor: '#E3F2FD',
            textColor: '#1565C0',
            iconColor: '#1976D2',
        },
        popular: {
            icon: Flame,
            label: 'Popular',
            backgroundColor: '#FFEBEE',
            textColor: '#C62828',
            iconColor: '#D32F2F',
        },
        trending: {
            icon: TrendingUp,
            label: 'Trending',
            backgroundColor: '#F3E5F5',
            textColor: '#6A1B9A',
            iconColor: '#7B1FA2',
        },
    };

    const { icon: Icon, label, backgroundColor, textColor, iconColor } = config[type];
    const iconSize = size === 'small' ? 12 : 14;
    const fontSize = size === 'small' ? 10 : 12;

    return (
        <View style={[styles.container, { backgroundColor }]}>
            <Icon size={iconSize} color={iconColor} />
            <Text style={[styles.label, { color: textColor, fontSize }]}>{label}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        gap: 4,
    },
    label: {
        fontWeight: '600',
    },
});
