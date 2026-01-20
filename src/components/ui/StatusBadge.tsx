import { Colors } from '@/constants/colors';
import { OrderStatus } from '@/types';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface StatusBadgeProps {
    status: OrderStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
    const config = {
        pending: {
            label: 'Pending',
            backgroundColor: '#FFF3E0',
            textColor: '#E65100',
        },
        processing: {
            label: 'Processing',
            backgroundColor: '#E3F2FD',
            textColor: '#1565C0',
        },
        completed: {
            label: 'Completed',
            backgroundColor: '#E8F5E9',
            textColor: '#2E7D32',
        },
        cancelled: {
            label: 'Cancelled',
            backgroundColor: '#FFEBEE',
            textColor: '#C62828',
        },
        draft: {
            label: 'Draft',
            backgroundColor: '#F5F5F5',
            textColor: '#616161',
        },
    };

    const { label, backgroundColor, textColor } = config[status] || config.pending;

    return (
        <View style={[styles.badge, { backgroundColor }]}>
            <Text style={[styles.label, { color: textColor }]}>{label}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    badge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    label: {
        fontSize: 12,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
});
