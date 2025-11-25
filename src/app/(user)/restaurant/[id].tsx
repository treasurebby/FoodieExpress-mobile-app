import { Colors } from '@/constants/theme';
import { menuItems, restaurants } from '@/services/mockData';
import { useCartStore } from '@/store/cartStore';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Clock, MapPin, Star } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function RestaurantDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const addItem = useCartStore((state) => state.addItem);

    const restaurant = restaurants.find((r) => r.id === id);

    // show only restaurants in the same location with available items
    const contactList = restaurants.filter(
        (r) => r.location === restaurant?.location && (r.menu ?? []).some((m) => m.available),
    );

    // Chat state for contacting restaurants
    const [chatOpen, setChatOpen] = useState(false);
    const [activeChat, setActiveChat] = useState<{ restaurantId: string; restaurantName: string } | null>(null);
    const [messages, setMessages] = useState<{ from: 'user' | 'bot'; text: string }[]>([]);
    const [draft, setDraft] = useState('');

    useEffect(() => {
        if (activeChat) {
            // initial greeting from restaurant bot
            setMessages([
                { from: 'bot', text: `Hi! You're chatting with ${activeChat.restaurantName}. How can we help today?` },
            ]);
        } else {
            setMessages([]);
        }
    }, [activeChat]);

    function sendMessage() {
        const text = draft.trim();
        if (!text || !activeChat) return;
        // append user message
        setMessages((m) => [...m, { from: 'user', text }]);
        setDraft('');

        // mock bot reply based on simple keywords
        setTimeout(() => {
            const lower = text.toLowerCase();
            let reply = `Thanks — we've received your message: "${text}". We'll get back to you shortly.`;
            if (lower.includes('late')) reply = "We're sorry your order is late. We'll check with the kitchen and update you.";
            if (lower.includes('wrong') || lower.includes('incorrect') || lower.includes('missing')) reply = "Sorry about that. Please tell us which item was wrong or missing and we'll fix it.";
            if (lower.includes('refund') || lower.includes('money')) reply = "We can process a refund. Please provide your order ID and we'll start the process.";
            setMessages((m) => [...m, { from: 'bot', text: reply }]);
        }, 700);
    }

    if (!restaurant) {
        return (
            <View style={styles.container}>
                <Text>Restaurant not found</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header Image */}
            <View style={styles.headerContainer}>
                <Image source={{ uri: restaurant.image }} style={styles.headerImage} />
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <ArrowLeft size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Restaurant Info */}
                <View style={styles.infoSection}>
                    <Text style={styles.name}>{restaurant.name}</Text>
                    <Text style={styles.cuisine}>{restaurant.cuisine.join(' • ')}</Text>

                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Star size={16} color={Colors.light.warning} fill={Colors.light.warning} />
                            <Text style={styles.statText}>{restaurant.rating}</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Clock size={16} color={Colors.light.textSecondary} />
                            <Text style={styles.statText}>{restaurant.deliveryTime}</Text>
                        </View>
                        <View style={styles.statItem}>
                            <MapPin size={16} color={Colors.light.textSecondary} />
                            <Text style={styles.statText}>{restaurant.distance}</Text>
                        </View>
                    </View>
                </View>

                {/* Menu */}
                <View style={styles.menuSection}>
                    <Text style={styles.sectionTitle}>Menu</Text>
                    {(restaurant.menu ?? menuItems).map((item) => (
                        <View key={item.id} style={styles.menuItem}>
                            <Image source={item.image ? { uri: item.image } : require('../../../assets/images/react-logo.png')} style={styles.menuItemImage} />
                            <View style={styles.menuItemInfo}>
                                <Text style={styles.menuItemName}>{item.name}</Text>
                                <Text style={styles.menuItemDescription} numberOfLines={2}>
                                    {item.description}
                                </Text>
                                <View style={styles.menuItemFooter}>
                                    <Text style={styles.price}>₦{item.price.toFixed(0)}</Text>
                                    {item.available ? (
                                        <TouchableOpacity
                                            style={styles.addButton}
                                            onPress={() => addItem(item)}
                                        >
                                            <Text style={styles.addButtonText}>Add</Text>
                                        </TouchableOpacity>
                                    ) : (
                                        <Text style={styles.unavailable}>Unavailable</Text>
                                    )}
                                </View>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Contact Restaurants */}
                <View style={styles.contactSection}>
                    <Text style={styles.sectionTitle}>Contact Nearby Restaurants</Text>
                    {contactList.length === 0 ? (
                        <Text style={{ color: Colors.light.textSecondary }}>No nearby restaurants currently available.</Text>
                    ) : (
                        contactList.map((r) => (
                            <View key={r.id} style={styles.contactRow}>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.contactName}>{r.name}</Text>
                                    <Text style={styles.contactMeta}>{r.location}</Text>
                                </View>
                                <TouchableOpacity
                                    style={styles.messageBtn}
                                    onPress={() => {
                                        // open chat for this restaurant
                                        setActiveChat({ restaurantId: r.id, restaurantName: r.name });
                                        setChatOpen(true);
                                    }}
                                >
                                    <Text style={styles.messageBtnText}>Contact</Text>
                                </TouchableOpacity>
                            </View>
                        ))
                    )}
                </View>
            </ScrollView>

            {/* Chat panel */}
            {chatOpen && activeChat && (
                <View style={styles.chatPanel}>
                    <View style={styles.chatHeader}>
                        <TouchableOpacity style={styles.chatBack} onPress={() => setChatOpen(false)}>
                            <Text style={styles.chatBackText}>⬅</Text>
                        </TouchableOpacity>
                        <Text style={styles.chatTitle}>{activeChat.restaurantName}</Text>
                    </View>

                    <View style={styles.chatBody}>
                        {messages.map((m, idx) => (
                            <View key={idx} style={[styles.chatBubble, m.from === 'user' ? styles.bubbleUser : styles.bubbleBot]}>
                                <Text style={m.from === 'user' ? styles.chatTextUser : styles.chatTextBot}>{m.text}</Text>
                            </View>
                        ))}
                    </View>

                    <View style={styles.chatInputRow}>
                        <TextInput
                            style={styles.chatInput}
                            placeholder="Type a message..."
                            placeholderTextColor={Colors.light.textSecondary}
                            value={draft}
                            onChangeText={setDraft}
                        />
                        <TouchableOpacity style={styles.chatSend} onPress={sendMessage}>
                            <Text style={styles.chatSendText}>Send</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    headerContainer: {
        position: 'relative',
    },
    headerImage: {
        width: '100%',
        height: 250,
        backgroundColor: Colors.light.border,
    },
    backButton: {
        position: 'absolute',
        top: 50,
        left: 20,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flex: 1,
    },
    infoSection: {
        padding: 20,
        backgroundColor: Colors.light.card,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.light.text,
    },
    cuisine: {
        fontSize: 16,
        color: Colors.light.textSecondary,
        marginTop: 4,
    },
    statsRow: {
        flexDirection: 'row',
        gap: 20,
        marginTop: 16,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    statText: {
        fontSize: 14,
        color: Colors.light.textSecondary,
    },
    menuSection: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.light.text,
        marginBottom: 16,
    },
    menuItem: {
        flexDirection: 'row',
        backgroundColor: Colors.light.card,
        borderRadius: 12,
        marginBottom: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    menuItemImage: {
        width: 100,
        height: 100,
        backgroundColor: Colors.light.border,
    },
    menuItemInfo: {
        flex: 1,
        padding: 12,
    },
    menuItemName: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.light.text,
    },
    menuItemDescription: {
        fontSize: 13,
        color: Colors.light.textSecondary,
        marginTop: 4,
    },
    menuItemFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
    },
    price: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.light.primary,
    },
    addButton: {
        backgroundColor: Colors.light.primary,
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    unavailable: {
        fontSize: 13,
        color: Colors.light.textSecondary,
    },
    contactSection: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: Colors.light.border,
        backgroundColor: Colors.light.background,
    },
    contactRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    contactName: { fontSize: 15, fontWeight: '600', color: Colors.light.text },
    contactMeta: { fontSize: 13, color: Colors.light.textSecondary },
    messageBtn: {
        backgroundColor: Colors.light.primary,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 8,
    },
    messageBtnText: { color: '#fff', fontWeight: '700' },

    chatPanel: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 320,
        backgroundColor: Colors.light.card,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        borderTopWidth: 1,
        borderTopColor: Colors.light.border,
        overflow: 'hidden',
    },
    chatHeader: { flexDirection: 'row', alignItems: 'center', padding: 12, borderBottomWidth: 1, borderBottomColor: Colors.light.border },
    chatBack: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.light.background, justifyContent: 'center', alignItems: 'center', marginRight: 8 },
    chatBackText: { fontSize: 18 },
    chatTitle: { fontSize: 16, fontWeight: '700', color: Colors.light.text },
    chatBody: { flex: 1, padding: 12 },
    chatBubble: { marginBottom: 8, padding: 10, borderRadius: 10, maxWidth: '80%' },
    bubbleUser: { backgroundColor: Colors.light.primary, alignSelf: 'flex-end' },
    bubbleBot: { backgroundColor: Colors.light.card, alignSelf: 'flex-start' },
    chatTextUser: { color: '#fff' },
    chatTextBot: { color: Colors.light.text },
    chatInputRow: { flexDirection: 'row', padding: 8, borderTopWidth: 1, borderTopColor: Colors.light.border, alignItems: 'center' },
    chatInput: { flex: 1, backgroundColor: Colors.light.background, padding: 10, borderRadius: 8, color: Colors.light.text },
    chatSend: { marginLeft: 8, backgroundColor: Colors.light.primary, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
    chatSendText: { color: '#fff', fontWeight: '700' },
});
