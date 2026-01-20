import { PromoBanner as PromoBannerType } from '@/services/mockData';
import React from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';

interface PromoBannerProps {
    banner: PromoBannerType;
}

const { width } = Dimensions.get('window');
const BANNER_WIDTH = width - 40;

export default function PromoBanner({ banner }: PromoBannerProps) {
    return (
        <View style={[styles.container, { backgroundColor: banner.backgroundColor }]}>
            <View style={styles.textContainer}>
                <Text style={styles.title}>{banner.title}</Text>
                <Text style={styles.subtitle}>{banner.subtitle}</Text>
            </View>
            <Image source={{ uri: banner.image }} style={styles.image} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: BANNER_WIDTH,
        height: 120,
        borderRadius: 16,
        overflow: 'hidden',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginRight: 12,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: '800',
        color: '#FFFFFF',
        marginBottom: 6,
    },
    subtitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFFFFF',
        opacity: 0.9,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 12,
        opacity: 0.3,
        position: 'absolute',
        right: 10,
    },
});
