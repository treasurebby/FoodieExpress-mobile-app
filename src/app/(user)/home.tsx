import RestaurantCard from '@/components/RestaurantCard';
import LocationDropdown from '@/components/ui/LocationDropdown';
import { Colors } from '@/constants/theme';
import { categories, restaurants } from '@/services/mockData';
import { useRouter } from 'expo-router';
import { Search } from 'lucide-react-native';
import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
    const router = useRouter();

    function CategoryPill({ category }: { category: any }) {
        const [failed, setFailed] = useState(false);
        return (
            <TouchableOpacity style={styles.categoryCard}>
                <Image
                    source={failed ? require('../../assets/images/react-logo.png') : { uri: category.image }}
                    style={{ width: 56, height: 56, borderRadius: 28, marginBottom: 8 }}
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
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <View style={{ marginLeft: 2 }}>
                        <Text style={styles.greeting}>Hello!</Text>
                        <Text style={styles.title}>What are you craving?</Text>
                    </View>
                </View>

                <View style={styles.headerRight}> 
                    <Image source={require('../../assets/images/icon.png')} style={styles.headerLogo} resizeMode="contain" />
                    <View style={styles.locationWrap}>
                        <LocationDropdown />
                    </View>
                    <TouchableOpacity style={styles.searchButton} onPress={() => router.push('/(user)/search')}>
                        <Search size={22} color={Colors.light.secondary} />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Categories */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Categories</Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.categoriesContainer}
                    >
                        {/** Small component so hooks work correctly inside map */}
                        {/** eslint-disable-next-line react/no-unstable-nested-components */}
                        {categories.map((category) => (
                            <CategoryPill key={category.id} category={category} />
                        ))}
                    </ScrollView>
                </View>

                {/* Restaurants grouped by location */}
                {/** Compute unique locations and render a section per location */}
                {(() => {
                    const locations = Array.from(new Set(restaurants.map((r) => r.location || 'Other')));
                    return locations.map((loc) => {
                        const items = restaurants.filter((r) => (r.location || 'Other') === loc);
                        return (
                            <View style={styles.section} key={loc}>
                                <View style={styles.sectionHeader}>
                                    <Text style={styles.sectionTitle}>{loc}</Text>
                                    <TouchableOpacity>
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
        backgroundColor: Colors.light.card,
    },
    headerLeft: { flexDirection: 'row', alignItems: 'center' },
    headerRight: { flexDirection: 'row', alignItems: 'center' },
    greeting: {
        fontSize: 16,
        color: Colors.light.textSecondary,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.light.text,
        marginTop: 4,
    },
    searchButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: Colors.light.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerLogo: {
        width: 42,
        height: 42,
        marginRight: 8,
        borderRadius: 8,
        backgroundColor: 'transparent',
    },
    locationWrap: {
        marginRight: 8,
        alignSelf: 'center',
    },
    scrollContent: {
        paddingBottom: 20,
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
    seeAll: {
        fontSize: 14,
        color: Colors.light.primary,
        fontWeight: '600',
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
        width: 80,
        height: 80,
        backgroundColor: Colors.light.card,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    categoryIcon: {
        fontSize: 32,
        marginBottom: 4,
    },
    categoryName: {
        fontSize: 12,
        color: Colors.light.text,
        fontWeight: '500',
    },
});
