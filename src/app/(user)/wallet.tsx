import Button from '@/components/ui/Button';
import { Colors } from '@/constants/colors';
import Theme from '@/constants/theme';
import { loyaltyRewards, loyaltyTransactions } from '@/services/mockData';
import { useRouter } from 'expo-router';
import { ArrowDown, ArrowUp, Award, ChevronRight, Gift, TrendingUp, X } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Alert,
    FlatList,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function WalletScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [totalPoints] = useState(250);

    const currentTier = totalPoints < 500 ? 'Bronze' : totalPoints < 1000 ? 'Silver' : 'Gold';
    const nextTier = currentTier === 'Bronze' ? 'Silver' : currentTier === 'Silver' ? 'Gold' : 'Platinum';
    const pointsToNextTier = currentTier === 'Bronze' ? 500 - totalPoints : currentTier === 'Silver' ? 1000 - totalPoints : 0;

    const handleRedeemReward = (reward: any) => {
        if (totalPoints >= reward.pointsCost) {
            Alert.alert(
                'Redeem Reward',
                `Redeem ${reward.title} for ${reward.pointsCost} points?`,
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Redeem', onPress: () => Alert.alert('Success', 'Reward redeemed!') },
                ]
            );
        } else {
            Alert.alert('Insufficient Points', `You need ${reward.pointsCost - totalPoints} more points.`);
        }
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <X size={24} color={Colors.light.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Wallet</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}>
                {/* Points Balance Card */}
                <View style={styles.balanceCard}>
                    <View style={styles.balanceHeader}>
                        <Award size={32} color={Colors.light.rating} fill={Colors.light.rating} />
                        <View style={styles.tierBadge}>
                            <Text style={styles.tierText}>{currentTier}</Text>
                        </View>
                    </View>
                    <Text style={styles.pointsLabel}>Total Points</Text>
                    <Text style={styles.pointsValue}>{totalPoints.toLocaleString()}</Text>

                    {currentTier !== 'Gold' && (
                        <View style={styles.progressSection}>
                            <View style={styles.progressBar}>
                                <View style={[styles.progressFill, { width: `${(totalPoints / (currentTier === 'Bronze' ? 500 : 1000)) * 100}%` }]} />
                            </View>
                            <Text style={styles.progressText}>
                                {pointsToNextTier} points to {nextTier} tier
                            </Text>
                        </View>
                    )}
                </View>

                {/* How to Earn Points */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>How to Earn Points</Text>
                    <View style={styles.infoCard}>
                        <View style={styles.infoRow}>
                            <View style={styles.infoIcon}>
                                <TrendingUp size={20} color={Colors.light.primary} />
                            </View>
                            <View style={styles.infoContent}>
                                <Text style={styles.infoTitle}>Order & Earn</Text>
                                <Text style={styles.infoSubtitle}>Get 10 points for every ₦100 spent</Text>
                            </View>
                        </View>
                        <View style={styles.infoRow}>
                            <View style={styles.infoIcon}>
                                <Gift size={20} color={Colors.light.secondary} />
                            </View>
                            <View style={styles.infoContent}>
                                <Text style={styles.infoTitle}>Refer Friends</Text>
                                <Text style={styles.infoSubtitle}>Earn 100 points per referral</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Rewards Catalog */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Redeem Rewards</Text>
                    <FlatList
                        data={loyaltyRewards}
                        keyExtractor={(item) => item.id}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.rewardsList}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.rewardCard}
                                onPress={() => handleRedeemReward(item)}
                                activeOpacity={0.7}
                            >
                                <View style={styles.rewardBadge}>
                                    <Award size={24} color={Colors.light.rating} />
                                </View>
                                <Text style={styles.rewardTitle}>{item.title}</Text>
                                <Text style={styles.rewardDiscount}>{item.discount}</Text>
                                <View style={styles.rewardFooter}>
                                    <Text style={styles.rewardCost}>{item.pointsCost} pts</Text>
                                    {totalPoints >= item.pointsCost ? (
                                        <View style={styles.rewardAvailable}>
                                            <Text style={styles.rewardAvailableText}>Available</Text>
                                        </View>
                                    ) : (
                                        <View style={styles.rewardLocked}>
                                            <Text style={styles.rewardLockedText}>Locked</Text>
                                        </View>
                                    )}
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                </View>

                {/* Transaction History */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Recent Activity</Text>
                        <TouchableOpacity>
                            <Text style={styles.seeAll}>See all</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.transactionsList}>
                        {loyaltyTransactions.map((transaction) => (
                            <View key={transaction.id} style={styles.transactionItem}>
                                <View style={[
                                    styles.transactionIcon,
                                    transaction.type === 'earned' ? styles.earnedIcon : styles.redeemedIcon
                                ]}>
                                    {transaction.type === 'earned' ? (
                                        <ArrowUp size={16} color={Colors.light.secondary} />
                                    ) : (
                                        <ArrowDown size={16} color={Colors.light.error} />
                                    )}
                                </View>
                                <View style={styles.transactionContent}>
                                    <Text style={styles.transactionDescription}>{transaction.description}</Text>
                                    <Text style={styles.transactionDate}>{new Date(transaction.date).toLocaleDateString()}</Text>
                                </View>
                                <Text style={[
                                    styles.transactionPoints,
                                    transaction.type === 'earned' ? styles.earnedPoints : styles.redeemedPoints
                                ]}>
                                    {transaction.type === 'earned' ? '+' : ''}{transaction.points}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>
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
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: 12,
        backgroundColor: Colors.light.card,
        borderBottomWidth: 1,
        borderBottomColor: Colors.light.border,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.light.backgroundAlt,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: Theme.typography.fontWeight.bold,
        color: Colors.light.text,
    },
    balanceCard: {
        margin: 20,
        padding: 24,
        backgroundColor: Colors.light.primary,
        borderRadius: Theme.borderRadius.large,
        shadowColor: Colors.light.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 6,
    },
    balanceHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    tierBadge: {
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    tierText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    pointsLabel: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.9)',
        fontWeight: '500',
    },
    pointsValue: {
        fontSize: 48,
        fontWeight: '800',
        color: '#FFFFFF',
        marginTop: 4,
    },
    progressSection: {
        marginTop: 20,
    },
    progressBar: {
        height: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 4,
    },
    progressText: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.9)',
        marginTop: 8,
        fontWeight: '500',
    },
    section: {
        marginHorizontal: 20,
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: Theme.typography.fontWeight.bold,
        color: Colors.light.text,
        marginBottom: 12,
    },
    seeAll: {
        fontSize: 14,
        color: Colors.light.primary,
        fontWeight: '600',
    },
    infoCard: {
        backgroundColor: Colors.light.card,
        borderRadius: Theme.borderRadius.medium,
        padding: 16,
        gap: 16,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    infoIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.light.backgroundAlt,
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoContent: {
        flex: 1,
    },
    infoTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: Colors.light.text,
        marginBottom: 2,
    },
    infoSubtitle: {
        fontSize: 13,
        color: Colors.light.textSecondary,
    },
    rewardsList: {
        paddingRight: 20,
    },
    rewardCard: {
        width: 160,
        backgroundColor: Colors.light.card,
        borderRadius: Theme.borderRadius.medium,
        padding: 16,
        marginRight: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    rewardBadge: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#FFF9E6',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    rewardTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: Colors.light.text,
        marginBottom: 4,
    },
    rewardDiscount: {
        fontSize: 13,
        color: Colors.light.textSecondary,
        marginBottom: 12,
    },
    rewardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    rewardCost: {
        fontSize: 14,
        fontWeight: '700',
        color: Colors.light.primary,
    },
    rewardAvailable: {
        backgroundColor: '#D1FAE5',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    rewardAvailableText: {
        fontSize: 10,
        fontWeight: '600',
        color: '#065F46',
    },
    rewardLocked: {
        backgroundColor: Colors.light.border,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    rewardLockedText: {
        fontSize: 10,
        fontWeight: '600',
        color: Colors.light.textSecondary,
    },
    transactionsList: {
        gap: 12,
    },
    transactionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.light.card,
        padding: 14,
        borderRadius: Theme.borderRadius.medium,
    },
    transactionIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    earnedIcon: {
        backgroundColor: '#D1FAE5',
    },
    redeemedIcon: {
        backgroundColor: '#FEE2E2',
    },
    transactionContent: {
        flex: 1,
    },
    transactionDescription: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.light.text,
        marginBottom: 2,
    },
    transactionDate: {
        fontSize: 12,
        color: Colors.light.textSecondary,
    },
    transactionPoints: {
        fontSize: 16,
        fontWeight: '700',
    },
    earnedPoints: {
        color: Colors.light.secondary,
    },
    redeemedPoints: {
        color: Colors.light.error,
    },
});
