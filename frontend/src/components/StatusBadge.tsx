import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../constants/theme';

interface StatusBadgeProps {
  status: 'online' | 'offline' | 'pending' | 'blocked' | 'delivered' | 'cancelled';
  size?: 'small' | 'medium';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'medium' }) => {
  const getColors = () => {
    switch (status) {
      case 'online': return { bg: COLORS.success + '20', text: COLORS.success };
      case 'offline': return { bg: COLORS.offline + '20', text: COLORS.offline };
      case 'pending': return { bg: COLORS.warning + '20', text: COLORS.warning };
      case 'blocked': return { bg: COLORS.error + '20', text: COLORS.error };
      case 'delivered': return { bg: COLORS.success + '20', text: COLORS.success };
      case 'cancelled': return { bg: COLORS.error + '20', text: COLORS.error };
      default: return { bg: COLORS.offline + '20', text: COLORS.offline };
    }
  };

  const getLabel = () => {
    switch (status) {
      case 'online': return 'Online';
      case 'offline': return 'Offline';
      case 'pending': return 'Pending';
      case 'blocked': return 'Blocked';
      case 'delivered': return 'Delivered';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  const colors = getColors();
  const isSmall = size === 'small';

  return (
    <View style={[
      styles.badge,
      { backgroundColor: colors.bg },
      isSmall && styles.badgeSmall,
    ]}>
      <View style={[styles.dot, { backgroundColor: colors.text }]} />
      <Text style={[
        styles.text,
        { color: colors.text },
        isSmall && styles.textSmall,
      ]}>
        {getLabel()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
  },
  badgeSmall: {
    paddingVertical: 2,
    paddingHorizontal: SPACING.xs,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: SPACING.xs,
  },
  text: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
  },
  textSmall: {
    fontSize: FONTS.sizes.xs,
  },
});
