import { Colors } from '@/constants/colors';
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

export const Skeleton = ({
    width = '100%',
    height = 16,
    borderRadius = 8,
    marginBottom = 8,
}: {
    width?: ViewStyle['width'];
    height?: number;
    borderRadius?: number;
    marginBottom?: number;
}) => {
    return (
        <View
            style={[
                styles.skeleton,
                {
                    width,
                    height,
                    borderRadius,
                    marginBottom,
                } as ViewStyle,
            ]}
        />
    );
};

export const RestaurantCardSkeleton = () => (
    <View style={styles.cardContainer}>
        <Skeleton width="100%" height={180} borderRadius={12} marginBottom={12} />
        <Skeleton width="70%" height={16} marginBottom={8} />
        <Skeleton width="50%" height={12} marginBottom={8} />
        <View style={{ flexDirection: 'row', gap: 8 }}>
            <Skeleton width="30%" height={12} marginBottom={0} />
            <Skeleton width="30%" height={12} marginBottom={0} />
            <Skeleton width="30%" height={12} marginBottom={0} />
        </View>
    </View>
);

export const MenuItemSkeleton = () => (
    <View style={styles.menuItemContainer}>
        <Skeleton width={80} height={80} borderRadius={8} marginBottom={0} />
        <View style={{ flex: 1, marginLeft: 12 }}>
            <Skeleton width="80%" height={14} marginBottom={8} />
            <Skeleton width="100%" height={12} marginBottom={8} />
            <Skeleton width="40%" height={14} marginBottom={0} />
        </View>
    </View>
);

export const ChatMessageSkeleton = () => (
    <View style={styles.chatMessageContainer}>
        <Skeleton width="60%" height={40} borderRadius={12} marginBottom={0} />
    </View>
);

const styles = StyleSheet.create({
    skeleton: {
        backgroundColor: Colors.light.border,
        opacity: 0.6,
    },
    cardContainer: {
        padding: 12,
        marginBottom: 12,
        borderRadius: 12,
        backgroundColor: Colors.light.card,
    },
    menuItemContainer: {
        flexDirection: 'row',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.light.border,
    },
    chatMessageContainer: {
        paddingVertical: 8,
    },
});
