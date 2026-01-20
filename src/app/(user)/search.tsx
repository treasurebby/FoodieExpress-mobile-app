import { Colors } from '@/constants/colors';
import { restaurants } from '@/services/mockData';
import { MenuItem, Restaurant } from '@/types';
import { useRouter } from 'expo-router';
import { Search as SearchIcon } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface SearchResult extends MenuItem {
    restaurant: Pick<Restaurant, 'id' | 'name' | 'image'>;
}

export default function SearchScreen() {
    const router = useRouter();
    const [query, setQuery] = useState('');

    const results = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return [];

        // search across restaurant menus for available items
        const matches: SearchResult[] = [];
        restaurants.forEach((r) => {
            (r.menu || []).forEach((m) => {
                if (!m.available) return;
                if (m.name.toLowerCase().includes(q) || (m.category || '').toLowerCase().includes(q)) {
                    matches.push({ ...m, restaurant: { id: r.id, name: r.name, image: r.image } });
                }
            });
        });

        return matches;
    }, [query]);

    function renderItem({ item }: { item: SearchResult }) {
        return (
            <TouchableOpacity
                style={styles.row}
                onPress={() => {
                    // navigate to parent restaurant
                    if (item.restaurant?.id) {
                        router.push(`/(user)/restaurant/${item.restaurant.id}` as const);
                    }
                }}
                activeOpacity={0.75}
            >
                <Image source={{ uri: item.image }} style={styles.thumb} />
                <View style={{ flex: 1 }}>
                    <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                    <Text style={styles.itemMeta}>{item.restaurant?.name} • ₦{item.price}</Text>
                </View>
                <Text style={styles.priceTag}>₦{item.price}</Text>
            </TouchableOpacity>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.headerTitle}>Search Menu</Text>
            </View>

            <View style={styles.searchBar}>
                <SearchIcon size={18} color={Colors.light.primary} />
                <TextInput
                    placeholder="Search meals, restaurants..."
                    placeholderTextColor={Colors.light.textSecondary}
                    style={styles.input}
                    value={query}
                    onChangeText={setQuery}
                    returnKeyType="search"
                    selectionColor={Colors.light.primary}
                />
            </View>

            {query === '' ? (
                <View style={styles.empty}>
                    <Text style={styles.emptyIcon}>🔍</Text>
                    <Text style={styles.emptyText}>Search for your favorite meals</Text>
                </View>
            ) : results.length === 0 ? (
                <View style={styles.empty}>
                    <Text style={styles.emptyIcon}>😢</Text>
                    <Text style={styles.emptyText}>No matches found</Text>
                </View>
            ) : (
                <FlatList
                    data={results}
                    keyExtractor={(i) => i.id}
                    renderItem={renderItem}
                    contentContainerStyle={{ padding: 16 }}
                    ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
                    scrollIndicatorInsets={{ right: 1 }}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.backgroundAlt,
    },
    headerContainer: {
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 12,
        backgroundColor: Colors.light.backgroundAlt,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: Colors.light.text,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
        marginBottom: 20,
        paddingHorizontal: 14,
        paddingVertical: 12,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: Colors.light.primary + '20',
        gap: 10,
        shadowColor: Colors.light.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    input: {
        flex: 1,
        height: 40,
        color: Colors.light.text,
        paddingHorizontal: 4,
        fontSize: 16,
        fontWeight: '500',
    },
    empty: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    emptyIcon: {
        fontSize: 56,
        marginBottom: 16,
    },
    emptyText: { 
        color: Colors.light.textSecondary,
        fontSize: 16,
        fontWeight: '500',
        textAlign: 'center',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    thumb: { 
        width: 70, 
        height: 70, 
        borderRadius: 10, 
        marginRight: 12,
        backgroundColor: Colors.light.border,
    },
    itemName: { 
        fontSize: 15, 
        fontWeight: '700', 
        color: Colors.light.text 
    },
    itemMeta: { 
        fontSize: 12, 
        color: Colors.light.textSecondary, 
        marginTop: 4,
        fontWeight: '500',
    },
    priceTag: {
        fontSize: 14,
        fontWeight: '700',
        color: Colors.light.primary,
    },
});
