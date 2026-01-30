import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Card, StatusBadge } from '../../src/components';
import { useAppStore } from '../../src/store/appStore';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../../src/constants/theme';
import { DeliveryHistory } from '../../src/types';

export default function HistoryScreen() {
  const { deliveryHistory } = useAppStore();

  const renderHistoryItem = ({ item }: { item: DeliveryHistory }) => (
    <Card style={styles.historyCard}>
      <View style={styles.historyHeader}>
        <View style={styles.orderIdBadge}>
          <Text style={styles.orderIdText}>{item.orderId}</Text>
        </View>
        <StatusBadge status={item.status} size="small" />
      </View>

      <View style={styles.historyBody}>
        <View style={styles.historyRow}>
          <Ionicons name="restaurant" size={18} color={COLORS.textSecondary} />
          <Text style={styles.historyText}>{item.restaurantName}</Text>
        </View>
        <View style={styles.historyRow}>
          <Ionicons name="location" size={18} color={COLORS.textSecondary} />
          <Text style={styles.historyText}>{item.dropArea}</Text>
        </View>
        <View style={styles.historyRow}>
          <Ionicons name="calendar" size={18} color={COLORS.textSecondary} />
          <Text style={styles.historyText}>{item.date}</Text>
        </View>
      </View>

      {item.status === 'delivered' && (
        <View style={styles.earningsRow}>
          <Text style={styles.earningsLabel}>Earnings</Text>
          <Text style={styles.earningsValue}>₹{item.earnings}</Text>
        </View>
      )}
    </Card>
  );

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="document-text-outline" size={64} color={COLORS.textDisabled} />
      <Text style={styles.emptyTitle}>No Delivery History</Text>
      <Text style={styles.emptyText}>
        Your completed deliveries will appear here.
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Delivery History</Text>
        <Text style={styles.subtitle}>{deliveryHistory.length} deliveries</Text>
      </View>

      {/* Stats Summary */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>
            {deliveryHistory.filter(d => d.status === 'delivered').length}
          </Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Text style={styles.statValue}>
            {deliveryHistory.filter(d => d.status === 'cancelled').length}
          </Text>
          <Text style={styles.statLabel}>Cancelled</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Text style={styles.statValue}>
            ₹{deliveryHistory.filter(d => d.status === 'delivered').reduce((sum, d) => sum + d.earnings, 0)}
          </Text>
          <Text style={styles.statLabel}>Total Earned</Text>
        </View>
      </View>

      {/* History List */}
      <FlatList
        data={deliveryHistory}
        renderItem={renderHistoryItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyList}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
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
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: FONTS.sizes.xl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  statLabel: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: COLORS.border,
  },
  listContent: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.lg,
  },
  historyCard: {
    marginBottom: SPACING.md,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  orderIdBadge: {
    backgroundColor: COLORS.primary + '15',
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
  },
  orderIdText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    color: COLORS.primary,
  },
  historyBody: {
    gap: SPACING.sm,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    marginLeft: SPACING.sm,
  },
  earningsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  earningsLabel: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
  },
  earningsValue: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '600',
    color: COLORS.success,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xxl,
  },
  emptyTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginTop: SPACING.md,
  },
  emptyText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.sm,
  },
});
