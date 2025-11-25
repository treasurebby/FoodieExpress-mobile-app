import { Colors } from '@/constants/theme';
import { menuItems, restaurants } from '@/services/mockData';
import * as storage from '@/utils/storage';
import React, { useEffect, useMemo, useState } from 'react';
import {
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const PROFILE_KEY = 'foodie_profile_v1';
const ORDERS_KEY = 'foodie_orders_v1';

interface Profile {
    name: string;
    email?: string;
    phone?: string;
    wallet: number;
    recommendations?: Record<string, string>;
}

const contexts = ['Sunny', 'Cold', 'Night', 'Breakfast'];

export default function ProfileScreen() {
    const [profile, setProfile] = useState<Profile>({ name: '', wallet: 0, recommendations: {} });
    const [loading, setLoading] = useState(true);
    const [ordersCount, setOrdersCount] = useState(0);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const raw = await storage.getItem(PROFILE_KEY);
                if (raw) setProfile(JSON.parse(raw));
            } catch (e) {
                // ignore
            }

            try {
                const rawOrders = await storage.getItem(ORDERS_KEY);
                if (rawOrders) {
                    const parsed = JSON.parse(rawOrders) as any[];
                    setOrdersCount(parsed.length);
                }
            } catch (e) {
                // ignore
            }

            setLoading(false);
        })();
    }, []);

    // compute top restaurant from persisted orders
    const topRestaurant = useMemo(() => {
        try {
            // read orders from storage synchronously via internal cache isn't possible here,
            // so compute from AsyncStorage when component mounts; for UI we rely on ordersCount
            // but we can attempt to read orders again for top restaurant
            return null;
        } catch (e) {
            return null;
        }
    }, [ordersCount]);

    async function saveProfile() {
        try {
            await storage.setItem(PROFILE_KEY, JSON.stringify(profile));
            setSaved(true);
            setTimeout(() => setSaved(false), 1500);
        } catch (e) {
            // ignore
        }
    }

    function randomizeRecommendations() {
        // choose one unique item for each context from menuItems and restaurant menus
        const pool: string[] = [];
        menuItems.forEach((m) => pool.push(m.name));
        restaurants.forEach((r) => (r.menu || []).forEach((m) => pool.push(m.name)));

        // shuffle pool
        const shuffled = pool.sort(() => Math.random() - 0.5);
        const recs: Record<string, string> = {};
        for (let i = 0; i < contexts.length; i++) {
            recs[contexts[i]] = shuffled[i % shuffled.length] || 'Chef special';
        }

        setProfile((p) => ({ ...p, recommendations: recs }));
    }

    useEffect(() => {
        // ensure profile has recommendations
        if (!profile.recommendations || Object.keys(profile.recommendations).length === 0) {
            randomizeRecommendations();
        }
    }, [profile.name]);

    useEffect(() => {
        // persist profile when it changes
        (async () => {
            try {
                await storage.setItem(PROFILE_KEY, JSON.stringify(profile));
            } catch (e) {
                // ignore
            }
        })();
    }, [profile]);

    if (loading) {
        return (
            <View style={styles.center}>
                <Text style={{ color: Colors.light.textSecondary }}>Loading...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
            <View style={styles.headerRow}>
                <Image source={require('@/assets/images/react-logo.png')} style={styles.avatar} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.name}>{profile.name || 'Your name'}</Text>
                    <Text style={styles.small}>{profile.email || 'Email not set'}</Text>
                </View>
                <View style={styles.walletWrap}>
                    <Text style={styles.walletLabel}>Wallet</Text>
                    <Text style={styles.walletAmount}>₦{profile.wallet ?? 0}</Text>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Personal Details</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Full name"
                    value={profile.name}
                    onChangeText={(t) => setProfile((p) => ({ ...p, name: t }))}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={profile.email}
                    onChangeText={(t) => setProfile((p) => ({ ...p, email: t }))}
                    keyboardType={Platform.OS === 'web' ? 'default' : 'email-address'}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Phone"
                    value={profile.phone}
                    onChangeText={(t) => setProfile((p) => ({ ...p, phone: t }))}
                    keyboardType={Platform.OS === 'web' ? 'default' : 'phone-pad'}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Wallet balance"
                    value={String(profile.wallet ?? 0)}
                    onChangeText={(t) => setProfile((p) => ({ ...p, wallet: Number(t) || 0 }))}
                    keyboardType="numeric"
                />
                <TouchableOpacity style={styles.saveBtn} onPress={saveProfile}>
                    <Text style={styles.saveText}>Save profile</Text>
                </TouchableOpacity>
                {saved && <Text style={{ color: Colors.light.primary, marginTop: 8 }}>Saved ✓</Text>}
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Your Stats</Text>
                <View style={styles.statRow}>
                    <Text style={styles.statLabel}>Orders placed</Text>
                    <Text style={styles.statValue}>{ordersCount}</Text>
                </View>
                <View style={styles.statRow}>
                    <Text style={styles.statLabel}>Top restaurant</Text>
                    <Text style={styles.statValue}>{/* computed below if available */}—</Text>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Recommendations</Text>
                {contexts.map((ctx) => (
                    <View key={ctx} style={styles.recoRow}>
                        <Text style={styles.recoContext}>{ctx}</Text>
                        <Text style={styles.recoText}>{profile.recommendations?.[ctx] ?? 'Chef special'}</Text>
                    </View>
                ))}

                <TouchableOpacity style={styles.secondaryBtn} onPress={randomizeRecommendations}>
                    <Text style={styles.secondaryText}>Regenerate recommendations</Text>
                </TouchableOpacity>
            </View>

            <View style={{ height: 80 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.light.background },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    avatar: { width: 72, height: 72, borderRadius: 12, backgroundColor: Colors.light.card },
    name: { fontSize: 18, fontWeight: '700', color: Colors.light.text },
    small: { color: Colors.light.textSecondary },
    walletWrap: { alignItems: 'flex-end' },
    walletLabel: { color: Colors.light.textSecondary, fontSize: 12 },
    walletAmount: { color: Colors.light.primary, fontWeight: '700', fontSize: 16 },
    section: { marginTop: 12, backgroundColor: 'transparent' },
    sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.light.text, marginBottom: 8 },
    input: {
        backgroundColor: Colors.light.card,
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
        color: Colors.light.text,
    },
    saveBtn: { backgroundColor: Colors.light.primary, padding: 12, borderRadius: 8, alignItems: 'center' },
    saveText: { color: 'white', fontWeight: '700' },
    statRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
    statLabel: { color: Colors.light.textSecondary },
    statValue: { color: Colors.light.text, fontWeight: '700' },
    recoRow: { paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: Colors.light.border },
    recoContext: { color: Colors.light.textSecondary, fontWeight: '700' },
    recoText: { color: Colors.light.text, marginTop: 4 },
    secondaryBtn: { marginTop: 12, alignItems: 'center' },
    secondaryText: { color: Colors.light.primary, fontWeight: '700' },
});
