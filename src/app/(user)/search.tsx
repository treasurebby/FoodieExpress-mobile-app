import { Colors } from '@/constants/theme';
import { restaurants } from '@/services/mockData';
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

export default function SearchScreen() {
    const router = useRouter();
    const [query, setQuery] = useState('');

    const results = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return [];

        // search across restaurant menus for available items
        const matches: Array<any> = [];
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

    function renderItem({ item }: { item: any }) {
        return (
            <TouchableOpacity
                style={styles.row}
                onPress={() => {
                    // navigate to parent restaurant
                    if (item.restaurant?.id) {
                        router.push(`/restaurant/${item.restaurant.id}` as any);
                    }
                }}
            >
                <Image source={{ uri: item.image }} style={styles.thumb} />
                <View style={{ flex: 1 }}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemMeta}>{item.restaurant?.name} • ₦{item.price}</Text>
                </View>
            </TouchableOpacity>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.searchBar}>
                <SearchIcon size={18} color={Colors.light.textSecondary} />
                <TextInput
                    placeholder="Search for meals, e.g. 'Jollof', 'Shawarma'"
                    placeholderTextColor={Colors.light.textSecondary}
                    style={styles.input}
                    value={query}
                    onChangeText={setQuery}
                    returnKeyType="search"
                />
            </View>

            {query === '' ? (
                <View style={styles.empty}><Text style={styles.emptyText}>Type to search for products</Text></View>
            ) : results.length === 0 ? (
                <View style={styles.empty}><Text style={styles.emptyText}>No matching products found</Text></View>
            ) : (
                <FlatList
                    data={results}
                    keyExtractor={(i) => i.id}
                    renderItem={renderItem}
                    contentContainerStyle={{ padding: 16 }}
                    ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: Colors.light.card,
        borderBottomWidth: 1,
        borderBottomColor: Colors.light.border,
        gap: 8,
    },
    input: {
        flex: 1,
        height: 40,
        color: Colors.light.text,
        paddingHorizontal: 8,
        fontSize: 16,
    },
    empty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyText: { color: Colors.light.textSecondary },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: Colors.light.card,
        borderRadius: 10,
    },
    thumb: { width: 64, height: 64, borderRadius: 8, marginRight: 12 },
    itemName: { fontSize: 16, fontWeight: '600', color: Colors.light.text },
    itemMeta: { fontSize: 13, color: Colors.light.textSecondary, marginTop: 4 },
});
