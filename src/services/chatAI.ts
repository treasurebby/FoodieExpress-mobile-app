import { QuickReplyOption } from '@/types';

// Restaurant personalities and knowledge bases
const restaurantPersonalities: Record<string, { name: string; emoji: string; style: string }> = {
  'bukka-republic': { name: 'Bukka Republic', emoji: '🍲', style: 'friendly, warm, traditional' },
  'spice-kitchen': { name: 'Spice Kitchen', emoji: '🌶️', style: 'vibrant, energetic, bold' },
  'sushi-palace': { name: 'Sushi Palace', emoji: '🍣', style: 'professional, elegant, refined' },
  'pizza-perfect': { name: 'Pizza Perfect', emoji: '🍕', style: 'casual, fun, quick' },
  'salad-bar': { name: 'Salad Bar', emoji: '🥗', style: 'health-conscious, informative' },
};

export interface AIResponseContext {
  restaurantId: string;
  restaurantName: string;
  lastOrderId?: string;
  previousMessages?: string[];
  userIssueType?: string;
}

// Enhanced AI response with context awareness
export const generateAIResponse = (
  userMessage: string,
  context: AIResponseContext
): { text: string; quickReplies?: QuickReplyOption[]; suggestedResponses?: string[] } => {
  const lowerText = userMessage.toLowerCase();
  const personality = restaurantPersonalities[context.restaurantId] || restaurantPersonalities['bukka-republic'];

  // Order status queries
  if (lowerText.includes('order') && (lowerText.includes('status') || lowerText.includes('where'))) {
    return {
      text: `Great question! 🚚 Your order is being ${getRandomOrderStage()}. We'll get it to you shortly! Would you like more details?`,
      quickReplies: [
        { id: '1', label: '📍 Track Order', action: 'track_order', orderId: context.lastOrderId },
        { id: '2', label: '❓ When will it arrive?', action: 'custom' },
        { id: '3', label: '📞 Call Restaurant', action: 'escalate' },
      ],
    };
  }

  // Delayed delivery
  if (lowerText.includes('late') || lowerText.includes('delay') || lowerText.includes('taking long')) {
    return {
      text: `😔 We sincerely apologize for the delay! Your order is almost ready and on its way. We value your time and will make this right. Can we help further?`,
      quickReplies: [
        { id: '1', label: '✅ Get refund', action: 'escalate' },
        { id: '2', label: '📍 Track now', action: 'track_order' },
        { id: '3', label: '💬 Speak to manager', action: 'escalate' },
      ],
    };
  }

  // Missing or wrong items
  if (lowerText.includes('missing') || lowerText.includes('wrong') || lowerText.includes('incorrect')) {
    return {
      text: `Oh no! 😞 I'm truly sorry about that. We want to make it right immediately! Please tell me which item(s) are missing or incorrect, and we'll resolve this right away.`,
      quickReplies: [
        { id: '1', label: '🔄 Redeliver correct item', action: 'escalate' },
        { id: '2', label: '💳 Full refund', action: 'escalate' },
        { id: '3', label: '🎁 Partial refund + credit', action: 'escalate' },
      ],
    };
  }

  // Refund or payment issues
  if (lowerText.includes('refund') || lowerText.includes('money') || lowerText.includes('payment')) {
    return {
      text: `📌 We can absolutely help with that! Our support team processes refunds within 24 hours. Please confirm your preferred payment method to receive the refund.`,
      quickReplies: [
        { id: '1', label: '💰 Refund to wallet', action: 'escalate' },
        { id: '2', label: '🏦 Refund to bank account', action: 'escalate' },
        { id: '3', label: '🎫 Voucher/Credit', action: 'escalate' },
      ],
    };
  }

  // Promo and discounts
  if (lowerText.includes('promo') || lowerText.includes('discount') || lowerText.includes('coupon')) {
    return {
      text: `🎉 Perfect timing! We have amazing offers this week: 20% off on orders above ₦2000 (use FOODIE20), Free delivery on first order (use WELCOME), and 15% loyalty discount!`,
      quickReplies: [
        { id: '1', label: '🛒 View all promos', action: 'custom' },
        { id: '2', label: '📋 Browse menu', action: 'view_menu' },
        { id: '3', label: '🎁 Check loyalty points', action: 'custom' },
      ],
    };
  }

  // Delivery time
  if (lowerText.includes('delivery') && (lowerText.includes('time') || lowerText.includes('fast') || lowerText.includes('express'))) {
    return {
      text: `⏱️ Standard delivery takes 30-45 minutes depending on your location. We also offer express 20-minute delivery for ₦500 extra. Want to upgrade?`,
      quickReplies: [
        { id: '1', label: '⚡ Upgrade to express', action: 'custom' },
        { id: '2', label: '📍 Track current order', action: 'track_order' },
        { id: '3', label: '📞 Call driver', action: 'escalate' },
      ],
    };
  }

  // Menu questions
  if (lowerText.includes('menu') || lowerText.includes('what do you') || lowerText.includes('recommend')) {
    return {
      text: `📖 Our menu features a variety of delicious ${getRandomCuisine()} options! What type of dish are you interested in? I can recommend our bestsellers! 🌟`,
      quickReplies: [
        { id: '1', label: '👀 View full menu', action: 'view_menu' },
        { id: '2', label: '⭐ Bestsellers', action: 'custom' },
        { id: '3', label: '🌶️ Spicy options', action: 'custom' },
      ],
    };
  }

  // Quality complaints
  if (lowerText.includes('quality') || lowerText.includes('taste') || lowerText.includes('cold') || lowerText.includes('stale')) {
    return {
      text: `😞 We're sorry the food quality didn't meet your expectations. This is not our standard! Let us know what went wrong, and we'll make it right immediately.`,
      quickReplies: [
        { id: '1', label: '🔄 Redeliver fresh order', action: 'escalate' },
        { id: '2', label: '💳 Full refund', action: 'escalate' },
        { id: '3', label: '📞 Speak to manager', action: 'escalate' },
      ],
    };
  }

  // Allergies and dietary
  if (lowerText.includes('allerg') || lowerText.includes('vegetarian') || lowerText.includes('vegan') || lowerText.includes('gluten')) {
    return {
      text: `🥗 Great that you're being careful! We take allergies and dietary restrictions seriously. Our team can customize any dish. Which ingredients should we avoid?`,
      quickReplies: [
        { id: '1', label: '🥕 Vegetarian options', action: 'view_menu' },
        { id: '2', label: '🌱 Vegan options', action: 'view_menu' },
        { id: '3', label: '📞 Talk to chef', action: 'escalate' },
      ],
    };
  }

  // Greeting
  if (lowerText.includes('hello') || lowerText.includes('hi') || lowerText.includes('hey')) {
    return {
      text: `${personality.emoji} Welcome to ${context.restaurantName}! We're delighted to serve you. How can we help you today? 👋`,
      quickReplies: [
        { id: '1', label: '📍 Track order', action: 'track_order' },
        { id: '2', label: '📋 View menu', action: 'view_menu' },
        { id: '3', label: '❓ Got a question?', action: 'custom' },
      ],
    };
  }

  // Gratitude
  if (lowerText.includes('thank') || lowerText.includes('thanks') || lowerText.includes('appreciate')) {
    return {
      text: `😊 You're very welcome! Your satisfaction is our priority. Enjoy your delicious meal and feel free to reach out anytime! 🙌`,
    };
  }

  // Default response with suggestions
  return {
    text: `That's a great question! 🤔 I'm here to help. You can ask about your order status, menu items, delivery time, or any issues you'd like to resolve.`,
    quickReplies: [
      { id: '1', label: '📍 Track order', action: 'track_order' },
      { id: '2', label: '📋 View menu', action: 'view_menu' },
      { id: '3', label: '📞 Speak to support', action: 'escalate' },
    ],
    suggestedResponses: [
      'Where is my order?',
      'Can I see the menu?',
      'I have a complaint',
    ],
  };
};

// Helper functions
function getRandomOrderStage(): string {
  const stages = [
    'prepared in our kitchen 👨‍🍳',
    'packed and ready to go 📦',
    'out for delivery 🚚',
    'almost at your door 🏠',
  ];
  return stages[Math.floor(Math.random() * stages.length)];
}

function getRandomCuisine(): string {
  const cuisines = [
    'traditional Nigerian 🇳🇬',
    'continental 🌍',
    'seafood 🦐',
    'vegetarian 🥬',
  ];
  return cuisines[Math.floor(Math.random() * cuisines.length)];
}

// Suggested response generator
export const getSuggestedResponses = (messageContext: string): string[] => {
  const suggestions: Record<string, string[]> = {
    order_status: [
      'Can you track my order?',
      'How much longer?',
      'Where is my delivery?',
    ],
    complaint: [
      'I want a refund',
      'Send a replacement',
      'Talk to manager',
    ],
    menu: [
      'What do you recommend?',
      'Show me specials',
      'What\'s vegetarian?',
    ],
    default: [
      'Thanks for helping',
      'That sounds good',
      'Tell me more',
    ],
  };

  return suggestions[messageContext] || suggestions.default;
};

// Escalation logic
export const shouldEscalateToHuman = (messages: string[]): boolean => {
  const escalationKeywords = [
    'manager',
    'escalate',
    'supervisor',
    'owner',
    'complaint',
    'serious',
    'unacceptable',
    'lawyer',
  ];

  const recentMessages = messages.slice(-3).join(' ').toLowerCase();
  return escalationKeywords.some(keyword => recentMessages.includes(keyword));
};

// Issue type detection
export const detectIssueType = (message: string): string => {
  const lowerText = message.toLowerCase();

  if (lowerText.includes('missing') || lowerText.includes('wrong')) return 'wrong_order';
  if (lowerText.includes('late') || lowerText.includes('delay')) return 'order_status';
  if (lowerText.includes('quality') || lowerText.includes('taste') || lowerText.includes('cold'))
    return 'quality';
  if (lowerText.includes('refund') || lowerText.includes('money')) return 'other';

  return 'other';
};
