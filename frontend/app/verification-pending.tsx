import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../src/components';
import { useAppStore } from '../src/store/appStore';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../src/constants/theme';

export default function VerificationPendingScreen() {
  const { partner, approveVerification } = useAppStore();
  const [countdown, setCountdown] = useState(5);

  // Auto-approve simulation after countdown
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      // Auto approve for demo
      approveVerification();
      setTimeout(() => {
        router.replace('/(tabs)');
      }, 500);
    }
  }, [countdown]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Icon */}
        <View style={styles.iconContainer}>
          <Ionicons name="time-outline" size={80} color={COLORS.warning} />
        </View>

        {/* Status */}
        <Text style={styles.title}>Verification Pending</Text>
        <Text style={styles.subtitle}>
          Your documents are being reviewed by our admin team.
        </Text>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons name="person" size={20} color={COLORS.textSecondary} />
            <Text style={styles.infoText}>{partner?.fullName || 'N/A'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="call" size={20} color={COLORS.textSecondary} />
            <Text style={styles.infoText}>{partner?.mobile || 'N/A'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="car" size={20} color={COLORS.textSecondary} />
            <Text style={styles.infoText}>
              {partner?.vehicleType?.toUpperCase()} - {partner?.vehicleNumber || 'N/A'}
            </Text>
          </View>
        </View>

        {/* Demo Notice */}
        <View style={styles.demoNotice}>
          <ActivityIndicator size="small" color={COLORS.primary} />
          <Text style={styles.demoText}>
            Demo: Auto-approval in {countdown} seconds...
          </Text>
        </View>

        {/* Note */}
        <View style={styles.noteBox}>
          <Ionicons name="information-circle" size={20} color={COLORS.info} />
          <Text style={styles.noteText}>
            You won't be able to go online until your verification is approved. 
            This usually takes 24-48 hours in real scenarios.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: COLORS.warning + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    paddingHorizontal: SPACING.lg,
  },
  infoCard: {
    width: '100%',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  infoText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textPrimary,
    marginLeft: SPACING.md,
  },
  demoNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary + '15',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.full,
    marginBottom: SPACING.lg,
  },
  demoText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.primary,
    fontWeight: '600',
    marginLeft: SPACING.sm,
  },
  noteBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.info + '15',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    width: '100%',
  },
  noteText: {
    flex: 1,
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginLeft: SPACING.sm,
    lineHeight: 20,
  },
});
