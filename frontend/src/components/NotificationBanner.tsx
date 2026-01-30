import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../constants/theme';
import { useAppStore } from '../store/appStore';

export const NotificationBanner: React.FC = () => {
  const { notifications, clearNotification } = useAppStore();
  const latestNotification = notifications[0];
  const opacity = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (latestNotification) {
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.delay(3000),
        Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]).start(() => {
        clearNotification(latestNotification.id);
      });
    }
  }, [latestNotification?.id]);

  if (!latestNotification) return null;

  const getColors = () => {
    switch (latestNotification.type) {
      case 'success': return { bg: COLORS.success, icon: 'checkmark-circle' };
      case 'warning': return { bg: COLORS.warning, icon: 'warning' };
      case 'error': return { bg: COLORS.error, icon: 'close-circle' };
      default: return { bg: COLORS.info, icon: 'information-circle' };
    }
  };

  const colors = getColors();

  return (
    <Animated.View style={[styles.container, { backgroundColor: colors.bg, opacity }]}>
      <Ionicons name={colors.icon as any} size={24} color={COLORS.white} />
      <Text style={styles.message} numberOfLines={2}>
        {latestNotification.message}
      </Text>
      <TouchableOpacity
        onPress={() => clearNotification(latestNotification.id)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="close" size={20} color={COLORS.white} />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: SPACING.md,
    right: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    zIndex: 1000,
  },
  message: {
    flex: 1,
    color: COLORS.white,
    fontSize: FONTS.sizes.md,
    fontWeight: '500',
    marginHorizontal: SPACING.sm,
  },
});
