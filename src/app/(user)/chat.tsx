import ChatTypingIndicator from '@/components/ChatTypingIndicator';
import QuickReplyButtons from '@/components/QuickReplyButtons';
import AppColors, { Colors } from '@/constants/colors';
import { detectIssueType, generateAIResponse, shouldEscalateToHuman } from '@/services/chatAI';
import { ChatMessage, ChatSession, QuickReplyOption } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { ArrowLeft, Send, Star, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    FlatList,
    Image,
    KeyboardAvoidingView,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

const CHATS_STORAGE_KEY = '@foodie_chats_enhanced';

// Restaurant logos
const restaurantLogos: Record<string, string> = {
    'r1': 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=100&h=100&fit=crop',
    'r2': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&h=100&fit=crop',
    'r3': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=100&h=100&fit=crop',
};

export default function ChatScreen() {
    const router = useRouter();
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
    const [messageText, setMessageText] = useState('');
    const [loading, setLoading] = useState(false);
    const [showTypingIndicator, setShowTypingIndicator] = useState(false);
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState('');
    const [showEscalationModal, setShowEscalationModal] = useState(false);

    // Load chats from storage
    useEffect(() => {
        loadChats();
    }, []);

    const loadChats = async () => {
        try {
            const stored = await AsyncStorage.getItem(CHATS_STORAGE_KEY);
            if (stored) {
                setSessions(JSON.parse(stored));
            }
        } catch (err) {
            console.log('Failed to load chats:', err);
        }
    };

    const saveChats = async (chats: ChatSession[]) => {
        try {
            await AsyncStorage.setItem(CHATS_STORAGE_KEY, JSON.stringify(chats));
        } catch (err) {
            console.log('Failed to save chats:', err);
        }
    };

    const startNewChat = (restaurantId: string, restaurantName: string) => {
        const newSession: ChatSession = {
            id: `chat_${Date.now()}`,
            restaurantId,
            restaurantName,
            restaurantLogo: restaurantLogos[restaurantId],
            messages: [
                {
                    id: `msg_${Date.now()}`,
                    from: 'bot',
                    text: `👋 Welcome to ${restaurantName}! How can we help you today?`,
                    timestamp: new Date().toISOString(),
                    avatar: restaurantLogos[restaurantId],
                    senderName: restaurantName,
                    messageType: 'text',
                    isRead: true,
                },
            ],
            createdAt: new Date().toISOString(),
            lastMessageAt: new Date().toISOString(),
            unreadCount: 0,
            isResolved: false,
            context: {
                lastOrderId: `order_${Math.floor(Math.random() * 1000)}`,
            },
        };

        setSessions(prev => [newSession, ...prev]);
        setActiveSessionId(newSession.id);
        saveChats([newSession, ...sessions]);
    };

    const sendMessage = async () => {
        if (!messageText.trim() || !activeSessionId || loading) return;

        setLoading(true);
        const userMessage: ChatMessage = {
            id: `msg_${Date.now()}`,
            from: 'user',
            text: messageText,
            timestamp: new Date().toISOString(),
        };

        // Update messages with user message
        setSessions(prev =>
            prev.map(s =>
                s.id === activeSessionId
                    ? {
                        ...s,
                        messages: [...s.messages, userMessage],
                        lastMessageAt: new Date().toISOString(),
                    }
                    : s
            )
        );

        setMessageText('');

        // Check for escalation
        const currentSession = sessions.find(s => s.id === activeSessionId);
        if (currentSession) {
            const allMessages = [...currentSession.messages, userMessage].map(m => m.text);
            
            if (shouldEscalateToHuman(allMessages)) {
                setShowEscalationModal(true);
            }

            // Show typing indicator
            setShowTypingIndicator(true);

            // Get AI response
            setTimeout(() => {
                const aiResponse = generateAIResponse(messageText, {
                    restaurantId: currentSession.restaurantId,
                    restaurantName: currentSession.restaurantName,
                    lastOrderId: currentSession.context?.lastOrderId,
                    previousMessages: allMessages.slice(-5),
                    userIssueType: detectIssueType(messageText),
                });

                const botMessage: ChatMessage = {
                    id: `msg_${Date.now() + 1}`,
                    from: 'bot',
                    text: aiResponse.text,
                    timestamp: new Date().toISOString(),
                    messageType: aiResponse.quickReplies ? 'quick_reply' : 'text',
                    isRead: true,
                    avatar: restaurantLogos[currentSession.restaurantId],
                    senderName: currentSession.restaurantName,
                    quickReplyOptions: aiResponse.quickReplies,
                    suggestedResponses: aiResponse.suggestedResponses,
                };

                setSessions(prev => {
                    const updated = prev.map(s =>
                        s.id === activeSessionId
                            ? {
                                ...s,
                                messages: [...s.messages, botMessage],
                                lastMessageAt: new Date().toISOString(),
                            }
                            : s
                    );
                    saveChats(updated);
                    return updated;
                });

                setShowTypingIndicator(false);
                setLoading(false);
            }, 1200);
        }
    };

    const handleQuickReply = (option: QuickReplyOption) => {
        switch (option.action) {
            case 'track_order':
                Alert.alert('📍 Order Tracking', `Your order #${option.orderId} is on its way!\n\nEstimated time: 15 minutes\nDriver: Ahmed (⭐ 4.8)`);
                break;
            case 'view_menu':
                router.push('/(user)/search' as any);
                break;
            case 'report_issue':
                setMessageText('I have an issue with my order...');
                break;
            case 'escalate':
                setShowEscalationModal(true);
                break;
            case 'custom':
                // Handle custom actions
                break;
        }
    };

    const handleRating = (stars: number) => {
        setRating(stars);
    };

    const submitRating = () => {
        if (!activeSessionId) return;

        setSessions(prev =>
            prev.map(s =>
                s.id === activeSessionId
                    ? {
                        ...s,
                        rating,
                        feedback,
                        isResolved: true,
                    }
                    : s
            )
        );

        saveChats(sessions.map(s =>
            s.id === activeSessionId
                ? { ...s, rating, feedback, isResolved: true }
                : s
        ));

        setShowRatingModal(false);
        Alert.alert('Thank you! 🙏', 'Your feedback helps us improve!');
    };

    const handleEscalation = (action: 'call' | 'manager' | 'refund') => {
        const messages: Record<string, string> = {
            call: '📞 Connecting to restaurant support...',
            manager: '👤 Escalating to manager. You\'ll hear back within 5 minutes.',
            refund: '💳 Processing immediate refund to your account...',
        };

        Alert.alert('Escalation', messages[action]);
        setShowEscalationModal(false);

        // Add escalation message
        if (activeSessionId) {
            const escalationMessage: ChatMessage = {
                id: `msg_${Date.now()}`,
                from: 'bot',
                text: `${messages[action]} Thank you for your patience!`,
                timestamp: new Date().toISOString(),
                messageType: 'text',
                isRead: true,
            };

            setSessions(prev =>
                prev.map(s =>
                    s.id === activeSessionId
                        ? {
                            ...s,
                            messages: [...s.messages, escalationMessage],
                            escalatedToHuman: true,
                        }
                        : s
                )
            );
        }
    };

    const activeSession = sessions.find(s => s.id === activeSessionId);

    if (activeSession) {
        return (
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => {
                        if (!activeSession.isResolved && activeSession.messages.length > 1) {
                            setShowRatingModal(true);
                        } else {
                            setActiveSessionId(null);
                        }
                    }}>
                        <ArrowLeft size={24} color={Colors.light.primary} />
                    </TouchableOpacity>
                    <View style={styles.headerTitle}>
                        <Image
                            source={{ uri: activeSession.restaurantLogo }}
                            style={styles.headerAvatar}
                        />
                        <View>
                            <Text style={styles.headerName}>{activeSession.restaurantName}</Text>
                            <Text style={styles.headerStatus}>
                                {activeSession.escalatedToHuman ? '👤 Speaking with manager' : '🟢 Online'}
                            </Text>
                        </View>
                    </View>
                    <TouchableOpacity onPress={() => setActiveSessionId(null)}>
                        <X size={24} color={Colors.light.textSecondary} />
                    </TouchableOpacity>
                </View>

                {/* Messages */}
                <FlatList
                    data={activeSession.messages}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <View
                            style={[
                                styles.messageRow,
                                item.from === 'user' ? styles.userMessageRow : styles.botMessageRow,
                            ]}
                        >
                            {item.from === 'bot' && (
                                <Image
                                    source={{ uri: item.avatar || activeSession.restaurantLogo }}
                                    style={styles.avatar}
                                />
                            )}
                            <View style={{ flex: 1 }}>
                                <View
                                    style={[
                                        styles.messageBubble,
                                        item.from === 'user'
                                            ? styles.userMessageBubble
                                            : styles.botMessageBubble,
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.messageText,
                                            item.from === 'user'
                                                ? styles.userMessageText
                                                : styles.botMessageText,
                                        ]}
                                    >
                                        {item.text}
                                    </Text>
                                </View>
                                <Text style={styles.timestamp}>
                                    {new Date(item.timestamp).toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </Text>
                            </View>
                            {item.from === 'user' && (
                                <Text style={styles.readReceipt}>{item.isRead ? '✓✓' : '✓'}</Text>
                            )}
                        </View>
                    )}
                    inverted
                    contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 8 }}
                    scrollIndicatorInsets={{ right: 1 }}
                />

                {/* Quick replies */}
                {activeSession.messages[0]?.quickReplyOptions && (
                    <QuickReplyButtons
                        options={activeSession.messages[activeSession.messages.length - 1]?.quickReplyOptions || []}
                        onSelect={handleQuickReply}
                        loading={loading}
                    />
                )}

                {/* Typing indicator */}
                {showTypingIndicator && <ChatTypingIndicator senderName={activeSession.restaurantName} />}

                {/* Input */}
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    style={styles.inputContainer}
                >
                    <View style={styles.inputRow}>
                        <TextInput
                            style={styles.input}
                            placeholder="Type a message..."
                            placeholderTextColor={AppColors.text.disabled}
                            value={messageText}
                            onChangeText={setMessageText}
                            multiline
                            editable={!loading}
                        />
                        <TouchableOpacity
                            onPress={sendMessage}
                            disabled={!messageText.trim() || loading}
                            style={styles.sendButton}
                        >
                            <Send
                                size={20}
                                color={messageText.trim() ? Colors.light.primary : AppColors.text.disabled}
                            />
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>

                {/* Rating Modal */}
                <Modal visible={showRatingModal} transparent animationType="fade">
                    <View style={styles.modalOverlay}>
                        <View style={styles.ratingModal}>
                            <Text style={styles.ratingTitle}>Rate this conversation</Text>
                            <View style={styles.starsContainer}>
                                {[1, 2, 3, 4, 5].map(star => (
                                    <TouchableOpacity key={star} onPress={() => handleRating(star)}>
                                        <Star
                                            size={32}
                                            color={star <= rating ? Colors.light.warning : Colors.light.border}
                                            fill={star <= rating ? Colors.light.warning : 'none'}
                                        />
                                    </TouchableOpacity>
                                ))}
                            </View>
                            <TextInput
                                style={styles.feedbackInput}
                                placeholder="Any feedback? (optional)"
                                placeholderTextColor={Colors.light.textSecondary}
                                value={feedback}
                                onChangeText={setFeedback}
                                multiline
                                numberOfLines={3}
                            />
                            <View style={styles.ratingButtonRow}>
                                <TouchableOpacity
                                    style={[styles.ratingButton, styles.cancelButton]}
                                    onPress={() => {
                                        setShowRatingModal(false);
                                        setActiveSessionId(null);
                                    }}
                                >
                                    <Text style={styles.cancelButtonText}>Skip</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.ratingButton, styles.submitButton]}
                                    onPress={submitRating}
                                    disabled={rating === 0}
                                >
                                    <Text style={styles.submitButtonText}>Submit</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

                {/* Escalation Modal */}
                <Modal visible={showEscalationModal} transparent animationType="fade">
                    <View style={styles.modalOverlay}>
                        <View style={styles.escalationModal}>
                            <Text style={styles.escalationTitle}>How can we help?</Text>
                            <TouchableOpacity
                                style={styles.escalationOption}
                                onPress={() => handleEscalation('call')}
                            >
                                <Text style={styles.escalationOptionIcon}>📞</Text>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.escalationOptionTitle}>Call Support</Text>
                                    <Text style={styles.escalationOptionText}>Speak with a representative</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.escalationOption}
                                onPress={() => handleEscalation('manager')}
                            >
                                <Text style={styles.escalationOptionIcon}>👤</Text>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.escalationOptionTitle}>Speak to Manager</Text>
                                    <Text style={styles.escalationOptionText}>Get immediate assistance</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.escalationOption}
                                onPress={() => handleEscalation('refund')}
                            >
                                <Text style={styles.escalationOptionIcon}>💳</Text>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.escalationOptionTitle}>Process Refund</Text>
                                    <Text style={styles.escalationOptionText}>Fast refund to your account</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => setShowEscalationModal(false)}
                            >
                                <Text style={styles.closeButtonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
        );
    }

    // Chat list
    return (
        <View style={styles.container}>
            <View style={styles.listHeader}>
                <Text style={styles.listTitle}>Messages</Text>
            </View>

            {sessions.length === 0 ? (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyStateIcon}>💬</Text>
                    <Text style={styles.emptyStateText}>No chats yet</Text>
                    <Text style={styles.emptyStateSubtext}>Start a conversation with a restaurant</Text>
                    <TouchableOpacity
                        style={styles.newChatButton}
                        onPress={() => startNewChat('r1', 'Bukka Republic')}
                    >
                        <Text style={styles.newChatButtonText}>Start Chat</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={sessions}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => {
                        const lastMessage = item.messages[item.messages.length - 1];
                        return (
                            <TouchableOpacity
                                style={styles.chatItem}
                                onPress={() => setActiveSessionId(item.id)}
                            >
                                <Image
                                    source={{ uri: item.restaurantLogo }}
                                    style={styles.chatItemAvatar}
                                />
                                <View style={styles.chatItemContent}>
                                    <Text style={styles.chatItemName}>{item.restaurantName}</Text>
                                    <Text style={styles.chatItemPreview} numberOfLines={1}>
                                        {lastMessage?.from === 'user' ? 'You: ' : ''}{lastMessage?.text}
                                    </Text>
                                </View>
                                <View style={styles.chatItemRight}>
                                    {item.unreadCount ? (
                                        <View style={styles.badge}>
                                            <Text style={styles.badgeText}>{item.unreadCount}</Text>
                                        </View>
                                    ) : null}
                                    <Text style={styles.chatItemTime}>
                                        {new Date(item.lastMessageAt).toLocaleDateString()}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        );
                    }}
                    contentContainerStyle={styles.listContent}
                    scrollIndicatorInsets={{ right: 1 }}
                />
            )}

            {sessions.length > 0 && (
                <TouchableOpacity
                    style={styles.newChatButton}
                    onPress={() => {
                        Alert.alert('Start New Chat', 'Choose a restaurant:', [
                            { text: 'Bukka Republic', onPress: () => startNewChat('r1', 'Bukka Republic') },
                            { text: 'Spice Kitchen', onPress: () => startNewChat('r2', 'Spice Kitchen') },
                            { text: 'Pizza Perfect', onPress: () => startNewChat('r3', 'Pizza Perfect') },
                            { text: 'Cancel', style: 'cancel' },
                        ]);
                    }}
                >
                    <Text style={styles.newChatButtonText}>+ New Chat</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'Colors.light.backgroundAlt',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: Colors.light.border,
        paddingTop: 12,
    },
    headerTitle: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginLeft: 12,
    },
    headerAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    headerName: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.light.text,
    },
    headerStatus: {
        fontSize: 12,
        color: Colors.light.textSecondary,
        marginTop: 2,
    },
    messageRow: {
        flexDirection: 'row',
        marginVertical: 6,
        alignItems: 'flex-end',
    },
    userMessageRow: {
        justifyContent: 'flex-end',
        paddingRight: 16,
    },
    botMessageRow: {
        justifyContent: 'flex-start',
        paddingLeft: 16,
    },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        marginRight: 8,
    },
    messageBubble: {
        maxWidth: '75%',
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 16,
    },
    userMessageBubble: {
        backgroundColor: Colors.light.primary,
    },
    botMessageBubble: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: Colors.light.border,
    },
    messageText: {
        fontSize: 15,
        lineHeight: 20,
    },
    userMessageText: {
        color: '#FFFFFF',
        fontWeight: '500',
    },
    botMessageText: {
        color: Colors.light.text,
    },
    timestamp: {
        fontSize: 11,
        color: Colors.light.textSecondary,
        marginTop: 4,
        paddingHorizontal: 12,
    },
    readReceipt: {
        fontSize: 11,
        color: Colors.light.primary,
        marginLeft: 4,
        fontWeight: '700',
    },
    inputContainer: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: Colors.light.border,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 8,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: Colors.light.border,
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        fontSize: 14,
        color: Colors.light.text,
        maxHeight: 100,
    },
    sendButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.light.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listHeader: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: 'Colors.light.backgroundAlt',
    },
    listTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: Colors.light.text,
    },
    listContent: {
        paddingHorizontal: 12,
        paddingTop: 8,
        paddingBottom: 20,
    },
    chatItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 12,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 1,
    },
    chatItemAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 12,
    },
    chatItemContent: {
        flex: 1,
    },
    chatItemName: {
        fontSize: 15,
        fontWeight: '700',
        color: Colors.light.text,
    },
    chatItemPreview: {
        fontSize: 13,
        color: Colors.light.textSecondary,
        marginTop: 3,
    },
    chatItemRight: {
        alignItems: 'flex-end',
        gap: 4,
    },
    chatItemTime: {
        fontSize: 12,
        color: Colors.light.textSecondary,
    },
    badge: {
        backgroundColor: Colors.light.primary,
        borderRadius: 10,
        minWidth: 20,
        paddingHorizontal: 6,
        paddingVertical: 2,
    },
    badgeText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: '700',
        textAlign: 'center',
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    emptyStateIcon: {
        fontSize: 56,
        marginBottom: 16,
    },
    emptyStateText: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.light.text,
        marginBottom: 8,
    },
    emptyStateSubtext: {
        fontSize: 14,
        color: Colors.light.textSecondary,
        marginBottom: 24,
    },
    newChatButton: {
        marginHorizontal: 16,
        marginVertical: 12,
        paddingVertical: 14,
        paddingHorizontal: 16,
        backgroundColor: Colors.light.primary,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: Colors.light.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    newChatButtonText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 15,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    ratingModal: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        paddingHorizontal: 20,
        paddingVertical: 24,
        width: '85%',
        maxWidth: 320,
    },
    ratingTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.light.text,
        marginBottom: 16,
        textAlign: 'center',
    },
    starsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 12,
        marginBottom: 16,
    },
    feedbackInput: {
        borderWidth: 1,
        borderColor: Colors.light.border,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 14,
        color: Colors.light.text,
        marginBottom: 16,
        maxHeight: 80,
    },
    ratingButtonRow: {
        flexDirection: 'row',
        gap: 12,
    },
    ratingButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: Colors.light.border,
    },
    submitButton: {
        backgroundColor: Colors.light.primary,
    },
    cancelButtonText: {
        color: Colors.light.textSecondary,
        fontWeight: '700',
    },
    submitButtonText: {
        color: '#FFFFFF',
        fontWeight: '700',
    },
    escalationModal: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        paddingHorizontal: 20,
        paddingVertical: 24,
        width: '90%',
        maxWidth: 380,
    },
    escalationTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.light.text,
        marginBottom: 16,
        textAlign: 'center',
    },
    escalationOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 12,
        backgroundColor: Colors.light.background,
        borderRadius: 10,
        marginBottom: 10,
    },
    escalationOptionIcon: {
        fontSize: 24,
        marginRight: 12,
    },
    escalationOptionTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: Colors.light.text,
    },
    escalationOptionText: {
        fontSize: 12,
        color: Colors.light.textSecondary,
        marginTop: 2,
    },
    closeButton: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: Colors.light.border,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 8,
    },
    closeButtonText: {
        color: Colors.light.text,
        fontWeight: '700',
    },
});
