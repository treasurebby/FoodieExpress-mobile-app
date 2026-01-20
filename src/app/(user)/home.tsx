import RestaurantCard from '@/components/RestaurantCard';
import AIFoodRecommendations from '@/components/AIFoodRecommendations';
import { Colors } from '@/constants/colors';
import LocationSelector from '@/components/ui/LocationSelector';
import LoyaltyBadge from '@/components/ui/LoyaltyBadge';
import PromoBanner from '@/components/ui/PromoBanner';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { categories, restaurants, promoBanners } from '@/services/mockData';
import { Category } from '@/types';
import { useRouter } from 'expo-router';
import { ChevronDown, MapPin, Search } from 'lucide-react-native';
import React, { useState, useMemo } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [logoFailed, setLogoFailed] = useState(false);
    const [locationSelectorVisible, setLocationSelectorVisible] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState<string>('Select location');

    // Mock loyalty points
    const loyaltyPoints = 250;

    // AI-recommended restaurants (mock logic: top rated + not busy)
    const recommendedRestaurants = useMemo(() => {
        return restaurants
            .filter(r => r.rating >= 4.5 && !r.isBusy)
            .slice(0, 5);
    }, []);

    function CategoryPill({ category }: { category: Category }) {
        const [failed, setFailed] = useState(false);
        return (
            <TouchableOpacity
                style={styles.categoryCard}
                onPress={() => router.push({ pathname: '/(user)/search', params: { q: category.name } })}
            >
                <Image
                    source={failed ? require('../../assets/images/react-logo.png') : { uri: category.image }}
                    style={{ width: 64, height: 64, borderRadius: 32, marginBottom: 8 }}
                    resizeMode="cover"
                    onError={() => setFailed(true)}
                />
                <Text style={styles.categoryName}>{category.name}</Text>
            </TouchableOpacity>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
                <View style={styles.headerTop}>
                    <View style={styles.headerLeft}>
                        {/* Circular logo container with orange background */}
                        <View style={styles.logoContainer}>
                            {!logoFailed ? (
                                <Image
                                    source={require('../../assets/images/image.png')}
                                    style={styles.logoIcon}
                                    resizeMode="contain"
                                    onError={() => setLogoFailed(true)}
                                />
                            ) : (
                                <Text style={styles.logoFallbackText}>FE</Text>
                            )}
                        </View>
                        {/* FoodieExpress text next to logo */}
                        <Text style={styles.appName}>FoodieExpress</Text>
                    </View>
                    <View style={styles.headerRight}>
                        <LoyaltyBadge
                            points={loyaltyPoints}
                            compact
                            onPress={() => router.push('/(user)/wallet' as any)}
                        />
                        <TouchableOpacity style={styles.searchButton} onPress={() => router.push('/(user)/search')}>
                            <Search size={22} color={Colors.light.text} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Location Dropdown */}
                <View style={styles.headerBottom}>
                    <TouchableOpacity
                        style={styles.locationDropdown}
                        onPress={() => setLocationSelectorVisible(true)}
                    >
                        <MapPin size={16} color={Colors.light.primary} />
                        <Text style={styles.locationText}>{selectedLocation}</Text>
                        <ChevronDown size={16} color={Colors.light.textSecondary} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Location Selector Modal */}
            <LocationSelector
                visible={locationSelectorVisible}
                onClose={() => setLocationSelectorVisible(false)}
                currentLocation={selectedLocation}
                onSelectLocation={setSelectedLocation}
            />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 90 }]}
            >
                {/* Promotional Banners */}
                <View style={styles.section}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.bannersContainer}
                    >
                        {promoBanners.map((banner) => (
                            <PromoBanner key={banner.id} banner={banner} />
                        ))}
                    </ScrollView>
                </View>

                {/* AI Food Recommendations */}
                <AIFoodRecommendations />

                {/* Categories */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Categories</Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.categoriesContainer}
                    >
                        {categories.map((category) => (
                            <CategoryPill key={category.id} category={category} />
                        ))}
                    </ScrollView>
                </View>

                {/* AI Recommended For You */}
                {recommendedRestaurants.length > 0 && (
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <View>
                                <Text style={styles.sectionTitle}>Recommended for You</Text>
                                <Text style={styles.sectionSubtitle}>Based on your preferences</Text>
                            </View>
                        </View>

                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.locationRow}
                        >
                            {recommendedRestaurants.map((restaurant) => (
                                <RestaurantCard
                                    key={restaurant.id}
                                    restaurant={restaurant}
                                    compact
                                    onPress={() => router.push(`/restaurant/${restaurant.id}` as any)}
                                />
                            ))}
                        </ScrollView>
                    </View>
                )}

                {/* Restaurants grouped by location */}
                {(() => {
                    const locations = Array.from(new Set(restaurants.map((r) => r.location || 'Other')));
                    return locations.map((loc) => {
                        const items = restaurants.filter((r) => (r.location || 'Other') === loc);
                        return (
                            <View style={styles.section} key={loc}>
                                <View style={styles.sectionHeader}>
                                    <Text style={styles.sectionTitle}>{loc}</Text>
                                    <TouchableOpacity onPress={() => router.push({ pathname: '/(user)/search', params: { q: loc } })}>
                                        <Text style={styles.seeAll}>See all</Text>
                                    </TouchableOpacity>
                                </View>

                                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.locationRow}>
                                    {items.map((restaurant) => (
                                        <RestaurantCard
                                            key={restaurant.id}
                                            restaurant={restaurant}
                                            compact
                                            onPress={() => router.push(`/restaurant/${restaurant.id}` as any)}
                                        />
                                    ))}
                                </ScrollView>
                            </View>
                        );
                    });
                })()}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 16,
        backgroundColor: Colors.light.card,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    headerLeft: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    logoContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: Colors.light.primary,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    logoIcon: {
        width: 32,
        height: 32,
    },
    logoFallbackText: {
        fontSize: 18,
        fontWeight: '800',
        color: Colors.light.background,
    },
    appName: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.light.text,
        letterSpacing: -0.3,
    },
    searchButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.light.backgroundAlt,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerBottom: {
        width: '100%',
    },
    locationDropdown: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 10,
        backgroundColor: 'transparent',
        gap: 6,
    },
    locationText: {
        flex: 1,
        fontSize: 14,
        fontWeight: '500',
        color: Colors.light.text,
    },
    scrollContent: {
        paddingBottom: 90,
    },
    section: {
        marginTop: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.light.text,
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    sectionSubtitle: {
        fontSize: 13,
        color: Colors.light.textSecondary,
        paddingHorizontal: 20,
        marginTop: -12,
        marginBottom: 16,
    },
    seeAll: {
        fontSize: 14,
        color: Colors.light.primary,
        fontWeight: '600',
    },
    bannersContainer: {
        paddingHorizontal: 20,
    },
    categoriesContainer: {
        paddingHorizontal: 20,
        gap: 12,
    },
    locationRow: {
        paddingLeft: 20,
        paddingRight: 12,
    },
    categoryCard: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 90,
        height: 90,
        backgroundColor: Colors.light.card,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    categoryName: {
        fontSize: 12,
        color: Colors.light.text,
        fontWeight: '500',
    },
});
