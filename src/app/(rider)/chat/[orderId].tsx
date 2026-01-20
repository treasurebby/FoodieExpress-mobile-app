import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ArrowLeft,
  Send,
  Phone,
  MapPin,
  Image as ImageIcon,
  CheckCheck,
} from 'lucide-react-native';
import { generateChatMessages, quickReplies, ChatMessage } from '@/services/riderMockData';

export default function ChatDetailScreen() {
  const { orderId, customerName } = useLocalSearchParams<{ orderId: string; customerName: string }>();
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(generateChatMessages(orderId || 'default'));

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    
    const newMessage = {
      id: Date.now().toString(),
      message: text.trim(),
      sender: 'rider' as const,
      timestamp: new Date(),
      read: false,
    };
    
    setMessages([...messages, newMessage]);
    setMessage('');
    
    // Simulate customer response
    setTimeout(() => {
      const responses = [
        "Thanks!",
        "Okay, no problem",
        "Great, thank you!",
        "Alright, I'll be waiting",
      ];
      const response: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: responses[Math.floor(Math.random() * responses.length)],
        sender: 'customer' as const,
        timestamp: new Date(),
        read: false,
      };
      setMessages(prev => [...prev, response]);
    }, 2000);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{customerName}</Text>
          <Text style={styles.headerSubtitle}>Order #{orderId?.slice(0, 8)}</Text>
        </View>
        <TouchableOpacity style={styles.callButton}>
          <Phone size={20} color="#1B5E20" />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Delivery Info Card */}
        <View style={styles.infoCard}>
          <MapPin size={16} color="#1B5E20" />
          <Text style={styles.infoText}>
            Delivering to: 45 University Road, Nsukka
          </Text>
        </View>

        {/* Messages */}
        {messages.map((msg) => (
          <View
            key={msg.id}
            style={[
              styles.messageBubble,
              msg.sender === 'rider' ? styles.riderMessage : styles.customerMessage,
            ]}
          >
            <Text
              style={[
                styles.messageText,
                msg.sender === 'rider' && styles.riderMessageText,
              ]}
            >
              {msg.message}
            </Text>
            <View style={styles.messageFooter}>
              <Text
                style={[
                  styles.messageTime,
                  msg.sender === 'rider' && styles.riderMessageTime,
                ]}
              >
                {msg.timestamp.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
              {msg.sender === 'rider' && (
                <CheckCheck size={14} color={msg.read ? '#4CAF50' : 'rgba(255,255,255,0.6)'} />
              )}
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Quick Replies */}
      <ScrollView
        horizontal
        style={styles.quickRepliesContainer}
        contentContainerStyle={styles.quickRepliesContent}
        showsHorizontalScrollIndicator={false}
      >
        {quickReplies.map((reply, index) => (
          <TouchableOpacity
            key={index}
            style={styles.quickReply}
            onPress={() => sendMessage(reply)}
          >
            <Text style={styles.quickReplyText}>{reply}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Input */}
      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.imageButton}>
          <ImageIcon size={22} color="#999" />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor="#999"
          value={message}
          onChangeText={setMessage}
          multiline
        />
        <TouchableOpacity
          style={[styles.sendButton, message.trim() && styles.sendButtonActive]}
          onPress={() => sendMessage(message)}
          disabled={!message.trim()}
        >
          <Send size={20} color={message.trim() ? '#fff' : '#999'} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 60,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  backButton: {
    padding: 4,
  },
  headerCenter: {
    flex: 1,
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  callButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 8,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    gap: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#1B5E20',
    fontWeight: '600',
  },
  messageBubble: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 8,
  },
  riderMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#1B5E20',
    borderBottomRightRadius: 4,
  },
  customerMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  messageText: {
    fontSize: 15,
    color: '#1A1A1A',
    lineHeight: 20,
    marginBottom: 4,
  },
  riderMessageText: {
    color: '#fff',
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  messageTime: {
    fontSize: 11,
    color: '#999',
  },
  riderMessageTime: {
    color: 'rgba(255,255,255,0.8)',
  },
  quickRepliesContainer: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  quickRepliesContent: {
    padding: 12,
    gap: 8,
  },
  quickReply: {
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  quickReplyText: {
    fontSize: 13,
    color: '#1A1A1A',
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    gap: 8,
  },
  imageButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    fontSize: 15,
    color: '#1A1A1A',
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonActive: {
    backgroundColor: '#1B5E20',
  },
});
