import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../src/components';
import { useAppStore } from '../../src/store/appStore';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../../src/constants/theme';

export default function EarningsScreen() {
  const { earnings, deliveryHistory } = useAppStore();

  // Calculate per-order average
  const avgPerOrder = earnings.todayDeliveries > 0 
    ? Math.round(earnings.today / earnings.todayDeliveries) 
    : 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Earnings</Text>
          <Text style={styles.subtitle}>Track your income</Text>
        </View>

        {/* Today's Earnings Card */}
        <Card style={styles.todayCard} variant="elevated">
          <View style={styles.todayHeader}>
            <Ionicons name="today" size={20} color={COLORS.primary} />
            <Text style={styles.todayLabel}>Today's Earnings</Text>
          </View>
          <Text style={styles.todayAmount}>₹{earnings.today}</Text>
          <View style={styles.todayStats}>
            <View style={styles.todayStat}>
              <Text style={styles.todayStatValue}>{earnings.todayDeliveries}</Text>
              <Text style={styles.todayStatLabel}>Deliveries</Text>
            </View>
            <View style={styles.todayStatDivider} />
            <View style={styles.todayStat}>
              <Text style={styles.todayStatValue}>₹{avgPerOrder}</Text>
              <Text style={styles.todayStatLabel}>Avg per order</Text>
            </View>
          </View>
        </Card>

        {/* Weekly & Monthly Summary */}
        <View style={styles.summaryRow}>
          <Card style={styles.summaryCard}>
            <View style={styles.summaryIconContainer}>
              <Ionicons name="calendar" size={24} color={COLORS.secondary} />
            </View>
            <Text style={styles.summaryTitle}>This Week</Text>
            <Text style={styles.summaryAmount}>₹{earnings.thisWeek}</Text>
            <Text style={styles.summaryDeliveries}>
              {earnings.weeklyDeliveries} deliveries
            </Text>
          </Card>

          <Card style={styles.summaryCard}>
            <View style={[styles.summaryIconContainer, { backgroundColor: COLORS.success + '15' }]}>
              <Ionicons name="calendar-outline" size={24} color={COLORS.success} />
            </View>
            <Text style={styles.summaryTitle}>This Month</Text>
            <Text style={styles.summaryAmount}>₹{earnings.thisMonth}</Text>
            <Text style={styles.summaryDeliveries}>
              {earnings.monthlyDeliveries} deliveries
            </Text>
          </Card>
        </View>

        {/* Recent Earnings */}
        <Card style={styles.recentCard}>
          <Text style={styles.sectionTitle}>Recent Earnings</Text>
          {deliveryHistory.filter(d => d.status === 'delivered').slice(0, 5).map((delivery) => (
            <View key={delivery.id} style={styles.earningItem}>
              <View style={styles.earningInfo}>
                <Text style={styles.earningRestaurant}>{delivery.restaurantName}</Text>
                <Text style={styles.earningDate}>{delivery.date}</Text>
              </View>
              <Text style={styles.earningAmount}>₹{delivery.earnings}</Text>
            </View>
          ))}
        </Card>

        {/* Info Note */}
        <View style={styles.infoNote}>
          <Ionicons name="information-circle" size={20} color={COLORS.info} />
          <Text style={styles.infoText}>
            Earnings are calculated based on distance, order value, and incentives. 
            Payouts are processed weekly to your registered bank account.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.md,
  },
  header: {
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  todayCard: {
    backgroundColor: COLORS.primary,
    marginBottom: SPACING.md,
  },
  todayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  todayLabel: {
    fontSize: FONTS.sizes.md,
    color: COLORS.white,
    marginLeft: SPACING.sm,
    opacity: 0.9,
  },
  todayAmount: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.white,
    marginVertical: SPACING.md,
  },
  todayStats: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: COLORS.white + '30',
    paddingTop: SPACING.md,
  },
  todayStat: {
    flex: 1,
    alignItems: 'center',
  },
  todayStatValue: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '600',
    color: COLORS.white,
  },
  todayStatLabel: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.white,
    opacity: 0.8,
    marginTop: 2,
  },
  todayStatDivider: {
    width: 1,
    backgroundColor: COLORS.white + '30',
  },
  summaryRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  summaryCard: {
    flex: 1,
    alignItems: 'center',
  },
  summaryIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.secondary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  summaryTitle: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
  },
  summaryAmount: {
    fontSize: FONTS.sizes.xl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginVertical: SPACING.xs,
  },
  summaryDeliveries: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
  },
  recentCard: {
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  earningItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  earningInfo: {
    flex: 1,
  },
  earningRestaurant: {
    fontSize: FONTS.sizes.md,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },
  earningDate: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  earningAmount: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '600',
    color: COLORS.success,
  },
  infoNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.info + '15',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
  },
  infoText: {
    flex: 1,
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginLeft: SPACING.sm,
    lineHeight: 20,
  },
});
