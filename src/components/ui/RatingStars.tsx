import { Colors } from '@/constants/colors';
import { Star } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface RatingStarsProps {
    rating: number;
    size?: number;
    showNumber?: boolean;
    color?: string;
}

export default function RatingStars({ rating, size = 16, showNumber = true, color = Colors.light.rating }: RatingStarsProps) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    return (
        <View style={styles.container}>
            {[...Array(5)].map((_, index) => {
                if (index < fullStars) {
                    return <Star key={index} size={size} fill={color} color={color} />;
                } else if (index === fullStars && hasHalfStar) {
                    return (
                        <View key={index} style={{ position: 'relative' }}>
                            <Star size={size} color={Colors.light.border} />
                            <View style={{ position: 'absolute', width: '50%', overflow: 'hidden' }}>
                                <Star size={size} fill={color} color={color} />
                            </View>
                        </View>
                    );
                } else {
                    return <Star key={index} size={size} color={Colors.light.border} />;
                }
            })}
            {showNumber && <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
    },
    ratingText: {
        marginLeft: 6,
        fontSize: 14,
        fontWeight: '600',
        color: Colors.light.text,
    },
});
