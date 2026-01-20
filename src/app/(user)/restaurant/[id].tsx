import QuantitySelector from '@/components/ui/QuantitySelector';
import AIBadge from '@/components/ui/AIBadge';
import RatingStars from '@/components/ui/RatingStars';
import { Colors } from '@/constants/colors';
import Theme from '@/constants/theme';
import { restaurants, reviews } from '@/services/mockData';
import { useCartStore } from '@/store/cartStore';
import { MenuItem } from '@/types';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Clock, Heart, MapPin, Plus } from 'lucide-react-native';
import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function RestaurantDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const addItem = useCartStore((state) => state.addItem);

    const [selectedCategory, setSelectedCategory] = useState<string>('Popular');
    const [quantitySelectorVisible, setQuantitySelectorVisible] = useState(false);
    const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
    const [isFavorite, setIsFavorite] = useState(false);

    const restaurant = restaurants.find((r) => r.id === id);

    if (!restaurant) {
        return (
            <View style={styles.container}>
                <View style={[styles.header, { paddingTop: insets.top }]}>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <ArrowLeft size={24} color={Colors.light.text} />
                    </TouchableOpacity>
                </View>
                <View style={styles.notFoundContainer}>
                    <Text style={styles.notFoundText}>Restaurant not found</Text>
                </View>
            </View>
        );
    }

    // Get all unique categories from menu items
    const menuItems = restaurant.menu || [];
    const categories = ['Popular', ...Array.from(new Set(menuItems.map(item => item.category)))];

    // Get reviews for this restaurant
    const restaurantReviews = reviews.filter(r => r.restaurantId === restaurant.id);

    // Filter menu items by selected category with AI logic
    const filteredMenuItems = selectedCategory === 'Popular'
        ? menuItems.slice(0, 5) // First 5 are "popular"
        : menuItems.filter(item => item.category === selectedCategory);

    // Determine AI badge type for each item (mock logic)
    const getAIBadge = (index: number) => {
        if (selectedCategory === 'Popular') {
            if (index === 0) return 'popular';
            if (index === 1) return 'recommended';
            if (index === 2) return 'trending';
        }
        return null;
    };

    const handleAddToCart = (item: MenuItem) => {
        setSelectedMenuItem(item);
        setQuantitySelectorVisible(true);
    };

    const handleConfirmAddToCart = (item: MenuItem, quantity: number) => {
        for (let i = 0; i < quantity; i++) {
            addItem(item);
        }
    };

    const handleToggleFavorite = () => {
        setIsFavorite(!isFavorite);
        Alert.alert('Success', isFavorite ? 'Removed from favorites' : 'Added to favorites!');
    };

    return (
        <View style={styles.container}>
            {/* Back & Favorite Buttons - Absolutely Positioned */}
            <View style={[styles.absoluteButtons, { top: insets.top + 12 }]}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                    activeOpacity={0.7}
                >
                    <ArrowLeft size={24} color={Colors.light.text} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.favoriteButton}
                    onPress={handleToggleFavorite}
                    activeOpacity={0.7}
                >
                    <Heart
                        size={24}
                        color={isFavorite ? Colors.light.error : Colors.light.text}
                        fill={isFavorite ? Colors.light.error : 'transparent'}
                    />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Header Image */}
                <View style={styles.headerContainer}>
                    <Image source={{ uri: restaurant.image }} style={styles.headerImage} />
                    {restaurant.isBusy && (
                        <View style={styles.busyBadge}>
                            <Text style={styles.busyText}>BUSY</Text>
                        </View>
                    )}
                </View>

                {/* Restaurant Info Card */}
                <View style={styles.infoCard}>
                    <Text style={styles.restaurantName}>{restaurant.name}</Text>
                    <Text style={styles.cuisine}>{restaurant.cuisine.join(' • ')}</Text>

                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <RatingStars rating={restaurant.rating} size={14} showNumber={false} />
                            <Text style={styles.statValue}>{restaurant.rating}</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Clock size={16} color={Colors.light.primary} />
                            <Text style={styles.statValue}>{restaurant.deliveryTime}</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <MapPin size={16} color={Colors.light.textSecondary} />
                            <Text style={styles.statValue}>{restaurant.distance}</Text>
                        </View>
                    </View>

                    {restaurant.prepTime && (
                        <View style={styles.prepTimeContainer}>
                            <Text style={styles.prepTimeText}>Avg. prep time: {restaurant.prepTime} mins</Text>
                        </View>
                    )}
                </View>

                {/* Category Tabs */}
                <View style={styles.categoriesSection}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.categoriesContainer}
                    >
                        {categories.map((category) => (
                            <TouchableOpacity
                                key={category}
                                style={[
                                    styles.categoryTab,
                                    selectedCategory === category && styles.categoryTabActive,
                                ]}
                                onPress={() => setSelectedCategory(category)}
                            >
                                <Text
                                    style={[
                                        styles.categoryTabText,
                                        selectedCategory === category && styles.categoryTabTextActive,
                                    ]}
                                >
                                    {category}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Menu Section */}
                <View style={styles.menuSection}>
                    <Text style={styles.sectionTitle}>Our Menu</Text>
                    {filteredMenuItems.map((item, index) => {
                        const badge = getAIBadge(index);
                        return (
                            <View key={item.id} style={styles.menuItem}>
                                <Image
                                    source={{ uri: item.image }}
                                    style={styles.menuItemImage}
                                    resizeMode="cover"
                                />
                                <View style={styles.menuItemInfo}>
                                    <View style={styles.menuItemHeader}>
                                        <Text style={styles.menuItemName}>{item.name}</Text>
                                        {badge && <AIBadge type={badge as any} size="small" />}
                                    </View>
                                    {item.description && (
                                        <Text style={styles.menuItemDescription} numberOfLines={2}>
                                            {item.description}
                                        </Text>
                                    )}
                                    <View style={styles.menuItemFooter}>
                                        <Text style={styles.menuItemPrice}>₦{item.price.toLocaleString()}</Text>
                                        {restaurant.prepTime && (
                                            <View style={styles.prepTimeBadge}>
                                                <Clock size={12} color={Colors.light.textSecondary} />
                                                <Text style={styles.prepTimeBadgeText}>~{restaurant.prepTime}m</Text>
                                            </View>
                                        )}
                                    </View>
                                </View>
                                {item.available ? (
                                    <TouchableOpacity
                                        style={styles.addButton}
                                        onPress={() => handleAddToCart(item)}
                                    >
                                        <Plus size={20} color={Colors.light.primary} strokeWidth={2.5} />
                                    </TouchableOpacity>
                                ) : (
                                    <View style={styles.unavailableContainer}>
                                        <Text style={styles.unavailable}>Out</Text>
                                    </View>
                                )}
                            </View>
                        );
                    })}
                </View>

                {/* Reviews Section */}
                {restaurantReviews.length > 0 && (
                    <View style={styles.reviewsSection}>
                        <View style={styles.reviewsHeader}>
                            <Text style={styles.sectionTitle}>Customer Reviews</Text>
                            <Text style={styles.reviewCount}>({restaurantReviews.length})</Text>
                        </View>
                        {restaurantReviews.map((review) => (
                            <View key={review.id} style={styles.reviewCard}>
                                <View style={styles.reviewHeader}>
                                    <Image source={{ uri: review.userImage }} style={styles.reviewAvatar} />
                                    <View style={styles.reviewInfo}>
                                        <Text style={styles.reviewerName}>{review.userName}</Text>
                                        <RatingStars rating={review.rating} size={12} showNumber={false} />
                                    </View>
                                    <Text style={styles.reviewDate}>
                                        {new Date(review.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </Text>
                                </View>
                                <Text style={styles.reviewComment}>{review.comment}</Text>
                            </View>
                        ))}
                    </View>
                )}
            </ScrollView>

            {/* Quantity Selector Modal */}
            <QuantitySelector
                visible={quantitySelectorVisible}
                onClose={() => setQuantitySelectorVisible(false)}
                menuItem={selectedMenuItem}
                onAddToCart={handleConfirmAddToCart}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    scrollView: {
        flex: 1,
    },
    absoluteButtons: {
        position: 'absolute',
        top: 0,
        left: 20,
        right: 20,
        zIndex: 100,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    headerContainer: {
        position: 'relative',
        height: 220,
    },
    headerImage: {
        width: '100%',
        height: '100%',
        backgroundColor: Colors.light.border,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: Colors.light.card,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    favoriteButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: Colors.light.card,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    busyBadge: {
        position: 'absolute',
        top: 20,
        right: 20,
        backgroundColor: Colors.light.error,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
    },
    busyText: {
        fontSize: 11,
        fontWeight: Theme.typography.fontWeight.bold,
        color: Colors.light.background,
        letterSpacing: 0.5,
    },
    infoCard: {
        backgroundColor: Colors.light.card,
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 16,
        borderBottomLeftRadius: Theme.borderRadius.large,
        borderBottomRightRadius: Theme.borderRadius.large,
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    restaurantName: {
        fontSize: 22,
        fontWeight: Theme.typography.fontWeight.bold,
        color: Colors.light.text,
        marginBottom: 4,
    },
    cuisine: {
        fontSize: 14,
        color: Colors.light.textSecondary,
        marginBottom: 16,
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    statItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
    },
    statDivider: {
        width: 1,
        height: 20,
        backgroundColor: Colors.light.border,
    },
    statValue: {
        fontSize: 13,
        fontWeight: Theme.typography.fontWeight.semibold,
        color: Colors.light.text,
    },
    prepTimeContainer: {
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: Colors.light.border,
    },
    prepTimeText: {
        fontSize: 13,
        color: Colors.light.textSecondary,
        textAlign: 'center',
    },
    categoriesSection: {
        backgroundColor: Colors.light.card,
        paddingVertical: 12,
        marginBottom: 4,
    },
    categoriesContainer: {
        paddingHorizontal: 20,
        gap: 8,
    },
    categoryTab: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: Theme.borderRadius.medium,
        backgroundColor: Colors.light.background,
        borderWidth: 1,
        borderColor: Colors.light.border,
    },
    categoryTabActive: {
        backgroundColor: Colors.light.primary,
        borderColor: Colors.light.primary,
    },
    categoryTabText: {
        fontSize: 14,
        fontWeight: Theme.typography.fontWeight.medium,
        color: Colors.light.text,
    },
    categoryTabTextActive: {
        color: Colors.light.background,
        fontWeight: Theme.typography.fontWeight.semibold,
    },
    menuSection: {
        backgroundColor: Colors.light.card,
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: Theme.typography.fontWeight.bold,
        color: Colors.light.text,
        marginBottom: 16,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 20,
        gap: 12,
    },
    menuItemImage: {
        width: 80,
        height: 80,
        borderRadius: Theme.borderRadius.medium,
        backgroundColor: Colors.light.border,
    },
    menuItemInfo: {
        flex: 1,
    },
    menuItemHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 4,
    },
    menuItemName: {
        fontSize: 15,
        fontWeight: Theme.typography.fontWeight.semibold,
        color: Colors.light.text,
        flex: 1,
    },
    menuItemDescription: {
        fontSize: 12,
        color: Colors.light.textSecondary,
        lineHeight: 16,
        marginBottom: 8,
    },
    menuItemFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    menuItemPrice: {
        fontSize: 16,
        fontWeight: Theme.typography.fontWeight.bold,
        color: Colors.light.primary,
    },
    prepTimeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 8,
        paddingVertical: 4,
        backgroundColor: Colors.light.backgroundAlt,
        borderRadius: 6,
    },
    prepTimeBadgeText: {
        fontSize: 11,
        color: Colors.light.textSecondary,
        fontWeight: '600',
    },
    addButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: Colors.light.background,
        borderWidth: 1.5,
        borderColor: Colors.light.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    unavailableContainer: {
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    unavailable: {
        fontSize: 10,
        color: Colors.light.textSecondary,
        fontWeight: Theme.typography.fontWeight.medium,
    },
    reviewsSection: {
        backgroundColor: Colors.light.card,
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 90,
    },
    reviewsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
    },
    reviewCount: {
        fontSize: 14,
        color: Colors.light.textSecondary,
    },
    reviewCard: {
        marginBottom: 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: Colors.light.border,
    },
    reviewHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    reviewAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: Colors.light.border,
        marginRight: 12,
    },
    reviewInfo: {
        flex: 1,
    },
    reviewerName: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.light.text,
        marginBottom: 4,
    },
    reviewDate: {
        fontSize: 12,
        color: Colors.light.textSecondary,
    },
    reviewComment: {
        fontSize: 14,
        color: Colors.light.text,
        lineHeight: 20,
    },
    notFoundContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    notFoundText: {
        fontSize: 16,
        color: Colors.light.textSecondary,
    },
    header: {
        paddingHorizontal: 20,
        paddingBottom: 12,
        backgroundColor: Colors.light.card,
    },
});
