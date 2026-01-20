import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Sparkles, Clock, Flame, DollarSign, Star } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import AppColors from '@/constants/colors';

interface RecommendedDish {
  id: string;
  name: string;
  restaurant: string;
  restaurantId: string;
  image: string;
  rating: number;
  price: number;
  prepTime: number; // in minutes
  reason: string; // e.g., "Trending now", "Perfect for lunch", "Budget-friendly"
  badge: 'trending' | 'spicy' | 'budget' | 'quick' | 'healthy' | 'popular';
  cuisine: string;
}

const MOCK_AI_RECOMMENDATIONS: RecommendedDish[] = [
  {
    id: 'dish_1',
    name: 'Jollof Rice + Chicken',
    restaurant: 'Bukka Republic',
    restaurantId: 'r1',
    image: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=300&h=300&fit=crop',
    rating: 4.6,
    price: 2500,
    prepTime: 25,
    reason: 'Most popular Nigerian dish',
    badge: 'popular',
    cuisine: 'Nigerian',
  },
  {
    id: 'dish_2',
    name: 'Chicken Shawarma (Spicy)',
    restaurant: 'Shawarma Plug',
    restaurantId: 'r2',
    image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=300&h=300&fit=crop',
    rating: 4.5,
    price: 1200,
    prepTime: 20,
    reason: 'Trending in your area',
    badge: 'spicy',
    cuisine: 'Middle Eastern',
  },
  {
    id: 'dish_3',
    name: 'Amala + Abula',
    restaurant: 'The Amala Room',
    restaurantId: 'r3',
    image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=300&h=300&fit=crop',
    rating: 4.7,
    price: 2000,
    prepTime: 22,
    reason: 'Traditional favorite',
    badge: 'popular',
    cuisine: 'Yoruba',
  },
  {
    id: 'dish_4',
    name: 'Suya Platter',
    restaurant: 'Mainland Kitchen',
    restaurantId: 'r4',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=300&h=300&fit=crop',
    rating: 4.6,
    price: 1500,
    prepTime: 18,
    reason: 'Quick and delicious',
    badge: 'quick',
    cuisine: 'Nigerian',
  },
  {
    id: 'dish_5',
    name: 'Fried Rice + Turkey',
    restaurant: 'Bukka Republic',
    restaurantId: 'r1',
    image: 'https://images.unsplash.com/photo-1516714819001-8ee7a13b71d7?w=300&h=300&fit=crop',
    rating: 4.6,
    price: 3000,
    prepTime: 25,
    reason: 'Perfect for lunch',
    badge: 'healthy',
    cuisine: 'Nigerian',
  },
];

const getBadgeColor = (badge: string): { bg: string; text: string; icon: React.ReactNode } => {
  switch (badge) {
    case 'healthy':
      return {
        bg: '#E8F5E9',
        text: '#2E7D32',
        icon: <Star size={12} color="#2E7D32" />,
      };
    case 'spicy':
      return {
        bg: '#FFEBEE',
        text: '#C62828',
        icon: <Flame size={12} color="#C62828" />,
      };
    case 'quick':
      return {
        bg: '#E3F2FD',
        text: '#1565C0',
        icon: <Clock size={12} color="#1565C0" />,
      };
    case 'budget':
      return {
        bg: '#FFF3E0',
        text: '#E65100',
        icon: <DollarSign size={12} color="#E65100" />,
      };
    case 'trending':
      return {
        bg: '#F3E5F5',
        text: '#6A1B9A',
        icon: <Sparkles size={12} color="#6A1B9A" />,
      };
    case 'popular':
      return {
        bg: '#FCE4EC',
        text: '#AD1457',
        icon: <Star size={12} color="#AD1457" />,
      };
    default:
      return {
        bg: '#F5F5F5',
        text: '#616161',
        icon: <Sparkles size={12} color="#616161" />,
      };
  }
};

const getBadgeLabel = (badge: string): string => {
  switch (badge) {
    case 'healthy':
      return 'Healthy';
    case 'spicy':
      return 'Spicy';
    case 'quick':
      return 'Quick';
    case 'budget':
      return 'Budget';
    case 'trending':
      return 'Trending';
    case 'popular':
      return 'Popular';
    default:
      return 'Recommended';
  }
};

export default function AIFoodRecommendations() {
  const router = useRouter();
  const [loading] = useState(false);

  const handleDishPress = (dish: RecommendedDish) => {
    // Navigate to restaurant detail, could scroll to specific item
    router.push({
      pathname: '/(user)/restaurant/[id]',
      params: { id: dish.restaurantId },
    });
  };

  const badgeInfo = (badge: string) => getBadgeColor(badge);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleWrap}>
          <Sparkles size={20} color="#1B5E20" strokeWidth={2} />
          <Text style={styles.headerTitle}>AI Picks For You</Text>
        </View>
        <Text style={styles.headerSubtitle}>Personalized just for you</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1B5E20" />
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.carouselContainer}
          contentContainerStyle={styles.carouselContent}
        >
          {MOCK_AI_RECOMMENDATIONS.map((dish) => {
            const badge = badgeInfo(dish.badge);
            return (
              <TouchableOpacity
                key={dish.id}
                style={styles.dishCard}
                onPress={() => handleDishPress(dish)}
                activeOpacity={0.85}
              >
                {/* Image with overlay */}
                <View style={styles.imageContainer}>
                  <Image
                    source={{ uri: dish.image }}
                    style={styles.dishImage}
                    defaultSource={require('@/assets/images/image.png')}
                  />
                  <View style={styles.overlay} />

                  {/* Badge */}
                  <View
                    style={[
                      styles.badgeTag,
                      { backgroundColor: badge.bg },
                    ]}
                  >
                    <View style={styles.badgeContent}>
                      {badge.icon}
                      <Text
                        style={[
                          styles.badgeLabel,
                          { color: badge.text },
                        ]}
                      >
                        {getBadgeLabel(dish.badge)}
                      </Text>
                    </View>
                  </View>

                  {/* Rating */}
                  <View style={styles.ratingTag}>
                    <Star size={12} color="#FFD700" fill="#FFD700" />
                    <Text style={styles.ratingText}>{dish.rating}</Text>
                  </View>
                </View>

                {/* Content */}
                <View style={styles.content}>
                  <Text style={styles.dishName} numberOfLines={2}>
                    {dish.name}
                  </Text>
                  <Text style={styles.restaurantName} numberOfLines={1}>
                    {dish.restaurant}
                  </Text>
                  <Text style={styles.reason} numberOfLines={1}>
                    {dish.reason}
                  </Text>

                  {/* Metrics */}
                  <View style={styles.metricsRow}>
                    <View style={styles.metric}>
                      <Clock size={13} color="#666" />
                      <Text style={styles.metricText}>{dish.prepTime}m</Text>
                    </View>
                    <View style={styles.metric}>
                      <DollarSign size={13} color="#666" />
                      <Text style={styles.metricText}>${dish.price}</Text>
                    </View>
                  </View>

                  {/* CTA Button */}
                  <TouchableOpacity
                    style={styles.ctaButton}
                    onPress={() => handleDishPress(dish)}
                  >
                    <Text style={styles.ctaText}>View & Order</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}

      {/* Footer hint */}
      <View style={styles.footerHint}>
        <Text style={styles.hintText}>Swipe for more AI picks →</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    backgroundColor: '#FAFAFA',
    paddingVertical: 16,
  },
  header: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  headerTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1B5E20',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#888',
    fontWeight: '400',
    marginTop: 2,
  },
  carouselContainer: {
    marginHorizontal: 0,
  },
  carouselContent: {
    paddingHorizontal: 12,
    gap: 12,
  },
  dishCard: {
    width: 180,
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  imageContainer: {
    width: '100%',
    height: 140,
    position: 'relative',
    overflow: 'hidden',
  },
  dishImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E0E0E0',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
  },
  badgeTag: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  badgeLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  ratingTag: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 6,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#333',
  },
  content: {
    padding: 12,
  },
  dishName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1B5E20',
    marginBottom: 4,
    lineHeight: 18,
  },
  restaurantName: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
    marginBottom: 3,
  },
  reason: {
    fontSize: 11,
    color: '#888',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 10,
  },
  metric: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  metricText: {
    fontSize: 11,
    color: '#666',
    fontWeight: '500',
  },
  ctaButton: {
    backgroundColor: '#1B5E20',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  ctaText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  loadingContainer: {
    height: 280,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerHint: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  hintText: {
    fontSize: 11,
    color: '#AAA',
    fontStyle: 'italic',
    textAlign: 'center',
  },
});
